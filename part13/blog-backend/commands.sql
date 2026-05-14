CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT,
    url TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    user_id INTEGER
);

SELECT * FROM blogs;