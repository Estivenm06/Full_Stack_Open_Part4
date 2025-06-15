require("dotenv").config()
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { MONGODB_URI } = require("./utils/config");
const blogRouter = require("./routers/blogRouter");
const userRouter = require("./routers/userRouter");
const loginRouter = require("./routers/loginRouter");
const {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
} = require("./utils/middleware");
const User = require('./models/user')
const Blog = require('./models/blog')
const bcrypt = require("bcryptjs");
const initialBlogs = require('./utils/initial').initialBlogs
const initialUsers = require('./utils/initial').initialUsers

const app = express();
mongoose.set("strictQuery", false);
console.log("Connecting to", MONGODB_URI);
mongoose.connect(MONGODB_URI);

app.use(cors());
app.use(express.json());
app.use(tokenExtractor);
app.use(requestLogger);
app.use("/api/blogs", userExtractor, blogRouter);
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);
app.use("/api/testing/reset", async ( request, response ) => {
  // This endpoint is for testing purposes only
  // It will delete all blogs and users from the database
  await User.deleteMany({});
  await Blog.deleteMany({});
  response.status(204).end();
})
app.use(unknownEndpoint);
app.use(errorHandler);

(async () => {
  try{
    await Blog.deleteMany({});
    await User.deleteMany({});
  
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(initialUsers.password, saltRounds);
    const user = new User({
      username: initialUsers.username,
      name: initialUsers.name,
      passwordHash,
    });
  
    const savedUser = await user.save();
    const blogsObjects = initialBlogs.map(
      (blog) => new Blog({ ...blog, user: savedUser.id })
    );
    const blogsSaved = blogsObjects.map((e) => e.save());
    await Promise.all(blogsSaved);
    console.log("Connected to MongoDB and initial data loaded");
  }catch(error){
    console.log("Error connecting to MongoDB:", error.message);
    
  }
  
})();

module.exports = app;
