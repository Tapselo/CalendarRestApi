const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const NoteSchema = new Schema({
    title: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 32
    },
    content: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 500
    },
    user_id:{
        type: String,
        required: true
    }
});

NoteSchema.methods = {
    viewShort () {
        let fields = ['_id', 'title'];
        let view = {};

        fields.forEach((field) => { view[field] = this[field] });
        return view
    },
    viewFull () {
        let fields = ['_id','title', 'content'];
        let view = {};

        fields.forEach((field) => { view[field] = this[field] });
        return view
    }
};

module.exports = mongoose.model("Note", NoteSchema);
