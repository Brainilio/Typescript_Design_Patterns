class Game {

    //instance singleton
    private static _instance: Game
    public static get instance(): Game {
        if (!Game._instance) Game._instance = new Game()
        return this._instance
    }



    // Fields
    private gameobjects: GameObject[] = []
    private score: Element
    private points: number = 0;
    private ball: Ball


    //PRIVATE CONSTRUCTOR FOR SINGLETON
    private constructor() {
        //score
        this.score = document.getElementsByTagName("score")[0]

        //fields for bricks
        let rows: number = 7
        let columns: number = 12
        let brickWidth: number = 64
        let brickHeight: number = 32

        //spawn paddle
        let paddle: Paddle = new Paddle()
        this.gameobjects.push(paddle)

        //spawn ball
        this.ball = new Ball();
        this.gameobjects.push(this.ball)

        //spawn bricks
        for (let row = 0; row < rows; row++) {

            for (let column = 0; column < columns; column++) {

                // plaats het grid met blokken in het midden van het scherm
                let offsetX = (window.innerWidth - columns * brickWidth) / 2
                let x = column * brickWidth + offsetX
                let randomNumber = Math.random();

                // en op de y-as 100px vanaf de top
                let y = row * brickHeight + 100

                // Voeg op deze plek een nieuw blok toe aan het spel
                let brick: Brick = new Brick(x, y, randomNumber)
                this.gameobjects.push(brick)
                //geef een brick mee met powerup zodat je de powerup kan registreren aan de brick
                //maar ook dezelfde positie van brick kan meegeven
                this.gameobjects.push(new PowerUp(brick, paddle, randomNumber))

                // console.log(`Place brick at (${x}, ${y})`)
            }
        }

        this.gameLoop()
    }

    private gameLoop() {
        for (const gameObject of this.gameobjects) {
            gameObject.update();
        }

        //check ball position for behavior change
        if (this.ball.x < 0 || this.ball.y < 0) {
            this.ball.behavior = new MovePositive(this.ball)
        }
        if (this.ball.x > window.innerWidth || this.ball.y > window.innerHeight) {
            this.ball.behavior = new MoveNegative(this.ball)
        }

        // Check collision between objects
        this.checkCollision();

        requestAnimationFrame(() => this.gameLoop())
    }

    // CHECK COLLISION
    public checkCollision(): void {
        for (const gameobject1 of this.gameobjects) {
            for (const gameobject2 of this.gameobjects) {
                if (gameobject1.hasCollision(gameobject2)) {
                    gameobject1.onCollision(gameobject2)
                }
            }
        }
    }

    //voeg toe aan score
    public addToScore() {
        this.points++
        this.score.innerHTML = "Score: " + this.points
    }

    //destroy item als het nodig is
    public destroyItem(gameObject: GameObject): void {
        let index = this.gameobjects.indexOf(gameObject)
        this.gameobjects.splice(index, 1)
        gameObject.remove();
    }
}

window.addEventListener("load", () => Game.instance)