const {Router} = require('express');
const users = require('./users');
const events = require('./events');
const notes = require('./notes');

//Routing
const router = Router();
router.use('/users', users);
router.use('/events', events);
router.use('/notes', notes);


module.exports = router;
