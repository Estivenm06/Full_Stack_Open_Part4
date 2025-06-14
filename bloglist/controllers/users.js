const User = require("../models/user")
const bcrypt = require("bcryptjs")

const getAll = async (request, response) => {
    const users = await User.find({}).populate("blogs", {"title": 1, "url": 1, "likes": 1, "author": 1})
        return response.json(users)
};

const create = async (request, response) => {
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
    return response.json(userSaved)
}

module.exports = {getAll, create};