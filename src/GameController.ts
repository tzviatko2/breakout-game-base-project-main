import * as PIXI from "pixi.js";
import { EventDispatcher } from "./EventDispatcher";
import { GameView } from "./views/GameView";
import { GameEvents } from "./GameEvents";
import { StartScreen } from "./views/StartScreen";
import { IGameState } from "./states/IGameState";
import { EnterState } from "./states/EnterState";
import { ScoreView } from "./views/ScoreView";
import { NbrBallView } from "./views/NbrBallView";
import { Model } from "./Model";
import { BrickType } from "./game/level/BrickType";
import { EndScreen } from "./views/EndScreen";
import { LostState } from "./states/LostState";

export class GameController extends PIXI.Container {
  private endScreen: EndScreen;
  private startScreen: StartScreen;
  private game: GameView;
  private scoreView: ScoreView;
  private nbrBallView: NbrBallView;
  private currentState: IGameState;
  private gameContainer: PIXI.Container;
  private uiContainer: PIXI.Container;

  constructor() {
    super();
    this.init();
  }

  public changeGameState(newState: IGameState) {
    this.currentState = newState;
  }

  public showStartScreen() {
    this.startScreen.show();
  }

  public hideStartScreen() {
    this.startScreen.hide();
  }

  public showEndScreen() {
    this.endScreen.show();
  }

  public hideEndScreen() {
    this.endScreen.hide();
  }

  public showGame() {
    this.game.show();
    EventDispatcher.getInstance()
      .getDispatcher()
      .emit(GameEvents.NEXT_LEVEL, { level: 1 });
  }

  public showScore() {
    this.scoreView.show();
  }

  public hideScore() {
    this.scoreView.hide();
  }

  public showNbrBall() {
    this.nbrBallView.show();
  }

  public hideNbrBall() {
    this.nbrBallView.hide();
  }

  public hideGame() {
    this.game.hide();
  }

  private init() {
    this.createContainers();
    this.createViews();
    this.resetGame();
    this.setInitialGameState();
    this.addKeyÚpListener();

    EventDispatcher.getInstance()
      .getDispatcher()
      .on(GameEvents.BALL_LOST, this.onBallLost, this);
  }

  private addKeyÚpListener() {
    this.onKeyUp = this.onKeyUp.bind(this);
    document.addEventListener("keyup", this.onKeyUp);
  }

  private setInitialGameState() {
    this.changeGameState(new EnterState(this));
    this.currentState.gameEnter();
  }

  private createContainers() {
    this.uiContainer = new PIXI.Container();
    this.gameContainer = new PIXI.Container();

    this.addChild(this.uiContainer);
    this.addChild(this.gameContainer);
  }

  private createViews() {
    this.game = new GameView();
    this.addChild(this.game);

    this.scoreView = new ScoreView();
    this.addChild(this.scoreView);

    this.nbrBallView = new NbrBallView();
    this.addChild(this.nbrBallView);

    this.startScreen = new StartScreen();
    this.addChild(this.startScreen);

    this.endScreen = new EndScreen();
    this.addChild(this.endScreen);
  }

  private resetGame() {
    Model.getInstance().resetGame();
    this.scoreView.setScore(Model.getInstance().getScore());
    this.nbrBallView.setNbrBall(Model.getInstance().getTotalNbrBall());
  }

  private updateScore(brickType: BrickType) {
    switch (brickType) {
      case BrickType.TYPE_1:
        Model.getInstance().addScore(1);
        break;
      case BrickType.TYPE_2:
        Model.getInstance().addScore(3);
        break;
      case BrickType.TYPE_3:
        Model.getInstance().addScore(5);
        break;
    }

    this.scoreView.setScore(Model.getInstance().getScore());
  }

  private checkEndOfLevel() {
    Model.getInstance().decrementTotalNbrBrick();

    if (Model.getInstance().getTotalNbrBrick() <= 0) {
      Model.getInstance().incrementLevel();
      Model.getInstance().incrementNbrBall();
      this.nbrBallView.setNbrBall(Model.getInstance().getTotalNbrBall());
      EventDispatcher.getInstance()
        .getDispatcher()
        .emit(GameEvents.NEXT_LEVEL, {
          level: Model.getInstance().getCurrentLevel(),
        });
    }
  }

  private onKeyUp() {
    if (
      this.currentState instanceof EnterState ||
      this.currentState instanceof LostState
    ) {
      this.currentState.gameStart();
      EventDispatcher.getInstance().getDispatcher().emit(GameEvents.GAME_START);
    }
  }

  private onBallLost() {}
}
