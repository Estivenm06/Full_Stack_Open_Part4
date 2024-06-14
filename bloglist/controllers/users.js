const User = require("../models/user")
const userRouter = require("express").Router()
const bcrypt = require("bcryptjs")

userRouter.get("/", async (request, response) => {
    const users = await User.find({}).populate("blogs", {title: 1, url: 1, likes: 1, author: 1})
        response.json(users)
    
})

userRouter.post("/", async (request, response, next) => {
    const {username, name, password} = request.body
    
    if(username.length <= 3){
        return response.status(400).send({error: "username length less than 3"})
    }
    if(password.length <= 3){
        return response.status(400).send({error: "password length less than 3"})
    }


    const passwordHash = await bcrypt.hash(password, 10)
        
    const user = new User({
            "username": username,
            "name": name,
            passwordHash,
     })

    const userSaved = await user.save()
    response.json(userSaved)
})

module.exports = userRouter