abstract class GameObject extends HTMLElement {

     // Fields
     private _x: number = 0;
     private _y: number = 0;
     private _xspeed: number = 0;
     private _yspeed: number = 0;

     //Properties
     public get x(): number {
          return this._x;
     }
     public set x(value: number) {
          this._x = value;
     }

     public get y(): number {
          return this._y;
     }
     public set y(value: number) {
          this._y = value;
     }
     public get xspeed(): number {
          return this._xspeed;
     }
     public set xspeed(value: number) {
          this._xspeed = value;
     }
     public get yspeed(): number {
          return this._yspeed;
     }
     public set yspeed(value: number) {
          this._yspeed = value;
     }

     public get width(): number { return this.clientWidth }
     public get height(): number { return this.clientHeight }

     constructor() {
          super();

          let game = document.getElementsByTagName("game")[0]
          game.appendChild(this)
     }

     public update() {
          this.draw();
     }

     public draw() {
          this.style.transform = `translate(${this.x}px, ${this.y}px)`
     }

     public hasCollision(gameobject: GameObject): boolean {
          return (this._x < gameobject._x + gameobject.width &&
               this._x + this.width > gameobject._x &&
               this._y < gameobject._y + gameobject.height &&
               this._y + this.height > gameobject._y)
     }

     public destroy(gameObject: GameObject) {
          Game.instance.destroyItem(gameObject);
     }

     abstract onCollision(gameobject: GameObject): void
}