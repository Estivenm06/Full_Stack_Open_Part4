# Full Stack Open Part 4 - Bloglist Application

This project is part of the Full Stack Open course and focuses on building a backend for a bloglist application. The backend is implemented using Node.js, Express, and MongoDB. It includes features such as user authentication, blog management, and testing.

## Features

- **User Management**: Users can register, log in, and manage their blogs.
- **Blog Management**: Users can create, update, delete, and view blogs.
- **Authentication**: Secure user authentication using JSON Web Tokens (JWT).
- **Testing**: Comprehensive testing using Jest and Supertest.
- **Database**: MongoDB is used as the database for storing users and blogs.

## Project Structure

```
bloglist/
├── app.js                 # Main application entry point
├── eslint.config.mjs      # ESLint configuration file
├── index.js               # Application startup script
├── package.json           # Project dependencies and scripts
├── README.md              # Project documentation
├── controllers/           # Contains route handlers for blogs, users, and login
│   ├── blogs.js           # Blog-related route handlers
│   ├── login.js           # Login-related route handlers
│   └── users.js           # User-related route handlers
├── models/                # Mongoose models for Blog and User
│   ├── blog.js            # Blog model
│   └── user.js            # User model
├── requests/              # REST client files for testing API endpoints
│   ├── create_blog.rest   # REST request for creating a blog
│   ├── create_user.rest   # REST request for creating a user
│   ├── delete_blog.rest   # REST request for deleting a blog
│   ├── getAll_blog.rest   # REST request for fetching all blogs
│   ├── login_user.rest    # REST request for user login
│   └── update_blog.rest   # REST request for updating a blog
├── routers/               # Express routers for modular route handling
│   ├── blogRouter.js      # Router for blog-related routes
│   ├── loginRouter.js     # Router for login-related routes
│   └── userRouter.js      # Router for user-related routes
├── tests/                 # Test files for the application
│   ├── bloglist_api.test.js # API tests for the bloglist
│   ├── list.test.js       # Tests for list helper functions
│   ├── teardown.js        # Teardown script for tests
│   └── test_helper.js     # Helper functions for tests
└── utils/                 # Utility functions and middleware
    ├── config.js          # Configuration utilities
    ├── list_helper.js     # Helper functions for list operations
    └── middleware.js      # Custom middleware functions
```

## Prerequisites

- Node.js (v16 or later)
- MongoDB (local or cloud instance)
- npm (Node Package Manager)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd bloglist
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:
   ```
   MONGODB_URI=<your-mongodb-uri>
   SECRET=<your-secret-key>
   PORT=<your-port> (recommended 3001)
   SECRET=<any-secret-string>
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Users
- `POST /api/users`: Create a new user.
- `GET /api/users`: Get all users.

### Login
- `POST /api/login`: Authenticate a user and return a token.

### Blogs
- `GET /api/blogs`: Get all blogs.
- `POST /api/blogs`: Create a new blog (requires authentication).
- `PUT /api/blogs/:id`: Update a blog (requires authentication).
- `DELETE /api/blogs/:id`: Delete a blog (requires authentication).

## Testing

Run the test suite using Jest:
```bash
npm test
```

## Development Scripts

- `npm run dev`: Start the development server with `nodemon`.
- `npm start`: Start the production server.
- `npm test`: Run the test suite.

*Completed by: Estivenm06*
