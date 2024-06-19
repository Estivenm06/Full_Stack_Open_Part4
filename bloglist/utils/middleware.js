const jwt = require("jsonwebtoken")
const User = require("../models/user")
require("dotenv").config()
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
  
  const userExtractor = async (request, response, next) => {
    let user = null;
    try{
      if(request.token){
        const decodedToken = jwt.verify(request.token, process.env.SECRET)
        user = await User.findById(decodedToken.id)
      }
    }catch(err){
      console.error("Error verifying token", err)
    }
    request.user = user;
    next();
  }
const tokenExtractor = (request, response, next) => {
  const decodedToken = request.get("authorization")
  if(decodedToken && decodedToken.startsWith("Bearer ")){
    request.token = decodedToken.substring(7)
  }else{
    request.token = null
  }
  next()
}


module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor
}