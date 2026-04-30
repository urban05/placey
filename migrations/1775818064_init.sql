CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE
  places (
    id UUID PRIMARY KEY,
    "name" VARCHAR,
    cords GEOGRAPHY,
    icon VARCHAR,
    verified BOOLEAN,
    address VARCHAR,
    description VARCHAR,
    image VARCHAR
  );

CREATE TABLE
  users (
    id UUID PRIMARY KEY,
    email VARCHAR UNIQUE,
    username VARCHAR UNIQUE,
    otp VARCHAR
  );

CREATE TABLE
  votes (
    place_id UUID REFERENCES places (id),
    user_id UUID REFERENCES users (id),
    vote INTEGER,
    PRIMARY KEY (place_id, user_id)
  );

CREATE TABLE
  users_place (
    place_id UUID REFERENCES places (id),
    user_id UUID REFERENCES users (id),
    first_visit TIMESTAMPTZ,
    PRIMARY KEY (place_id, user_id)
  );