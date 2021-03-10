const express = require("express");
const app = express();
const socketio = require("socket.io");
const PORT = process.env.PORT || 3000;
const io = socketio(
    app.listen(PORT, () => console.log(`Started Server at port ${PORT}`))
);

let players = new Map();

io.on("connect", (socket) => {
    console.log(socket.id);
    players.set(socket.id, { x: 0, y: 0 });
    socket.broadcast.emit("newPlayer", socket.id);
    socket.emit("init", { players: players });
    socket.on("draw", (obj) => {
        players.set(obj.id, obj);
        socket.broadcast.emit("update", obj);
    });
    socket.on("disconnect", (sock) => {
        console.log(`${sock.id} disconnected`);
    });
});
