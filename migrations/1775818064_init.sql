CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE places (id UUID PRIMARY KEY, "name" VARCHAR, cords GEOGRAPHY, icon VARCHAR, verified BOOLEAN);
CREATE TABLE users (id UUID PRIMARY KEY, email VARCHAR UNIQUE, username VARCHAR UNIQUE);

CREATE TABLE votes (place_id UUID REFERENCES places(id), user_id INTEGER REFERENCES users(id), vote INTEGER);
CREATE TABLE users_place (place_id UUID REFERENCES places(id), user_id INTEGER REFERENCES users(id), first_visit TIMESTAMPTZ);