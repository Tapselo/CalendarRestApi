const Note = require('./model');
const jwt = require("jsonwebtoken");
const config = require("../../config");

const createNote = async (req, res, next) => {
    try {
        checkAdd(req);
        const note = await Note.create(req.body);
        res.status(201).json({
            note: note.viewShort()
        })
    } catch (err) {
        if (err.name === 'PermissionIssue') {
            return res.status(403);
        }
        next(err);
    }
};

const getNotes = async (req, res, next) => {
    const perPage = 3;
    const page=req.query.page;
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {maxAge: config.jwtExpiration});
    let notes;
    if(decoded.userType=='user'){
        notes = await Note.find({user_id:decoded.id}).skip((perPage * page) - perPage).limit(perPage);
    }
    else{
        notes = await Note.find().skip((perPage * page) - perPage).limit(perPage);
    }
    notes = notes.map(note => note.viewShort());
    res.json(notes);
};

const updateNote = async (req, res, next) => {
    const id = req.params.id;
    const {title,content} = req.body;

    try {
        checkNote(req);
        const note = await Note.findById(id);
        if (Note) {
            if(title)
                note.title=title;
            if(content)
                note.content=content;
            await note.save();
            return res.json(note.viewFull());
        } else {
            return res.status(404);
        }
    } catch (e) {
        if (e.name === 'PermissionIssue') {
            return res.status(403);
        }
        next(e);
    }
};

const getNote = async (req, res, next) => {
    const id = req.params.id;

    try {
        checkNote(req);
        const note = await Note.findById(id);
        if (note) return res.status(200).json(note.viewFull());
        return res.status(404);
    } catch (e) {
        next(e);
    }
};

const deleteNote = async (req, res, next) => {
    const id = req.params.id;
    try {
        checkNote(req);
        const note = await Note.findById(id);
        if(note){
            await note.remove();
            return res.status(200).json({message:"Note deleted"});
        }
        return res.status(404).end();

    } catch (e) {
        if (e.name === 'PermissionIssue') {
            return res.status(403);
        }
        next(e)
    }
};

function check(req){
    const id=req.params.id;
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {maxAge: config.jwtExpiration});
    if(decoded.id !== id){
        if(decoded.userType !=='superuser') {
            throw new Error('PermissionIssue');
        }
    }
}
function checkAdd(req){
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {maxAge: config.jwtExpiration});
    if(decoded.id !== req.body.user_id){
        if(decoded.userType !=='superuser') {
            throw new Error('PermissionIssue');
        }
    }
}

async function checkNote(req) {
    const noteId = req.params.id;
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {maxAge: config.jwtExpiration});
    const userId = decoded.id;
    const foundNote = await Note.findById(noteId);
    if (userId !== foundNote.user_id) {
        if (decoded.userType !== 'superuser') {
            throw new Error('PermissionIssue');
        }
    }
}
module.exports = {
    create: createNote, getNotes,getNote,updateNote,deleteNote
};
