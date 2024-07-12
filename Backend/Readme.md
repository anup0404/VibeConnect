## databae

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    fullname VARCHAR(100) NOT NULL,
    dob DATE,
    phone_number VARCHAR(20)
);

INSERT INTO users (username, email, password, fullname, dob, phone_number)
VALUES ('john_doe', 'john.doe@example.com', 'hashed_password_here', 'John Doe', '1990-05-15', '+1234567890');
