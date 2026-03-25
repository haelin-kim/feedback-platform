-- Exchange threads (manager <-> direct report)
CREATE TABLE exchange_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  manager_id UUID NOT NULL REFERENCES users(id),
  direct_report_id UUID NOT NULL REFERENCES users(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, manager_id, direct_report_id)
);

-- Calendar links
CREATE TABLE calendar_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  exchange_thread_id UUID NOT NULL REFERENCES exchange_threads(id),
  linked_by_user_id UUID NOT NULL REFERENCES users(id),
  google_calendar_event_id VARCHAR(255) NOT NULL,
  google_calendar_id VARCHAR(255) DEFAULT 'primary',
  event_summary VARCHAR(500),
  recurrence_rule TEXT,
  next_occurrence_at TIMESTAMPTZ,
  oauth_token_encrypted TEXT NOT NULL,
  oauth_refresh_token_encrypted TEXT NOT NULL,
  last_synced_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(exchange_thread_id)
);

-- AI feedback summaries
CREATE TABLE ai_feedback_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exchange_thread_id UUID NOT NULL REFERENCES exchange_threads(id),
  summary_text TEXT NOT NULL,
  strengths JSONB,
  improvement_areas JSONB,
  bi_directionality_score NUMERIC(3,2),
  feedback_cadence_pct NUMERIC(5,2),
  generated_at TIMESTAMPTZ DEFAULT now(),
  model_version VARCHAR(50),
  UNIQUE(exchange_thread_id)
);

-- Add FK from feedback_entries to exchange_threads
ALTER TABLE feedback_entries
  ADD CONSTRAINT fk_feedback_exchange
  FOREIGN KEY (exchange_thread_id) REFERENCES exchange_threads(id);
