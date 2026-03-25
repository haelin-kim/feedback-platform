-- Feedback tags
CREATE TABLE feedback_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name VARCHAR(100) NOT NULL,
  category VARCHAR(20) NOT NULL
    CHECK (category IN ('value','skill','custom')),
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Rating dimensions
CREATE TABLE rating_dimensions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Feedback entries (core table)
CREATE TABLE feedback_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  author_id UUID NOT NULL REFERENCES users(id),
  recipient_id UUID NOT NULL REFERENCES users(id),
  type VARCHAR(30) NOT NULL
    CHECK (type IN ('praise','private','request',
      'manager_note','exchange','request_response')),
  content TEXT NOT NULL,
  visibility VARCHAR(20) NOT NULL
    CHECK (visibility IN ('public','private',
      'private_with_manager','manager_only','exchange')),
  direction VARCHAR(10)
    CHECK (direction IN ('downward','upward')),
  exchange_thread_id UUID,
  meeting_instance_id UUID,
  feedback_request_id UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Feedback-tag junction
CREATE TABLE feedback_entry_tags (
  feedback_id UUID NOT NULL REFERENCES feedback_entries(id),
  tag_id UUID NOT NULL REFERENCES feedback_tags(id),
  PRIMARY KEY (feedback_id, tag_id)
);

-- Feedback ratings
CREATE TABLE feedback_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feedback_id UUID NOT NULL REFERENCES feedback_entries(id),
  dimension_id UUID NOT NULL REFERENCES rating_dimensions(id),
  value INT NOT NULL CHECK (value BETWEEN 1 AND 5),
  UNIQUE(feedback_id, dimension_id)
);

-- Feedback requests
CREATE TABLE feedback_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  requester_id UUID NOT NULL REFERENCES users(id),
  context TEXT,
  deadline DATE,
  status VARCHAR(20) DEFAULT 'open'
    CHECK (status IN ('open','closed','expired')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE feedback_request_peers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES feedback_requests(id),
  peer_id UUID NOT NULL REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'pending'
    CHECK (status IN ('pending','completed','declined')),
  completed_at TIMESTAMPTZ,
  UNIQUE(request_id, peer_id)
);

-- Acknowledgments
CREATE TABLE feedback_acknowledgments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feedback_id UUID NOT NULL REFERENCES feedback_entries(id),
  acknowledged_by UUID NOT NULL REFERENCES users(id),
  acknowledged_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(feedback_id, acknowledged_by)
);

-- Thread replies
CREATE TABLE feedback_thread_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feedback_id UUID NOT NULL REFERENCES feedback_entries(id),
  author_id UUID NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
