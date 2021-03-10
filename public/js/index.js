let socket;
let players;
let currentPlayer;
let connected;
function setup() {
    createCanvas(400, 400);

    players = new Map();

    socket = io("http://localhost:4000");
    connected = false;
    socket.on("connect", () => {
        connected = true;
        currentPlayer = new Player(
            0,
            0,
            0,
            0,
            10,
            10,
            Math.random() * (255 - 0) + 0,
            socket.id
        );
        socket.emit("new", currentPlayer);

        socket.on("newPlayer", (newPlayer) => {
            let p = newPlayer.player;
            players.set(
                newPlayer.id,
                new Player(p.x, p.y, p.xspeed, p.yspeed, p.w, p.h, p.color)
            );
        });
        socket.on("rmPlayer", (rmPlayer) => {
            players.delete(rmPlayer);
        });
        socket.on("allPlayers", (allPlayers) => {
            console.log("All Players", allPlayers);
            Object.keys(allPlayers).forEach((key) => {
                let p = allPlayers[key];
                players.set(
                    key,
                    new Player(p.x, p.y, p.xspeed, p.yspeed, p.w, p.h, p.color)
                );
            });
        });
        socket.on("draw", (obj) => {
            let p = players.get(obj.id);
            p.xspeed = obj.player.xspeed;
            p.yspeed = obj.player.yspeed;
            players.set(obj.id, p);
        });
    });
}

function draw() {
    background(220);
    if (!connected) return;
    currentPlayer.tick();
    currentPlayer.render();

    for (p of players.values()) {
        p.tick();
        p.render();
    }
}

function keyPressed() {
    currentPlayer.handleKeyInput(keyCode);
}
