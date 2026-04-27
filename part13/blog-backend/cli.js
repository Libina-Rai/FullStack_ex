const pool = require("./db");
require("dotenv").config();

const getBlogs = async () => {
  const result = await pool.query("SELECT * FROM blogs");
  return result.rows;
};

const printBlogs = (blogs) => {
  blogs.forEach((blog) => {
    console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`);
  });
};

const main = async () => {
  const blogs = await getBlogs();
  printBlogs(blogs);
  pool.end();
};

main();
