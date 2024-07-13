const blogRouter = require("express").Router();
const Blog = require("../models/blog.js");

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {"username": 1, "name": 1});
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
  const savedBlogs = await (await blog.save()).populate("user", ["username", "name", "id"]);
  user.blogs = user.blogs.concat(savedBlogs._id);
  await user.save();
  try{
  response.status(201).json(savedBlogs);
  }catch(err){next(err)}
});

blogRouter.put("/:id", async (request, response, next) => {
  try{
  const blog = await Blog.findById(request.params.id)
  const user = request.user
  const {title, author, url, likes} = request.body

  if(blog.user.toString() !== user._id.toString()){
    return response
    .status(401)
    .json({error: "Only the creator can update blogs"})
  }

  const updatedBlog = await Blog.findByIdAndUpdate(blog._id, {title, author, url, likes}, {new: true})
    response.json(updatedBlog);
  }catch(err){next(err)}
});

blogRouter.delete("/:id", async (request, response, next) => {
  const blog = await Blog.findById(request.params.id)
  const user = request.user

  if (blog.user.toString() !==  user.id.toString()) {
    return response
      .status(401)
      .json({ error: "Only the creator can delete blogs" });
  }
  user.blogs = user.blogs.filter((e) => e.toString() === blog.id.toString());
  await blog.deleteOne();
  try{
    response.status(204).end();
  }catch(err){next(err)}
});

module.exports = blogRouter;
