import { BaseView } from "./BaseView";
import * as PIXI from "pixi.js";
import { GameApplication } from "../GameApplication";
import { GameEvents } from "../GameEvents";
import { EventDispatcher } from "../EventDispatcher";
import { BrickType } from "../game/level/BrickType";

export class ScoreView extends BaseView {
  private score: PIXI.Text;
  private nbrScore: number;

  constructor() {
    super();
  }

  public setScore(score: number) {}

  protected init() {
    super.init();
    this.createScore();
  }
  protected createBackground() {
    this.background = new PIXI.Graphics();
    this.background.lineStyle({ width: 2, color: 0xffffff });
    this.background.beginFill(0x000000);
    this.background.drawRect(
      GameApplication.STAGE_WIDTH - 105,
      GameApplication.STAGE_HEIGHT - 35,
      100,
      30
    );
    this.background.endFill();
    this.background.cacheAsBitmap = true;
    this.addChild(this.background);
  }
  private createScore() {
    this.nbrScore = 0;
    this.score = new PIXI.Text("Score: " + this.nbrScore, {
      fontFamily: "Minercraft",
      fill: 0xffffff,
      fontSize: 20,
    });

    this.score.resolution = 2;
    this.score.anchor.set(0.1);
    this.score.x = GameApplication.STAGE_WIDTH - 90;
    this.score.y = GameApplication.STAGE_HEIGHT - 30;
    this.addChild(this.score);
  }
}
