const express = require("express");
const app = express();

const http = require("http");
const { Server } = require("socket.io");

const mongoose = require("mongoose");

const cors = require("cors");

require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use(require("./routes/rooms"));

mongoose.set('strictQuery', false);

mongoose.connect(process.env.DB_URL, () => {
    console.log("Database connected");
});

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "DELETE"]
    }
});

io.on("connection", (socket) => {
    socket.on("room:enter", (data) => {
        socket.join(["u:"+data.user, "r:"+data.room]);
        socket.to("r:"+data.room).emit("room:update");
    });

    socket.on("room:leave", (data) => {
        socket.leave("u:"+data.user);
        socket.leave("r:"+data.room);
        socket.to("r:"+data.room).emit("room:update");
    });

    socket.on("room:delete", (data) => {
        socket.to("r:"+data.room).emit("room:deleted");
    });

    socket.on("room:send", (data) => {
        socket.to("r:"+data.room).emit("room:update");
    });

    socket.on("room:kick", (data) => {
        socket.to("u:"+data.user).emit("room:kicked", {boss: data.boss});
    });
});

server.listen(process.env.PORT, () => {
    console.log("Server is running on port: "+process.env.PORT);
});