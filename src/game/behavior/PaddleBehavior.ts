import { GameObject } from "../GameObject";
import { GameObjectBehavior } from "./GameObjectBehavior";
import * as PIXI from "pixi.js";
import { GameApplication } from "../../GameApplication";
import { EventDispatcher } from "../../EventDispatcher";
import { GameEvents } from "../../GameEvents";
import { BrickType } from "../level/BrickType";

export class PaddleBehavior extends GameObjectBehavior {
  private VELOCITY = 15;
  private direction = 0;
  private timeOutId: NodeJS.Timeout;
  private intervalId: NodeJS.Timer;
  private justHit = false;

  constructor(gameObjRef: GameObject) {
    super(gameObjRef);
    
  }

  public update(deltaTime: number) {
    if (this.direction === 1) {
      this.moveRight(deltaTime);
      return;
    }

    if (this.direction === -1) {
      this.moveLeft(deltaTime);
      return;
    }
  }

  protected init() {
    this.setInitialPosition();
    
    
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    document.addEventListener("keydown", this.onKeyDown);
    document.addEventListener("keyup", this.onKeyUp);
    EventDispatcher.getInstance().getDispatcher().on(GameEvents.NEXT_LEVEL, this.setInitialPosition, this);
    EventDispatcher.getInstance().getDispatcher().on(GameEvents.BRICK_HIT, this.onBrickHit, this);
    EventDispatcher.getInstance().getDispatcher().on(GameEvents.PIECE_HIDE, this.onPieceHit, this);
  }

  private setInitialPosition() {
    this.gameObjRef.x =
      GameApplication.STAGE_WIDTH * 0.5 - this.gameObjRef.width * 0.5;
    this.gameObjRef.y = GameApplication.STAGE_HEIGHT * 0.8;
  }

  private onKeyUp(e: any) {
    switch (e.code) {
      case "ArrowRight":
        if (this.direction === 1) {
          this.direction = 0;
        }
        break;
      case "ArrowLeft":
        if (this.direction === -1) {
          this.direction = 0;
        }
        break;
    }
  }

  private onKeyDown(e: any) {
    if (this.direction !== 0) {
      return;
    }

    switch (e.code) {
      case "ArrowRight":
        this.direction = 1;
        break;
      case "ArrowLeft":
        this.direction = -1;
        break;
    }
  }

  private moveLeft(deltaTime: number) {
    if (!this.gameObjRef.isActive()) {
      return;
    }

    if (this.gameObjRef.x - this.VELOCITY > 0) {
      this.gameObjRef.x -= this.VELOCITY * deltaTime;
    } else {
      this.gameObjRef.x = 0;
    }
  }

  private moveRight(deltaTime: number) {
    if (!this.gameObjRef.isActive()) {
      return;
    }

    if (
      this.gameObjRef.x + this.gameObjRef.width + this.VELOCITY <
      GameApplication.STAGE_WIDTH
    ) {
      this.gameObjRef.x += this.VELOCITY * deltaTime;
    } else {
      this.gameObjRef.x = GameApplication.STAGE_WIDTH - this.gameObjRef.width;
    }
  }
  private onBrickHit(e: any) {
    
    
    if (e.brickType === BrickType.TYPE_3) {
      
      this.gameObjRef.width *= 1.2;

      
      if(this.timeOutId) {
        clearTimeout(this.timeOutId)
      }

      this.timeOutId = setTimeout(() => {
        
        this.gameObjRef.width = 60;
      }, 5000);
    }
  }
  private onPieceHit(e: any) {
    if (this.justHit) {
      return;
    }
    
    this.justHit = true;
    setTimeout(() => {
      this.justHit = false;
    }, 500);
    console.log("hi")
    let counter = 0;
    this.intervalId = setInterval(() => {
      (this.gameObjRef.getRenderableById("paddleImg") as PIXI.Sprite).tint = (counter % 2 === 0) ? 0xff0000 : 0xfffff;
    
      counter++;
    }, 500);

// if(this.intervalId) {
//   clearInterval(this.intervalId);
// }

setTimeout(() => {  
  clearInterval(this.intervalId);
  (this.gameObjRef.getRenderableById("paddleImg") as PIXI.Sprite).tint = 0xffffff;
}, 5000);
    //(this.gameObjRef.getRenderableById("paddleImg") as PIXI.Sprite).tint = 0xff0000;
    
      //console.log(this.gameObjRef.getRenderableById("paddleImg"));
      //(this.gameObjRef.getRenderableById("paddle") as PIXI.Sprite).tint = 0xff0000;

      //console.log(this.gameObjRef.getId("paddle"));
      // if(this.timeOutId) {
      //   clearTimeout(this.timeOutId)
      // }

      // this.timeOutId = setTimeout(() => {
        
      //   this.gameObjRef.width = 60;
      // }, 5000);
    
  }
}
