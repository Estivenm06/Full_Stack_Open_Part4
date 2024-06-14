const jwt = require("jsonwebtoken")
const User = require("../models/user")
const requestLogger = (request, response, next) => {
    console.log("Method", request.method)
    console.log("Path ", request.path)
    console.log("Body ", request.body)
    console.log("---")
    next()
}

const unknownEndpoint = (request, response) => {
    return response.status(404).send({error: "Unknown endpoint"})
}

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

      if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    } else if(error.name === "MongoServerError"){
      return response.status(400).json({error: error.message})
    } else if(error.name === "JsonWebTokenError"){
      return response.status(401).json({error: error.message})
    }
    next(error)
  }

const tokenExtractor = (request, response, next) => {
  const decodedToken = request.get("authorization")
  request.token = null
  if(decodedToken && decodedToken.startsWith("Bearer ")){
    request.token = decodedToken.substring(7)
  }
  next()
}

const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if(!decodedToken.id){
    response.status(401).send({error: "token invalid"})
  }else{
    const user = await User.findById(decodedToken.id)
    request.user = user
    next()
  }
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor
}