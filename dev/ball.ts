/// <reference path="gameobject.ts" />

class Ball extends GameObject {
     // Fields
     private _behavior: Behavior

     public get behavior(): Behavior {
          return this._behavior
     }
     public set behavior(value: Behavior) {
          this._behavior = value
     }

     constructor() {
          super()

          console.log("Ball created!")

          // midden van het scherm
          this.x = window.innerWidth / 2 - this.clientWidth / 2
          // 5% vanaf de onderkant van het scherm
          this.y = window.innerHeight * 0.90

          this._behavior = new MoveNegative(this)

     }

     public update() {
          this._behavior.Move()
          super.update();
     }

     onCollision(gameobject: GameObject): void {
          if (gameobject instanceof Brick) {
               this._behavior = new MovePositive(this)

          }
          if (gameobject instanceof Paddle) {
               this._behavior = new MoveNegative(this)
          }
     }


}

window.customElements.define("ball-component", Ball as any)