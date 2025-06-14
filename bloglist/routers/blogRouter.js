const router = require("express").Router();
const getAll = require('../controllers/blogs.js').getAll;
const getOne = require('../controllers/blogs.js').getOne;
const create = require('../controllers/blogs.js').create;
const update = require('../controllers/blogs.js').update;
const deleteOne = require('../controllers/blogs.js').deleteOne;

router.get('/', getAll);

router.get('/:id', getOne);

router.post('/', create);

router.put('/:id', update);

router.delete('/:id', deleteOne);

module.exports = router;