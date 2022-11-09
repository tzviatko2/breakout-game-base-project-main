// import * as PIXI from "pixi.js";
// import { EventDispatcher } from "../../EventDispatcher";
// import { GameApplication } from "../../GameApplication";
// import { GameEvents } from "../../GameEvents";
// import { GameObject } from "../GameObject";
// import { GameObjectBehavior } from "./GameObjectBehavior";

// export class PieceBehavior1 extends GameObjectBehavior {
  
//     private paddleRef: GameObject  = this.gameObjRef.getGameViewRef().getGameObjectById("paddle") as GameObject;
//     private velocity = 4;   
//     private pieceHide: boolean ; 
//     private timeOutId: NodeJS.Timeout;
//     private pieceImg: PIXI.Sprite ;
//     private moveDist: PIXI.Point = new PIXI.Point(
//       this.velocity * Math.sin((45 * Math.PI) / 180),
//       this.velocity * Math.cos((45 * Math.PI) / 180)
//     );  
  
//     constructor(gameObjRef: GameObject) {
//       super(gameObjRef);
//       //this.pieceImg = this.gameObjRef.getRenderableById("paddle") as PIXI.Sprite;
//     }
  
//     public update(deltaTime: number) {   
//       this.move(deltaTime);       
//       this.checkBound();
//       this.checkPaddleCollision();
//     }
     
//     private move(deltaTime: number) {
//       //this.checkPaddleCollision();   
//       this.gameObjRef.x += this.moveDist.x * deltaTime;
//       this.gameObjRef.y += this.moveDist.y * deltaTime;
//     }

//     private checkPaddleCollision() {
      
//         const ballRect: PIXI.Rectangle = new PIXI.Rectangle(
//         this.gameObjRef.x - this.gameObjRef.width * 0.5 + this.moveDist.x,
//         this.gameObjRef.y- this.gameObjRef.width * 0.5 + this.moveDist.y,
//         this.gameObjRef.width,
//         this.gameObjRef.height
//       );
//       const paddleRect: PIXI.Rectangle = new PIXI.Rectangle(
//         this.paddleRef.x - this.paddleRef.width,
//       this.paddleRef.y - this.paddleRef.width,
//         this.paddleRef.width,
//         this.paddleRef.height
//       );
  
//       if (
//         ballRect.left <= paddleRect.right &&
//         paddleRect.left <= ballRect.right &&
//         ballRect.top <= paddleRect.bottom &&
//         paddleRect.top <= ballRect.bottom
//       ) {
//         //this.pieceImg.tint = 0xffff00;
//         EventDispatcher.getInstance().getDispatcher().emit(GameEvents.PIECE_HIDE);
//         console.log("hit1");
//       // if(this.timeOutId) {
//       //   clearTimeout(this.timeOutId)
//       // }

//       // this.timeOutId = setTimeout(() => {
//       //   this.velocity = 6;
//       //   this.pieceImg.tint = 0xffffff;
//       // }, 5000);
//       }
//       ;
//     }

//     private checkBound() {
//       if(this.gameObjRef && !this.pieceHide) {
//         //console.log(this.gameObjRef.x);
//         //console.log(this.gameObjRef.y);
//         if(this.gameObjRef.x < 0 || this.gameObjRef.x > GameApplication.STAGE_WIDTH || this.gameObjRef.y < 0 || this.gameObjRef.y > GameApplication.STAGE_HEIGHT) {
//           //EventDispatcher.getInstance().getDispatcher().emit(GameEvents.PIECE_HIDE, {pieceId: this.gameObjRef.getId()});
//           this.pieceHide = true;
//           //console.log(this.gameObjRef.getId());
//         }
//       }
//     }
//   }
import { GameObject } from "../GameObject";
import * as PIXI from "pixi.js";
import { GameObjectBehavior } from "./GameObjectBehavior";
import { GameApplication } from "../../GameApplication";
import { EventDispatcher } from "../../EventDispatcher";
import { GameEvents } from "../../GameEvents";
import { BrickType } from "../level/BrickType";


export class PieceBehavior1 extends GameObjectBehavior {
  private paddleRef: GameObject;
  private ballImg: PIXI.Sprite;
  private velocity = 4;
  

  constructor(gameObjRef: GameObject) {
    super(gameObjRef);
  }

  public update(deltaTime: number) {
    
      this.move(deltaTime); 
    
    
  }

  protected init() {
    //this.ballImg = this.gameObjRef.getRenderableById("ballImg") as PIXI.Sprite;    
    this.paddleRef = this.gameObjRef.getGameViewRef().getGameObjectById("paddle") as GameObject;
    
  }

  private move(deltaTime: number) {
    const moveDist: PIXI.Point = new PIXI.Point(
      this.velocity * Math.sin((45 * Math.PI) / 180),
      this.velocity * Math.cos((45 * Math.PI) / 180)
    );
    
    if (this.checkPaddleCollision(moveDist)) {
      //this.ballImg.tint = 0xffff00;
      EventDispatcher.getInstance().getDispatcher().emit(GameEvents.PIECE_HIDE);
      
      console.log("hit1");
      return;
    }

    this.gameObjRef.x += moveDist.x * deltaTime;
    this.gameObjRef.y += moveDist.y * deltaTime;
  }
  

  private checkPaddleCollision(moveDist: PIXI.Point): boolean {
    const ballRect: PIXI.Rectangle = new PIXI.Rectangle(
      this.gameObjRef.x - this.gameObjRef.width* 0.5 + moveDist.x ,
      this.gameObjRef.y - this.gameObjRef.width * 0.5 + moveDist.y,
      this.gameObjRef.width,
      this.gameObjRef.height
    );
    const paddleRect: PIXI.Rectangle = new PIXI.Rectangle(
      this.paddleRef.x,
      this.paddleRef.y,
      this.paddleRef.width,
      this.paddleRef.height
    );

    return (
      ballRect.left <= paddleRect.right &&
      paddleRect.left <= ballRect.right &&
      ballRect.top <= paddleRect.bottom &&
      paddleRect.top <= ballRect.bottom
    );
  }
  
}
