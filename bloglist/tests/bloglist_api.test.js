const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const User = require("../models/user");
const api = supertest(app);
const {
  initialBlogs,
  initialUsers,
  getToken,
  getInvalidToken,
  usersInDb,
  blogsInDb
} = require("./test_helper");

const listWithOneBlog = [
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
  }
]

beforeEach(async () => {
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
  const blogsObjects = initialBlogs.map(e => new Blog({ ...e, "user": savedUser.id}))
  const blogsSaved = blogsObjects.map(e => e.save());
  await Promise.all(blogsSaved);
});

test("blogs are returned as json", async () => {
  const authorization = await getToken()
  await api
    .get("/api/blogs")
    .set("Authorization", authorization)
    .expect(200)
    .expect("Content-Type", /application\/json/);
});
test("verify the unique identifier of the blogs posts named id", async () => {
  const authorization = await getToken()
  const getBlogs = await api.get("/api/blogs").set("Authorization", authorization)
  const result = getBlogs.body.map(e => e.id)
  expect(result).toBeDefined()
})

test("a valid blog can be added", async () => {
  const authorization = await getToken()
  const blogsBeggining = await blogsInDb()
  const newBlog = {
    "title": initialBlogs[0].title,
    "author": initialBlogs[0].author,
    "url": initialBlogs[0].url,
    "likes": initialBlogs[0].likes
  }
  await api
  .post("/api/blogs")
  .set("Authorization", authorization)
  .send(newBlog)
  .expect(201)
  const blogsAtEnd = await blogsInDb()
  expect(blogsAtEnd.length).toEqual(blogsBeggining.length + 1)
})

test("a blogs missed likes attribute can be default value 0", async () => {
  const authorization = await getToken()
  const newBlogMissedLikes = {
    "title": "Go To Statement Considered Harmful",
    "author": "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
    "url":  "Edsger W. Dijkstra"
  }
  const response = await api
  .post("/api/blogs")
  .set("Authorization", authorization)
  .send(newBlogMissedLikes)
  expect(response.body.likes).toBe(0)
})

test("a invalid blog missed the url and title returned 400 status", async () => {
  const authorization = await getToken()
  const newBlogMissedUrlAndTitle = {
    "author": initialBlogs[0].author,
    "likes": initialBlogs[0].likes
  }
  await api
  .post("/api/blogs")
  .set("Authorization", authorization)
  .send(newBlogMissedUrlAndTitle)
  .expect(400)
})
/*
      describe("With logining status", () => {
        const newBlog = {
          "title": "Canonical string reduction",
    "author": "Edsger W. Dijkstra",
    "url": "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    "likes": 12
  }
*/
/*
  test('status code 401 Unauthorized', async () => {
    const authorization = await getInvalidToken()
    const newBlog401 = {
      "title": newBlog.title,
      "url": newBlog.url,
      "likes": 0
    }  

    await api
      .post('/api/blogs')
      .set("Authorization", authorization)
      .send(newBlog401)
      .expect(401)

   },)
})
*/
afterAll(async () => {
  await mongoose.connection.close();
});
