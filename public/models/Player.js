class Player {
    constructor(x, y, xspeed, yspeed, w, h, color, id) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = color;
        this.id = id;
        this.xspeed = xspeed;
        this.yspeed = yspeed;
    }

    tick() {
        this.checkBoundaries();
        this.x += this.xspeed;
        this.y += this.yspeed;
    }

    render() {
        fill(this.color);
        rect(this.x, this.y, this.w, this.h);
    }

    handleKeyInput(keyCode) {
        if(keyCode === LEFT_ARROW) {
            this.xspeed = -this.w/2;
            this.yspeed = 0;
            //socket.emit('draw', {id: this.id, player: {xspeed: this.xspeed, yspeed: this.yspeed}});
            socket.emit('draw', {id: this.id, player: this});
        }
        if(keyCode === RIGHT_ARROW) {
            this.xspeed = this.w/2;
            this.yspeed = 0;
            socket.emit('draw', {id: this.id, player: this});
        }
        if(keyCode === UP_ARROW) {
            this.yspeed = -this.h/2;
            this.xspeed = 0;
            socket.emit('draw', {id: this.id, player: this});
        }
        if(keyCode === DOWN_ARROW) {
            this.yspeed = this.h/2;
            this.xspeed = 0;
            socket.emit('draw', {id: this.id, player: this});
        }
    }
    checkBoundaries() {
        if (this.x >= width) {
            this.x = this.x - (width + this.w);
        } else if (this.x + this.w <= 0) {
            this.x = this.x + (width + this.w);
        } else if (this.y >= height) {
            this.y = this.y - (height + this.h);
        } else if (this.y + this.h <= 0) {
            this.y = this.y + (height + this.h);
        }
    }
}
