const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    place: {
        type: String,
        minLength: 3
    },
    date: {
        type: String,
        match: /^\S+\.\S+\.\S+$/,
        required: true
    },
    weather: {
        type: String
    },
    user_id:{
        type: String,
        required: true
    }
});

EventSchema.methods = {
    viewShort () {
        let fields = ['id', 'title', 'date'];
        let view = {};

        fields.forEach((field) => { view[field] = this[field] });
        return view
    },

    viewFull () {
        let fields = ['id','title', 'date', 'place', 'weather'];
        let view = {};

        fields.forEach((field) => { view[field] = this[field] });
        return view
    },

};

module.exports = mongoose.model("Event", EventSchema);
