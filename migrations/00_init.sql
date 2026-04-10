CREATE EXTENSION postgis;

CREATE TABLE places (id INTEGER PRIMARY KEY, "name" VARCHAR, cords GEOGRAPHY, icon VARCHAR, verified BOOLEAN);
CREATE TABLE users (id INTEGER PRIMARY KEY, email VARCHAR UNIQUE, username VARCHAR UNIQUE);

CREATE TABLE votes (place_id INTEGER REFERENCES places(id), user_id INTEGER REFERENCES users(id), vote INTEGER);
CREATE TABLE users_place (place_id INTEGER REFERENCES places(id), user_id INTEGER REFERENCES users(id), first_visit TIMESTAMPTZ);
