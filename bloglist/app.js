const express = require('express')
const mongoose = require("mongoose")
const app = express()
const cors = require('cors')
const {MONGODB_URI} = require("./utils/config")
const blogRouter = require('./controllers/blogs')
const userRouter = require("./controllers/users")
const loginRouter = require("./controllers/login")
const {requestLogger, unknownEndpoint, errorHandler, tokenExtractor, userExtractor} = require("./utils/middleware")

mongoose.set("strictQuery", false)
console.log("Connecting to", MONGODB_URI);
mongoose.connect(MONGODB_URI)

app.use(cors())
app.use(express.json())
app.use(tokenExtractor)
app.use(requestLogger)
app.use("/api/blogs", userExtractor, blogRouter)
app.use("/api/users", userRouter)
app.use("/api/login", loginRouter)
app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app