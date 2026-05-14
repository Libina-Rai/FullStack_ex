const express = require("express");
const app = express();
const errorHandler = require("./util/errorHandler");

const { PORT } = require("./util/config");

const blogsRouter = require("./controllers/blogs");

app.use(express.json());

app.use("/api/blogs", blogsRouter);

// error middleware MUST be last
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
