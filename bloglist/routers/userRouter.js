const userRouter = require("express").Router();
const getAll = require("../controllers/users").getAll;
const create = require("../controllers/users").create;

userRouter.get("/", getAll);
userRouter.post("/", create);

module.exports = userRouter;
