CREATE DATABASE dip;

\connect dip;



CREATE TABLE access_level (
    access_id SERIAL PRIMARY KEY NOT NULL,
    access_name VARCHAR(50) NOT NULL
);

CREATE TABLE "user" (
    user_id SERIAL PRIMARY KEY NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(300) NOT NULL,
    access_id INTEGER NOT NULL,
    FOREIGN KEY (access_id) REFERENCES access_level (access_id)
);


INSERT INTO access_level (access_name) VALUES ('Пользователь');
INSERT INTO access_level (access_name) VALUES ('Администратор');

