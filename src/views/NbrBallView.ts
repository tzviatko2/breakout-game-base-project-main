import { BaseView } from "./BaseView";
import * as PIXI from "pixi.js";
import { GameApplication } from "../GameApplication";
import { EventDispatcher } from "../EventDispatcher";
import { GameEvents } from "../GameEvents";
import { BrickType } from "../game/level/BrickType";

export class NbrBallView extends BaseView {
  private label: PIXI.Text;
  private nbrBallText: PIXI.Text;
  private nbrBall: number;

  constructor() {
    super();
  }

  public setNbrBall(ball: number) {}

  protected init() {
    super.init();
    this.createBall();
  }
  protected createBackground() {
    this.background = new PIXI.Graphics();
    this.background.lineStyle({ width: 2, color: 0xffffff });
    this.background.beginFill(0x000000);
    this.background.drawRect(5, GameApplication.STAGE_HEIGHT - 35, 100, 30);
    this.background.endFill();
    this.background.cacheAsBitmap = true;
    this.addChild(this.background);
  }
  private createBall() {
    this.nbrBall = 0;
    this.nbrBallText = new PIXI.Text("Ball: " + this.nbrBall, {
      fontFamily: "Minercraft",
      fill: 0xffffff,
      fontSize: 20,
    });

    this.nbrBallText.resolution = 2;
    this.nbrBallText.anchor.set(0.1);
    this.nbrBallText.x = 20;
    this.nbrBallText.y = GameApplication.STAGE_HEIGHT - 30;
    this.addChild(this.nbrBallText);
  }
}
