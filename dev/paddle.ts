/// <reference path="gameobject.ts" />

class Paddle extends GameObject {
    // Fields

    private moveLeft: boolean = false
    private moveRight: boolean = false


    private _speed: number = 7


    // Properties
    public get speed(): number {
        return this._speed
    }
    public set speed(value: number) {
        this._speed = value
    }

    constructor() {
        super()
        console.log("Paddle created!")

        // midden van het scherm
        this.x = window.innerWidth / 2 - this.clientWidth / 2
        // 5% vanaf de onderkant van het scherm
        this.y = window.innerHeight * 0.95

        window.addEventListener("keydown", (e: KeyboardEvent) => this.onKeyDown(e))
        window.addEventListener("keyup", (e: KeyboardEvent) => this.onKeyUp(e))
    }

    private onKeyDown(e: KeyboardEvent): void {
        if (e.key == "ArrowLeft") this.moveLeft = true
        else if (e.key == "ArrowRight") this.moveRight = true
    }

    private onKeyUp(e: KeyboardEvent): void {
        if (e.key == "ArrowLeft") this.moveLeft = false
        else if (e.key == "ArrowRight") this.moveRight = false
    }

    public update() {
        let newX: number = 0

        if (this.moveLeft) newX = this.x - this._speed
        if (this.moveRight) newX = this.x + this._speed
        if (newX > 0 && newX + this.clientWidth < window.innerWidth) this.x = newX

        super.update();
    }

    onCollision(gameobject: GameObject): void {
        if (gameobject instanceof PowerUp) {

        }
    }


}

window.customElements.define("paddle-component", Paddle as any)