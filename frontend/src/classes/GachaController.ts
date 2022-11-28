import EventEmitter from 'events';
import TypedEmitter from 'typed-emitter';
import { GachaPicker as GachaModel, WardrobeItem } from '../types/CoveyTownSocket';
import PlayerController from './PlayerController';

export type GachaEvents = {
  // movement: (newLocation: PlayerLocation) => void;
  outfitPull: (pullingPlayer: PlayerController) => void;
};

export default class GachaController extends (EventEmitter as new () => TypedEmitter<GachaEvents>) {
  private _pool: WardrobeItem[];

  private readonly _id: string;

  private _pullCost: number;

  private _refundPercent: number;

  constructor(pool: WardrobeItem[], pullCost: number, refundPercent: number, id: string) {
    super();
    this._id = id;
    this._pool = pool;
    this._pullCost = pullCost;
    this._refundPercent = refundPercent;
  }

  get id(): string {
    return this._id;
  }

  // Returns the player's current wardrobe.
  get pool(): WardrobeItem[] {
    return this._pool;
  }

  // Change the player's wardrobe. Emit an update signaling this change.
  set pool(newPool: WardrobeItem[]) {
    this._pool = newPool;
    // this._updateGameComponentLocation();
    // this.emit('movement', this.location);
  }

  get pullCost(): number {
    return this._pullCost;
  }

  set pullCost(newCost: number) {
    this._pullCost = newCost;
  }

  get refundPercent(): number {
    return this._refundPercent;
  }

  set refundPercent(newRefund: number) {
    this._refundPercent = newRefund;
  }

  toGachaModel(): GachaModel {
    return {
      id: this.id,
      pool: this.pool,
      pullCost: this.pullCost,
      refundPercent: this.refundPercent,
    };
  }

  public pull() {}

  // private _updateGameComponentLocation() {
  //   if (this.gameObjects && !this.gameObjects.locationManagedByGameScene) {
  //     const { sprite, label } = this.gameObjects;
  //     if (!sprite.anims) return;
  //     sprite.setX(this.location.x);
  //     sprite.setY(this.location.y);
  //     label.setX(sprite.body.position.x);
  //     label.setY(sprite.body.position.y - 20);
  //     if (this.location.moving) {
  //       sprite.anims.play(`misa-${this.location.rotation}-walk`, true);
  //     } else {
  //       sprite.anims.stop();
  //       sprite.setTexture('atlas', `misa-${this.location.rotation}`);
  //     }
  //   }
  // }

  /* Creates and stores sprite objects based on the currently equipped wardrobe items
  of the player. */
  private async _generateSprite() {
    // Signifies the folder where each sprite is held
  }

  static fromGachaModel(modelGacha: GachaModel): GachaController {
    return new GachaController(
      modelGacha.pool,
      modelGacha.pullCost,
      modelGacha.refundPercent,
      modelGacha.id,
    );
  }
}
