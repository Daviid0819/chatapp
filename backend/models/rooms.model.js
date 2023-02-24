const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true
    }
});

const messageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const roomsSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true,
        unique: true
    },
    users: [userSchema],
    messages: [messageSchema],
    date: {
        type: Date,
        default: Date.now
    }
}, {collection: "rooms"});

module.exports = mongoose.model("Room", roomsSchema);