const router = require("express").Router();
require("dotenv").config();

const Room = require("../models/rooms.model");

router.get("/room", async(req, res) => {
    const room = await Room.findOne({
        name: req.body.name
    });

    if(!room){
        return res.json({success: false});
    }

    req.json({success: true, room: room});
});

router.post("/room/create", async(req, res) => {
    const newRoom = new Room({
        name: req.body.name,
        users: [
            {name: req.body.user}
        ]
    });

    try {
        const room = await Room.create(newRoom);
        res.json({success: true, room: room});
    }
    catch(err){
        res.json({success: false, message: err.message});
    }
});

router.delete("/room/delete", async(req, res) => {
    const room = await Room.findOne({
        name: req.body.name,
        users: [
            {name: req.body.user}
        ]
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

module.exports = router;