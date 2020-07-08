/// <reference path="gameobject.ts" />

class Brick extends GameObject implements Subject {
     // Fields
     private observers: Observer[] = [];
     private timesHit: number = 0;
     private yellowBrick: boolean = false;


     constructor(x: number, y: number, status: number) {
          super()
          // console.log("Brick created!")

          // if less than 0.3 percent then set background image and status to yellowbrick
          if (status < 0.3) {
               this.yellowBrick = true
          }

          if (this.yellowBrick) {
               this.style.backgroundImage = "url(images/brick-yellow.png)"
          }

          // midden van het scherm
          this.x = x
          // 5% vanaf de onderkant van het scherm
          this.y = y

     }

     public update() {
          super.update();
     }

     onCollision(gameobject: GameObject): void {
          if (gameobject instanceof Ball) {
               //increment timeshit
               this.timesHit++

               //if its a yellowbrick and yellowbrick gets hit twice, notify observers
               if (this.yellowBrick) {
                    this.style.backgroundImage = "url(images/brick-red.png)"
                    if (this.timesHit == 2) {
                         Game.instance.addToScore()
                         this.destroy(this)
                         this.notifyObservers();
                    }
               }

               //if its a purple brick and gets hit, notifyobservers.
               if (this.yellowBrick == false) {
                    Game.instance.addToScore()
                    this.destroy(this)
                    this.notifyObservers()
               }
          }
     }

     register(observer: Observer): void {
          this.observers.push(observer)

     }
     unregister(observer: Observer): void {
          let index = this.observers.indexOf(observer)
          this.observers.splice(index, 1);

     }
     notifyObservers(): void {
          for (const observer of this.observers) {
               observer.notify();
          }
     }


}

window.customElements.define("brick-component", Brick as any)