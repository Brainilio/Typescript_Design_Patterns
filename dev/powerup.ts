/// <reference path="gameobject.ts" />

class PowerUp extends GameObject implements Observer {
     // Fields
     private brick: Brick;
     private paddle: Paddle;
     private redPower: boolean = false;

     constructor(brick: Brick, paddle: Paddle, status: number) {
          super()
          // console.log("Powerup created!")
          this.brick = brick;
          this.paddle = paddle;

          console.log(status)

          if (status < 0.5) {
               this.redPower = true
          }

          if (this.redPower == true) {
               this.style.backgroundImage = "url(images/upgrades/polygon_red.png)"
          }

          // midden van het scherm
          this.x = this.brick.x

          //check van constructor of de random nummer onder 30 % is, zo ja 

          // 5% vanaf de onderkant van het scherm
          this.y = this.brick.y

          // register zombie to the chicken
          this.brick.register(this)
     }

     notify(): void {
          this.yspeed += 3
     }

     public update() {
          this.y += this.yspeed;
          super.update();
     }

     onCollision(gameobject: GameObject): void {
          if (gameobject instanceof Paddle) {
               console.log("voer gedrag uit op basis van condition!")

               if (this.redPower) {
                    this.paddle.speed *= 0
                    setInterval(() => { this.paddle.speed = 7 }, 2000)
               }
               if (this.redPower == false) {
                    this.paddle.speed *= 2
                    setInterval(() => { this.paddle.speed = 7 }, 1000)
               }
               this.destroy(this)
               this.brick.unregister(this)
          }
     }


}

window.customElements.define("faster-upgrade", PowerUp as any)