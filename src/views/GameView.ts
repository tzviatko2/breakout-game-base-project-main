import * as PIXI from "pixi.js";
import { GameApplication } from "../GameApplication";
import { BaseView } from "./BaseView";
import { GameObject } from "../game/GameObject";
import { PaddleBehavior } from "../game/behavior/PaddleBehavior";
import { BallBehavior } from "../game/behavior/BallBehavior";
import { LevelFactory } from "../game/level/LevelFactory";
import { EventDispatcher } from "../EventDispatcher";
import { GameEvents } from "../GameEvents";
import {CollisionManager} from "../CollisionManager" 
import { sound } from '@pixi/sound';
import { Sprite } from "pixi.js";
import { PieceBehavior1} from "../game/behavior/PieceBehavior1"; 
import { PieceBehavior2} from "../game/behavior/PieceBehavior2"; 
import { PieceBehavior3} from "../game/behavior/PieceBehavior3"; 

export class GameView extends BaseView {
  private gameObjects: Map<string, GameObject>;
  private levelFactory: LevelFactory;
  private collisionManager: CollisionManager;  

  public show() {
    super.show();

    this.activate();
  }

  public hide() {
    super.hide();

    this.deactivate();
  }

  public getGameObjectById(id: string): GameObject | null | undefined {
    if (!this.gameObjects.has(id)) {
      console.warn("getGameObjectById() " + id + " does not exist");
      return null;
    }

    return this.gameObjects.get(id);
  }

  public registerGameObject(id: string, gameObj: GameObject) {
    gameObj.setId(id);
    this.gameObjects.set(id, gameObj);
    this.addChild(gameObj);
  }

  public unregisterGameObject(id: string) {
    const gameObject: GameObject = this.getGameObjectById(id);

    if (!gameObject) {
      console.warn("unregisterGameObject() " + id + " does not exist");
      return;
    }

    this.removeChild(gameObject);
    this.gameObjects.delete(id);
    gameObject.destroy();
  }

  protected init() {
    super.init();
    this.createCollisionManager();
    this.gameObjects = new Map<string, GameObject>();
    this.hide();
    this.createGameObjects();
    this.collisionManager.registerBall(this.getGameObjectById("ball"));

    this.levelFactory = new LevelFactory(this);
    EventDispatcher.getInstance().getDispatcher().on(GameEvents.NEXT_LEVEL, this.setNextLevel, this);
    EventDispatcher.getInstance().getDispatcher().on(GameEvents.BRICK_HIDE, this.onBrickHide, this);
    EventDispatcher.getInstance().getDispatcher().on(GameEvents.PIECE_HIDE, this.onPieceHide, this);
  }

  private activate() {
    this.activateGameObjects();
    GameApplication.getApp().ticker.add(this.update, this);
  }

  private deactivate() {
    this.deactivateGameObjects();
    GameApplication.getApp().ticker.remove(this.update, this);
  }

  private createCollisionManager() {
    this.collisionManager = new CollisionManager();
  }

  protected createBackground() {
    this.background = new PIXI.Graphics();
    this.background.beginFill(0x000000);
    this.background.lineStyle({ width: 2, color: 0xffffff });
    this.background.drawRect(
      0,
      0,
      GameApplication.STAGE_WIDTH,
      GameApplication.STAGE_HEIGHT
    );
    this.background.endFill();

    this.addChild(this.background);
  }

  private createGameObjects() {
    this.createPaddle();
    this.createBall();
  }

  private generateLevel(level: number) {
    this.levelFactory.getNextLevel(level).forEach((e, i) => {
        this.registerGameObject("brick"+i, e);
        this.collisionManager.registerBrickObject(e);
        //console.log(this.gameObjects)
    });

  }

   private setNextLevel(e: any) {
    this.collisionManager.clear();
      this.clearCurrentLevel();
      this.generateLevel(e.level);
   }

   private clearCurrentLevel() {
    this.gameObjects.forEach((obj) => {
      if(obj.getId() !== "paddle" && obj.getId() !== "ball") {
        this.unregisterGameObject(obj.getId());
      }
    });
   }

  private createPaddle() {
    const paddle: GameObject = new GameObject(this);
    const gfx: PIXI.Graphics = new PIXI.Graphics();
    gfx.beginFill(0xffffff);
    gfx.drawRoundedRect(0, 0, 60, 8, 10);
    gfx.endFill();
    gfx.cacheAsBitmap = true;
    const texture: PIXI.Texture = GameApplication.getApp().renderer.generateTexture(gfx);
    const sprite: PIXI.Sprite = new PIXI.Sprite(texture);
    paddle.registerRenderable("paddleImg", sprite);

    const paddleBehavior: PaddleBehavior = new PaddleBehavior(paddle);
    paddle.registerBehavior("paddleBehavior", paddleBehavior);
    this.registerGameObject("paddle", paddle);
  }

  private createBall() {
    const ball: GameObject = new GameObject(this);
    const gfx: PIXI.Graphics = new PIXI.Graphics();
    gfx.beginFill(0xffffff);
    gfx.drawCircle(0, 0, 10);
    gfx.endFill();
    gfx.cacheAsBitmap = true;
    const texture: PIXI.Texture = GameApplication.getApp().renderer.generateTexture(gfx);
    const sprite: PIXI.Sprite = new PIXI.Sprite(texture);     
    sprite.anchor.set(0.5);
    ball.registerRenderable("ballImg", sprite);
    const ballBehavior: BallBehavior = new BallBehavior(ball);
    ball.registerBehavior("ballBehavior", ballBehavior);
    this.registerGameObject("ball", ball);
  }
  private createPiece(x: number, y: number) {
    const piece1: GameObject = new GameObject(this);
    const piece2: GameObject = new GameObject(this);
    const piece3: GameObject = new GameObject(this);
    const gfx: PIXI.Graphics = new PIXI.Graphics();
    gfx.beginFill(0xff0000);
    gfx.drawCircle(0, 0, 5);
    gfx.endFill();
    gfx.cacheAsBitmap = true;
    const texture: PIXI.Texture = GameApplication.getApp().renderer.generateTexture(gfx);
    const sprite1: PIXI.Sprite = new PIXI.Sprite(texture);
    sprite1.x = x;
    sprite1.y = y;
    const sprite2: PIXI.Sprite = new PIXI.Sprite(texture);
    sprite2.x = x;
    sprite2.y = y;
    const sprite3: PIXI.Sprite = new PIXI.Sprite(texture);
    sprite3.x = x;
    sprite3.y = y;
    //sprite.anchor.set(0.5);
    piece1.registerRenderable("pieceImg", sprite1);
    const pieceBehavior1: PieceBehavior1  = new PieceBehavior1(piece1);
    piece1.registerBehavior("pieceBehavior", pieceBehavior1);
    this.registerGameObject("piece1", piece1);
    piece2.registerRenderable("pieceImg", sprite2);
    const pieceBehavior2: PieceBehavior2  = new PieceBehavior2(piece2);
    piece2.registerBehavior("pieceBehavior", pieceBehavior2);
    this.registerGameObject("piece2", piece2);
    piece3.registerRenderable("pieceImg", sprite3);
    const pieceBehavior3: PieceBehavior3  = new PieceBehavior3(piece3);
    piece3.registerBehavior("pieceBehavior", pieceBehavior3);
    this.registerGameObject("piece3", piece3);
  }

  private activateGameObjects() {
    this.gameObjects.forEach((obj, id) => {
      obj.activate();
    });
  }

  private deactivateGameObjects() {
    this.gameObjects.forEach((obj, id) => {
      obj.deactivate();
    });
  }
  
  private update(deltaTime: number) {
    this.gameObjects.forEach((obj, id) => {
      obj.update(deltaTime);
    });
    this.collisionManager.update();
  }
  private onBrickHide(e: any) {        
    sound.add('my-sound', '../assets/sound/mixkit-underground-explosion-impact-echo-1686.wav');
    sound.play('my-sound');
    
    //const sprite = Sprite.from("../assets/image/sun-sunglasses.jpg");
    const x: number = this.getGameObjectById(e.brickId).x;
    const y: number = this.getGameObjectById(e.brickId).y;
if(this.getGameObjectById("piece1")){
  this.getGameObjectById("piece1").unregisterRenderable("pieceImg"); 
  this.getGameObjectById("piece2").unregisterRenderable("pieceImg"); 
  this.getGameObjectById("piece3").unregisterRenderable("pieceImg"); 

} 
    this.createPiece(x, y);
  
   //console.log(this.gameObjects);
    this.collisionManager.unregisterBrickObject(e.brickId);     
    this.unregisterGameObject(e.brickId);    
  }

   private onPieceHide(e: any) {
  //   console.log(this.gameObjects);
  //this.getGameObjectById(e.pieceId).unregisterRenderable("pieceImg");
     //this.unregisterGameObject(e.pieceId);
 
     //console.log(this.gameObjects);
   }
}
