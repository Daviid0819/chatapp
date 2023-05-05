const router = require("express").Router();
require("dotenv").config();

const Room = require("../models/rooms.model");

router.get("/room/:name", async(req, res) => {
    const room = await Room.findOne({
        name: req.params.name
    });

    if(!room){
        return res.json({success: false});
    }

    res.json({success: true, room: room});
});

router.post("/room/create", async(req, res) => {
    const newRoom = new Room({
        name: req.body.name,
        users: [
            {name: req.body.user}
        ],
        boss: [
            {name: req.body.user}
        ]
    });

    try {
        const room = await Room.create(newRoom);
        res.json({success: true, room: room});
    }
    catch(err){
        if(err.code === 11000){
            return res.json({success: false, message: "This room name is already used"});
        }
        res.json({success: false, message: err.message});
    }
});

router.delete("/room/delete", async(req, res) => {
    const room = await Room.findOne({
        name: req.body.name
    });

    if(!room){
        return res.json({success: false, message: "This room doesn't exist"});
    }

    try {
        await Room.deleteOne({
            name: req.body.name
        });
        res.json({success: true});
    }
    catch(err) {
        res.json({success: false, message: err.message});
    }
});

router.post("/room/enter", async(req, res) => {
    const room = await Room.findOne({
        name: req.body.name
    });

    if(!room){
        return res.json({success: false, message: "This room doesn't exist"});
    }

    if(room.users.filter(u => u.name === req.body.user).length !== 0){
        return res.json({success: false, message: "This username is already used"});
    }

    try {
        room.users.push({name: req.body.user});
        await room.save();
        res.json({success: true, room: room});
    }
    catch(err){
        res.json({success: false, message: err.message});
    }
});

router.delete("/room/exit", async(req, res) => {
    const room =  await Room.findOne({
        name: req.body.name,
        users: {$elemMatch: {name: req.body.user}}
    });

    if(!room){
        return res.json({success: false, message: "This room doesn't exist"});
    }

    try {
        await room.updateOne({
            $pull: {
                users: {name: req.body.user}
            }
        });

        res.json({success: true});
    }
    catch(err){
        res.json({success: false, message: err.message});
    }
});

router.post("/room/kick", async(req, res) => {
    const room =  await Room.findOne({
        name: req.body.name,
        users: {$elemMatch: {name: req.body.user}}
    });

    if(!room){
        return res.json({success: false, message: "This room doesn't exist"});
    }

    try {
        await room.updateOne({
            $pull: {
                users: {name: req.body.user}
            }
        });

        res.json({success: true});
    }
    catch(err){
        res.json({success: false, message: err.message});
    }
});

router.post("/room/send", async(req, res) => {
    const room =  await Room.findOne({
        name: req.body.name
    });

    if(!room){
        return res.json({success: false, message: "This room doesn't exist"});
    }

    try {
        room.messages.push({
            name: req.body.user,
            text: req.body.message
        });
        await room.save();
        res.json({success: true, room: room});
    }
    catch(err){
        res.json({success: false, message: err.message});
    }
});

module.exports = router;