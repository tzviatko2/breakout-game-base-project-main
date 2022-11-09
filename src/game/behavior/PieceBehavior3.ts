import { GameObject } from "../GameObject";
import * as PIXI from "pixi.js";
import { GameObjectBehavior } from "./GameObjectBehavior";
import { GameApplication } from "../../GameApplication";
import { EventDispatcher } from "../../EventDispatcher";
import { GameEvents } from "../../GameEvents";
import { BrickType } from "../level/BrickType";


export class PieceBehavior3 extends GameObjectBehavior {
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
      this.velocity * Math.sin((360 * Math.PI) / 180),
      this.velocity * Math.cos((360 * Math.PI) / 180)
    );
    
    if (this.checkPaddleCollision(moveDist)) {
      //this.ballImg.tint = 0xffff00;
      EventDispatcher.getInstance().getDispatcher().emit(GameEvents.PIECE_HIDE);
                  
      console.log("hit3");
      return;
    }

    this.gameObjRef.x += moveDist.x * deltaTime;
    this.gameObjRef.y += moveDist.y * deltaTime;
  }
  

  private checkPaddleCollision(moveDist: PIXI.Point): boolean {
    const ballRect: PIXI.Rectangle = new PIXI.Rectangle(
      this.gameObjRef.x - this.gameObjRef.width * 0.5 + moveDist.x,
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
    ) ;
  }
  
}
