const { Router } = require('express');
const { create, getNotes, getNote, updateNote, deleteNote } = require('./controller');
const token = require('../../middlewares/token')
const router = Router();

router.post('/',
    token,
    create);

router.get('/',
    token,
    getNotes);

router.get('/:id',
    token,
    getNote);

router.put('/:id',
    token,
    updateNote);

router.delete('/:id',
    token,
    deleteNote);

module.exports = router;
