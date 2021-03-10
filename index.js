const express = require('express');
const app = express();
const socketio = require('socket.io');
const PORT = process.env.PORT || 4000;

let path = require('path');
app.use(express.static('./public'));
const io = socketio(app.listen(PORT, () => console.log(`Started Server at port ${PORT}`)));
const Player = require('./models/Player');

let players = {};
Object.filter = function( obj, predicate) {
    let result = {}, key;

    for (key in obj) {
        if (obj.hasOwnProperty(key) && !predicate(obj[key])) {
            result[key] = obj[key];
        }
    }

    return result;
};
io.sockets.on('connection', (socket) => {
    console.log(`${socket.id} has connected!`);

    socket.on('new', (player) => {
        //players[socket.id] = new Player(player.x, player.y, player.w, player.h, player.color);
        players[socket.id] = player;
        socket.broadcast.emit('newPlayer', {id: socket.id, player: players[socket.id]});
        socket.emit('allPlayers', Object.filter(players, p => p.id === socket.id));
    });


    socket.on('draw', (obj) => {
        let p = players[obj.id];
        p.x = obj.player.x;
        p.y = obj.player.y;
        p.xspeed = obj.player.xspeed;
        p.yspeed = obj.player.yspeed;
        players[obj.id] = p;
        socket.broadcast.emit('draw', obj);
    })

    socket.on('disconnect', () => {
        console.log(`${socket.id} has disconnected!`);
        delete players[socket.id];
        io.sockets.emit('rmPlayer', socket.id);
    });
});
