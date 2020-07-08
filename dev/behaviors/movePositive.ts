class MovePositive implements Behavior {

     private ball: Ball

     constructor(ball: Ball) {
          this.ball = ball

          //zet speed van bal tussen 0 en 3
          this.ball.xspeed = Math.random() * 3
          this.ball.yspeed = 7
     }

     Move(): void {
          //UPDATE BALL
          this.ball.x += this.ball.xspeed
          this.ball.y += this.ball.yspeed
     }



}