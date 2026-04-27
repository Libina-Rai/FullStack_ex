CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT,
    url TEXT NOT NULL,
    likes INTEGER DEFAULT 0
);

INSERT INTO
    blogs (author, url, title)
VALUES (
        'Dan Abramov',
        'https://react.dev',
        'React Basics'
    ),
    (
        'TJ Holowaychuk',
        'https://expressjs.com',
        'Express Guide'
    );

    SELECT * FROM blogs;