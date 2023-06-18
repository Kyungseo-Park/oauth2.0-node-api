-- use postgres 


CREATE DATABASE IF NOT EXISTS oauth;

\c oauth;

CREATE TABLE IF NOT EXISTS oauth_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  password text NOT NULL,
  password_changed_at timestamp NOT NULL NOT NULL DEFAULT CURRENT_TIMESTAMP,
  first_name text NOT NULL,
  middle_name text,
  last_name text NOT NULL,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at timestamp
);

-- unique email
CREATE UNIQUE INDEX IF NOT EXISTS oauth_users_email_uindex ON oauth_users (email);
