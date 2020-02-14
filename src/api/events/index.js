const { Router } = require('express');
const { create, getEvents, getEventById, updateEvent, deleteEvent } = require('./controller');
const token = require('../../middlewares/token')
const router = Router();

router.post('/',
    token,
    create);

router.get('/',
    token,
    getEvents);

router.get('/:id',
    token,
    getEventById);

router.put('/:id',
    token,
    updateEvent);

router.delete('/:id',
    token,
    deleteEvent);

module.exports = router;
