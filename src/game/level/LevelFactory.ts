import * as PIXI from "pixi.js";
import { GameView } from "../../views/GameView";
import { GameObject } from "../GameObject";
import { GameApplication } from "../../GameApplication";
import { BrickType } from "./BrickType";
import { Model } from "../../Model";

export class LevelFactory extends PIXI.Container {
  private bricks: Array<GameObject>;
  private gameViewRef: GameView;
  private brickTop = 100;

  constructor(gameViewRef: GameView) {
    super();

    this.gameViewRef = gameViewRef;
    this.init();
  }

  public getNextLevel(level: number): Array<GameObject> {
    if (level === 1) {
      return this.getLevel(1);
    }

    if (level > 1) {
      return this.getLevel(2);
    }
  }

  private getLevel(difficulty: number): Array<GameObject> {
    let nbrBrickHorizontal: number;
    let nbrBrickVertical: number;
    let brickWidth: number;
    let brickHeight: number;

    this.bricks = [];

    if (difficulty === 1) {
      nbrBrickHorizontal = 10;
      nbrBrickVertical = 3;
      Model.getInstance().setTotalNbrBrick(
        nbrBrickHorizontal * nbrBrickVertical
      );
      brickWidth = (GameApplication.STAGE_WIDTH - 4) / nbrBrickHorizontal;
      brickHeight = Math.floor(GameApplication.STAGE_HEIGHT * 0.03);
      for (let i = 0; i < nbrBrickVertical; i++) {
        for (let j = 0; j < nbrBrickHorizontal; j++) {}
      }
      return this.bricks;
    }

    if (difficulty === 2) {
      nbrBrickHorizontal = 15;
      nbrBrickVertical = 3;
      Model.getInstance().setTotalNbrBrick(
        nbrBrickHorizontal * nbrBrickVertical
      );
      brickWidth = (GameApplication.STAGE_WIDTH - 4) / nbrBrickHorizontal;
      brickHeight = Math.floor(GameApplication.STAGE_HEIGHT * 0.03);
      for (let i = 0; i < nbrBrickVertical; i++) {
        for (let j = 0; j < nbrBrickHorizontal; j++) {}
      }
      return this.bricks;
    }

    return this.bricks;
  }

  private init() {
    this.bricks = [];
  }

  private brickFactory(
    difficulty: number,
    width: number,
    height: number
  ): GameObject {
    const brick: GameObject = new GameObject(this.gameViewRef);
    const gfx: PIXI.Graphics = new PIXI.Graphics();

    switch (difficulty) {
      case 1:
        {
        }
        break;
      case 2:
        {
        }
        break;
      case 3:
        {
        }
        break;
    }

    return brick;
  }
}
