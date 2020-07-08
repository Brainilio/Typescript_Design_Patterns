"use strict";
class GameObject extends HTMLElement {
    constructor() {
        super();
        this._x = 0;
        this._y = 0;
        this._xspeed = 0;
        this._yspeed = 0;
        let game = document.getElementsByTagName("game")[0];
        game.appendChild(this);
    }
    get x() {
        return this._x;
    }
    set x(value) {
        this._x = value;
    }
    get y() {
        return this._y;
    }
    set y(value) {
        this._y = value;
    }
    get xspeed() {
        return this._xspeed;
    }
    set xspeed(value) {
        this._xspeed = value;
    }
    get yspeed() {
        return this._yspeed;
    }
    set yspeed(value) {
        this._yspeed = value;
    }
    get width() { return this.clientWidth; }
    get height() { return this.clientHeight; }
    update() {
        this.draw();
    }
    draw() {
        this.style.transform = `translate(${this.x}px, ${this.y}px)`;
    }
    hasCollision(gameobject) {
        return (this._x < gameobject._x + gameobject.width &&
            this._x + this.width > gameobject._x &&
            this._y < gameobject._y + gameobject.height &&
            this._y + this.height > gameobject._y);
    }
    destroy(gameObject) {
        Game.instance.destroyItem(gameObject);
    }
}
class Ball extends GameObject {
    constructor() {
        super();
        console.log("Ball created!");
        this.x = window.innerWidth / 2 - this.clientWidth / 2;
        this.y = window.innerHeight * 0.90;
        this._behavior = new MoveNegative(this);
    }
    get behavior() {
        return this._behavior;
    }
    set behavior(value) {
        this._behavior = value;
    }
    update() {
        this._behavior.Move();
        super.update();
    }
    onCollision(gameobject) {
        if (gameobject instanceof Brick) {
            this._behavior = new MovePositive(this);
        }
        if (gameobject instanceof Paddle) {
            this._behavior = new MoveNegative(this);
        }
    }
}
window.customElements.define("ball-component", Ball);
class Brick extends GameObject {
    constructor(x, y, status) {
        super();
        this.observers = [];
        this.timesHit = 0;
        this.yellowBrick = false;
        if (status < 0.3) {
            this.yellowBrick = true;
        }
        if (this.yellowBrick) {
            this.style.backgroundImage = "url(images/brick-yellow.png)";
        }
        this.x = x;
        this.y = y;
    }
    update() {
        super.update();
    }
    onCollision(gameobject) {
        if (gameobject instanceof Ball) {
            this.timesHit++;
            if (this.yellowBrick) {
                this.style.backgroundImage = "url(images/brick-red.png)";
                if (this.timesHit == 2) {
                    Game.instance.addToScore();
                    this.destroy(this);
                    this.notifyObservers();
                }
            }
            if (this.yellowBrick == false) {
                Game.instance.addToScore();
                this.destroy(this);
                this.notifyObservers();
            }
        }
    }
    register(observer) {
        this.observers.push(observer);
    }
    unregister(observer) {
        let index = this.observers.indexOf(observer);
        this.observers.splice(index, 1);
    }
    notifyObservers() {
        for (const observer of this.observers) {
            observer.notify();
        }
    }
}
window.customElements.define("brick-component", Brick);
class Game {
    constructor() {
        this.gameobjects = [];
        this.points = 0;
        this.score = document.getElementsByTagName("score")[0];
        let rows = 7;
        let columns = 12;
        let brickWidth = 64;
        let brickHeight = 32;
        let paddle = new Paddle();
        this.gameobjects.push(paddle);
        this.ball = new Ball();
        this.gameobjects.push(this.ball);
        for (let row = 0; row < rows; row++) {
            for (let column = 0; column < columns; column++) {
                let offsetX = (window.innerWidth - columns * brickWidth) / 2;
                let x = column * brickWidth + offsetX;
                let randomNumber = Math.random();
                let y = row * brickHeight + 100;
                let brick = new Brick(x, y, randomNumber);
                this.gameobjects.push(brick);
                this.gameobjects.push(new PowerUp(brick, paddle, randomNumber));
            }
        }
        this.gameLoop();
    }
    static get instance() {
        if (!Game._instance)
            Game._instance = new Game();
        return this._instance;
    }
    gameLoop() {
        for (const gameObject of this.gameobjects) {
            gameObject.update();
        }
        if (this.ball.x < 0 || this.ball.y < 0) {
            this.ball.behavior = new MovePositive(this.ball);
        }
        if (this.ball.x > window.innerWidth || this.ball.y > window.innerHeight) {
            this.ball.behavior = new MoveNegative(this.ball);
        }
        this.checkCollision();
        requestAnimationFrame(() => this.gameLoop());
    }
    checkCollision() {
        for (const gameobject1 of this.gameobjects) {
            for (const gameobject2 of this.gameobjects) {
                if (gameobject1.hasCollision(gameobject2)) {
                    gameobject1.onCollision(gameobject2);
                }
            }
        }
    }
    addToScore() {
        this.points++;
        this.score.innerHTML = "Score: " + this.points;
    }
    destroyItem(gameObject) {
        let index = this.gameobjects.indexOf(gameObject);
        this.gameobjects.splice(index, 1);
        gameObject.remove();
    }
}
window.addEventListener("load", () => Game.instance);
class Paddle extends GameObject {
    constructor() {
        super();
        this.moveLeft = false;
        this.moveRight = false;
        this._speed = 7;
        console.log("Paddle created!");
        this.x = window.innerWidth / 2 - this.clientWidth / 2;
        this.y = window.innerHeight * 0.95;
        window.addEventListener("keydown", (e) => this.onKeyDown(e));
        window.addEventListener("keyup", (e) => this.onKeyUp(e));
    }
    get speed() {
        return this._speed;
    }
    set speed(value) {
        this._speed = value;
    }
    onKeyDown(e) {
        if (e.key == "ArrowLeft")
            this.moveLeft = true;
        else if (e.key == "ArrowRight")
            this.moveRight = true;
    }
    onKeyUp(e) {
        if (e.key == "ArrowLeft")
            this.moveLeft = false;
        else if (e.key == "ArrowRight")
            this.moveRight = false;
    }
    update() {
        let newX = 0;
        if (this.moveLeft)
            newX = this.x - this._speed;
        if (this.moveRight)
            newX = this.x + this._speed;
        if (newX > 0 && newX + this.clientWidth < window.innerWidth)
            this.x = newX;
        super.update();
    }
    onCollision(gameobject) {
        if (gameobject instanceof PowerUp) {
        }
    }
}
window.customElements.define("paddle-component", Paddle);
class PowerUp extends GameObject {
    constructor(brick, paddle, status) {
        super();
        this.redPower = false;
        this.brick = brick;
        this.paddle = paddle;
        console.log(status);
        if (status < 0.5) {
            this.redPower = true;
        }
        if (this.redPower == true) {
            this.style.backgroundImage = "url(images/upgrades/polygon_red.png)";
        }
        this.x = this.brick.x;
        this.y = this.brick.y;
        this.brick.register(this);
    }
    notify() {
        this.yspeed += 3;
    }
    update() {
        this.y += this.yspeed;
        super.update();
    }
    onCollision(gameobject) {
        if (gameobject instanceof Paddle) {
            console.log("voer gedrag uit op basis van condition!");
            if (this.redPower) {
                this.paddle.speed *= 0;
                setInterval(() => { this.paddle.speed = 7; }, 2000);
            }
            if (this.redPower == false) {
                this.paddle.speed *= 2;
                setInterval(() => { this.paddle.speed = 7; }, 1000);
            }
            this.destroy(this);
            this.brick.unregister(this);
        }
    }
}
window.customElements.define("faster-upgrade", PowerUp);
class MoveNegative {
    constructor(ball) {
        this.ball = ball;
        this.ball.xspeed = Math.random() * -3;
        this.ball.yspeed = -7;
    }
    Move() {
        this.ball.x += this.ball.xspeed;
        this.ball.y += this.ball.yspeed;
    }
}
class MovePositive {
    constructor(ball) {
        this.ball = ball;
        this.ball.xspeed = Math.random() * 3;
        this.ball.yspeed = 7;
    }
    Move() {
        this.ball.x += this.ball.xspeed;
        this.ball.y += this.ball.yspeed;
    }
}
//# sourceMappingURL=main.js.map