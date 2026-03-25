-- Enable RLS on all tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE rating_dimensions ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_entry_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_request_peers ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_acknowledgments ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_thread_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE exchange_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_feedback_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE talking_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Users: read own profile
CREATE POLICY users_read_own ON users
  FOR SELECT USING (auth.uid() = id);

-- Users: managers read their direct reports
CREATE POLICY users_read_reports ON users
  FOR SELECT USING (manager_id = auth.uid());

-- Users: admins read all in tenant
CREATE POLICY users_admin_read ON users
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin' AND u.tenant_id = users.tenant_id)
  );

-- Users: update own profile
CREATE POLICY users_update_own ON users
  FOR UPDATE USING (auth.uid() = id);

-- Feedback: author and recipient can read
CREATE POLICY feedback_read ON feedback_entries
  FOR SELECT USING (
    author_id = auth.uid()
    OR recipient_id = auth.uid()
    OR (visibility = 'public')
    OR (visibility = 'private_with_manager'
        AND EXISTS (
          SELECT 1 FROM users
          WHERE id = feedback_entries.recipient_id
          AND manager_id = auth.uid()
        ))
  );

-- Feedback: author must be current user
CREATE POLICY feedback_insert ON feedback_entries
  FOR INSERT WITH CHECK (author_id = auth.uid());

-- Exchange threads: only participants
CREATE POLICY exchange_read ON exchange_threads
  FOR SELECT USING (
    manager_id = auth.uid() OR direct_report_id = auth.uid()
  );

-- Acknowledgments: recipient can acknowledge
CREATE POLICY ack_insert ON feedback_acknowledgments
  FOR INSERT WITH CHECK (acknowledged_by = auth.uid());

CREATE POLICY ack_read ON feedback_acknowledgments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM feedback_entries fe
      WHERE fe.id = feedback_acknowledgments.feedback_id
      AND (fe.author_id = auth.uid() OR fe.recipient_id = auth.uid())
    )
  );

-- Thread replies: participants can read/write
CREATE POLICY replies_read ON feedback_thread_replies
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM feedback_entries fe
      WHERE fe.id = feedback_thread_replies.feedback_id
      AND (fe.author_id = auth.uid() OR fe.recipient_id = auth.uid())
    )
  );

CREATE POLICY replies_insert ON feedback_thread_replies
  FOR INSERT WITH CHECK (author_id = auth.uid());

-- Feedback tags: all authenticated users in tenant can read
CREATE POLICY tags_read ON feedback_tags
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.tenant_id = feedback_tags.tenant_id)
  );

-- AI summaries: thread participants only
CREATE POLICY ai_summary_read ON ai_feedback_summaries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM exchange_threads et
      WHERE et.id = ai_feedback_summaries.exchange_thread_id
      AND (et.manager_id = auth.uid() OR et.direct_report_id = auth.uid())
    )
  );

-- Meeting instances: thread participants
CREATE POLICY meetings_read ON meeting_instances
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM exchange_threads et
      WHERE et.id = meeting_instances.exchange_thread_id
      AND (et.manager_id = auth.uid() OR et.direct_report_id = auth.uid())
    )
  );

-- Talking points: thread participants
CREATE POLICY tp_read ON talking_points
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM exchange_threads et
      WHERE et.id = talking_points.exchange_thread_id
      AND (et.manager_id = auth.uid() OR et.direct_report_id = auth.uid())
    )
  );

CREATE POLICY tp_insert ON talking_points
  FOR INSERT WITH CHECK (author_id = auth.uid());

-- Action items: thread participants
CREATE POLICY ai_read ON action_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM exchange_threads et
      WHERE et.id = action_items.exchange_thread_id
      AND (et.manager_id = auth.uid() OR et.direct_report_id = auth.uid())
    )
  );

CREATE POLICY ai_insert ON action_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM exchange_threads et
      WHERE et.id = action_items.exchange_thread_id
      AND (et.manager_id = auth.uid() OR et.direct_report_id = auth.uid())
    )
  );

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, tenant_id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    '00000000-0000-0000-0000-000000000001',
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    '',
    'employee'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
