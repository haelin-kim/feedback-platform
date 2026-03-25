-- Meeting instances
CREATE TABLE meeting_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  exchange_thread_id UUID NOT NULL REFERENCES exchange_threads(id),
  calendar_link_id UUID REFERENCES calendar_links(id),
  scheduled_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ,
  status VARCHAR(20) DEFAULT 'scheduled'
    CHECK (status IN ('scheduled','completed','cancelled')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Talking points
CREATE TABLE talking_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_instance_id UUID REFERENCES meeting_instances(id),
  exchange_thread_id UUID NOT NULL REFERENCES exchange_threads(id),
  author_id UUID NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  is_discussed BOOLEAN DEFAULT false,
  carried_from_id UUID REFERENCES talking_points(id),
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Action items
CREATE TABLE action_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exchange_thread_id UUID NOT NULL REFERENCES exchange_threads(id),
  meeting_instance_id UUID REFERENCES meeting_instances(id),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  assignee_id UUID NOT NULL REFERENCES users(id),
  description TEXT NOT NULL,
  due_date DATE,
  status VARCHAR(20) DEFAULT 'open'
    CHECK (status IN ('open','completed','cancelled')),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add FK from feedback_entries to meeting_instances
ALTER TABLE feedback_entries
  ADD CONSTRAINT fk_feedback_meeting
  FOREIGN KEY (meeting_instance_id) REFERENCES meeting_instances(id);

-- Add FK from feedback_entries to feedback_requests
ALTER TABLE feedback_entries
  ADD CONSTRAINT fk_feedback_request
  FOREIGN KEY (feedback_request_id) REFERENCES feedback_requests(id);
