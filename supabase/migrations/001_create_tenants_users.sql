-- Tenants
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  domain VARCHAR(255),
  plan_tier VARCHAR(20) DEFAULT 'growth',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Departments
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name VARCHAR(255) NOT NULL,
  parent_department_id UUID REFERENCES departments(id),
  head_user_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Users (linked to Supabase Auth)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  email VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  display_name VARCHAR(200),
  avatar_url TEXT,
  job_title VARCHAR(200),
  department_id UUID REFERENCES departments(id),
  manager_id UUID REFERENCES users(id),
  role VARCHAR(20) NOT NULL DEFAULT 'employee'
    CHECK (role IN ('admin','manager','employee','executive')),
  hire_date DATE,
  employment_status VARCHAR(20) DEFAULT 'active'
    CHECK (employment_status IN ('active','on_leave','terminated')),
  external_id VARCHAR(255),
  slack_user_id VARCHAR(50),
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, email)
);

-- Default tenant for initial setup
INSERT INTO tenants (id, name, slug, domain)
VALUES ('00000000-0000-0000-0000-000000000001', 'Default', 'default', NULL);
