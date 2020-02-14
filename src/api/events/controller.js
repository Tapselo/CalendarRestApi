const Event = require('./model');
const jwt = require("jsonwebtoken");
const config = require("../../config");

const addEvent = async (req, res, next) => {
    try {
        checkAdd(req);
        const event = await Event.create(req.body);
        res.status(201).json({
            event: event.viewFull()
        })
    } catch (err) {
        next(err);
    }

};
//list some upcoming events
const getEvents = async (req, res, next) => {
    const perPage = 3;
    const page=req.query.page;
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {maxAge: config.jwtExpiration});
    let events;
    if(decoded.userType=='user'){
        events = await Event.find({user_id:decoded.id}).skip((perPage * page) - perPage).limit(perPage);
    }
    else{
        events = await Event.find().skip((perPage * page) - perPage).limit(perPage);
    }
    if(events) {
        events = events.map(event => event.viewShort());
        res.json(events);
    }

};
//get more info about single event
const getEventById = async (req, res, next) => {
    const id = req.params.id;
    try {
        checkEvent(req);
        const event = await Event.findById(id);
        if (event) return res.status(200).json(event.viewFull());
        return res.status(404);
    } catch (e) {
        if(e.message=='Routing not found')
            return res.status(404);
        next(e);
    }
};
const updateEvent = async (req, res, next) => {
    const id = req.params.id;
    const {title,date,place,weather} = req.body;

    try {
        checkEvent(req);
        const event = await Event.findById(id);
        if (event) {
            if(title)
                event.title=title;
            if(date)
                event.date=date;
            if(place)
                event.place=place;
            if(weather)
                event.weather=weather;
            await event.save();
            return res.json(event.viewFull());
        } else {
            return res.status(404);
        }
    } catch (e) {
        next(e);
    }
};

const deleteEvent = async (req, res, next) => {
    const id = req.params.id;
    try {
        checkEvent(req);
        const event = await Event.findById(id);
        if(event){
            await event.remove();
            return res.status(200).json({message:"Event deleted"});
        }
        return res.status(404).end();

    } catch (e) {
        next(e)
    }
};

function checkAdd(req){
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {maxAge: config.jwtExpiration});
    if(decoded.id !== req.body.user_id){
        if(decoded.req.body.user_id === null){
            throw new Error('ValidationError');
        }
        if(decoded.userType !=='superuser') {
            throw new Error('PermissionIssue');
        }
    }
}

async function checkEvent(req) {
    const eventId = req.params.id;
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {maxAge: config.jwtExpiration});
    const userId = decoded.id;
    try{
        const foundEvent = await Event.findById(eventId);
        if (userId !== foundEvent.user_id) {
            if (decoded.userType !== 'superuser') {
                throw new Error('PermissionIssue');
            }
        }
    }catch(e){
            throw new Error('Not found!')
    }
}

module.exports = {
    create: addEvent, getEvents, getEventById, updateEvent, deleteEvent
};
