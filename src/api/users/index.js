const { Router } = require('express');
const { createUser, getUserByName,updateUser,deleteUser,loginUser} = require('./controller');
const token = require('../../middlewares/token');
const password = require('../../middlewares/password');
const router = Router();

router.post('/',
    createUser);

router.get('/:id',
    token,
    getUserByName);

router.post('/login',
    password,
    loginUser);

router.put('/:id',
    token,
    updateUser);

router.delete('/:id',
    token,
    deleteUser);

module.exports = router;
