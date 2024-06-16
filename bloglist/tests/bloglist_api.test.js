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
  blogsInDb,
} = require("./test_helper");

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
  const blogsObjects = initialBlogs.map(
    (e) => new Blog({ ...e, user: savedUser.id })
  );
  const blogsSaved = blogsObjects.map((e) => e.save());
  await Promise.all(blogsSaved);
});

describe("when there's initially notes saved", () => {
  test("blogs are returned as json", async () => {
    const authorization = await getToken();
    await api
      .get("/api/blogs")
      .set("Authorization", authorization)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
  test("all blogs are returned", async () => {
    const authorization = await getToken();
    const response = await api
      .get("/api/blogs")
      .set("Authorization", authorization);
    expect(response.body).toHaveLength(initialBlogs.length);
  });
  test("a specific blog is within returned blogs", async () => {
    const authorization = await getToken();
    const response = await api
      .get("/api/blogs")
      .set("Authorization", authorization);
    const result = response.body.map((e) => e.title);
    expect(result).toContain("Go To Statement Considered Harmful");
  });
});

describe("viewing a specific blog", () => {
  test("verify the unique identifier of the blogs posts named id", async () => {
    const authorization = await getToken();
    const getBlogs = await api
      .get("/api/blogs")
      .set("Authorization", authorization);
    const result = getBlogs.body.map((e) => e.id);
    expect(result).toBeDefined();
  });
});

describe("addition of a new blog", () => {
  test("a valid blog can be added", async () => {
    const authorization = await getToken();
    const blogsBeggining = await blogsInDb();
    const newBlog = {
      title: initialBlogs[0].title,
      author: initialBlogs[0].author,
      url: initialBlogs[0].url,
      likes: initialBlogs[0].likes,
    };
    await api
      .post("/api/blogs")
      .set("Authorization", authorization)
      .send(newBlog)
      .expect(201);
    const blogsAtEnd = await blogsInDb();
    expect(blogsAtEnd.length).toEqual(blogsBeggining.length + 1);
  });

  test("a blogs missed likes attribute can be default value 0", async () => {
    const authorization = await getToken();
    const newBlogMissedLikes = {
      title: "Go To Statement Considered Harmful",
      author: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      url: "Edsger W. Dijkstra",
    };
    const response = await api
      .post("/api/blogs")
      .set("Authorization", authorization)
      .send(newBlogMissedLikes);
    expect(response.body.likes).toBe(0);
  });

  test("a invalid blog missed the url and title returned 400 status", async () => {
    const authorization = await getToken();
    const newBlogMissedUrlAndTitle = {
      author: initialBlogs[0].author,
      likes: initialBlogs[0].likes,
    };
    await api
      .post("/api/blogs")
      .set("Authorization", authorization)
      .send(newBlogMissedUrlAndTitle)
      .expect(400);
  });
});

describe("deletion of a blog", () => {
  test("succeeds with a status 204 if id is valid", async () => {
    const authorization = await getToken();
    const blogsAtStart = await blogsInDb();
    const blogToDelete = blogsAtStart[0];
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", authorization)
      .expect(204);

    const blogsAtEnd = await blogsInDb();
    expect(blogsAtEnd).toHaveLength(initialBlogs.length - 1);

    const titles = blogsAtEnd.map((e) => e.title);
    expect(titles).not.toContain(blogToDelete.title);
  });
});

describe("update of a blog", () => {
  test("succeeds with a status 200 if id is valid", async () => {
    const authorization = await getToken();
    const blogs = await blogsInDb();
    const blogToUpdate = blogs[0];
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set("Authorization", authorization)
      .send({likes: 155})
      .expect(200);
    const blogsAtEnd = await blogsInDb();
    const likes = blogsAtEnd.map(e => e.likes)
    expect(likes[0]).toEqual(155)
  });
});

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
