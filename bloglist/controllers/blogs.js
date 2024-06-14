const blogRouter = require("express").Router();
const Blog = require("../models/blog.js");
const User = require("../models/user.js");

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {"username": 1, "name": 1, "id":1});
  response.json(blogs);
});

blogRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

blogRouter.post("/", async (request, response, next) => {
  const { title, author, url, likes } = request.body;
  const user = request.user

  const blog = new Blog({
    title: title,
    author: author,
    url: url,
    likes: likes,
    user: user.id,
  });
  try{
  const savedBlogs = await (await blog.save()).populate("user", ["username", "name", "id"]);
  user.blogs = user.blogs.concat(savedBlogs._id);
  await user.save();
  response.status(201).json(savedBlogs);

  }catch(err){next(err)}
});

blogRouter.put("/:id", async (request, response) => {
  const id = request.params.id;
  const body = request.body;
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  const blogs = await Blog.findByIdAndUpdate(id, blog);
  response.json(blogs);
});

blogRouter.delete("/:id", async (request, response) => {
    const decodedToken = getTokenFrom(request, response);
  const blog = await Blog.findById(request.params.id);
  const user = await User.findById(decodedToken.id);

  if (blog.user.toString() !==  user.id.toString()) {
    return response
      .status(401)
      .json({ error: "Only the creator can delete blogs" });
  }

  user.blogs = user.blogs.filter((e) => e.toString() === blog.id.toString());
  await blog.deleteOne();
  response.status(204).end();
});

module.exports = blogRouter;
