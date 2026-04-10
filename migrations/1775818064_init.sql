CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE places (id UUID PRIMARY KEY, "name" VARCHAR, cords GEOGRAPHY, icon VARCHAR, verified BOOLEAN, address VARCHAR, description VARCHAR);
CREATE TABLE users (id UUID PRIMARY KEY, email VARCHAR UNIQUE, username VARCHAR UNIQUE);

CREATE TABLE votes (place_id UUID REFERENCES places(id), user_id UUID REFERENCES users(id), vote INTEGER);
CREATE TABLE users_place (place_id UUID REFERENCES places(id), user_id UUID REFERENCES users(id), first_visit TIMESTAMPTZ);