const express = require("express");
const app = express();
const errorHandler = require("./util/errorHandler");

const { PORT } = require("./util/config");

const { tokenExtractor } = require("./util/middleware");

app.use(tokenExtractor);

const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginsRouter = require("./controllers/logins");

// initialize model
require("./models/user");

app.use(express.json());

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginsRouter);

// error middleware MUST be last
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
