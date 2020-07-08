class MoveNegative implements Behavior {

     private ball: Ball

     constructor(ball: Ball) {
          this.ball = ball

          //zet speed van bal tussen -3 en 0
          this.ball.xspeed = Math.random() * -3
          this.ball.yspeed = -7
     }

     Move(): void {

          //update ball
          this.ball.x += this.ball.xspeed
          this.ball.y += this.ball.yspeed
     }



}