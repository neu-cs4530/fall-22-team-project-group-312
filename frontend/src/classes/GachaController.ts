import EventEmitter from 'events';
import TypedEmitter from 'typed-emitter';
import {
  GachaPicker as GachaModel,
  PullResult,
  WardrobeItem,
  WardrobeModel,
} from '../types/CoveyTownSocket';
import PlayerController from './PlayerController';

/**
 * Events that the GachaController will handle.
 */
export type GachaEvents = {
  // If the Gacha object has been changed, emit update.
  gachaUpdate: (gachapon: GachaModel) => void;
};
export default class GachaController extends (EventEmitter as new () => TypedEmitter<GachaEvents>) {
  // Potential items a player can receive from this GachaController
  private _itemPool: WardrobeItem[];

  private readonly _id: string;

  // Cost in currency to activate the Gacha and receive a random outfit.
  private _pullCost: number;

  // The percent of _pullCost refunded to the user if they receive a duplicate item.
  private _refundPercent: number;

  constructor(pool: WardrobeItem[], pullCost: number, refundPercent: number, id: string) {
    super();
    this._id = id;
    this._itemPool = pool;
    this._pullCost = pullCost;
    this._refundPercent = refundPercent;
  }

  get id(): string {
    return this._id;
  }

  public get itemPool(): WardrobeItem[] {
    return this._itemPool;
  }

  public set itemPool(newPool: WardrobeItem[]) {
    this._itemPool = newPool;
    this.emit('gachaUpdate', this.toGachaModel());
  }

  public get pullCost(): number {
    return this._pullCost;
  }

  public set pullCost(newCost: number) {
    this._pullCost = newCost;
  }

  public get refundPercent(): number {
    return this._refundPercent;
  }

  public set refundPercent(newRefund: number) {
    this._refundPercent = newRefund;
  }

  // returns a random item from the selection pool, disregarding rarity
  // assumes there's at least one item in the pool
  private _getOneItem(): WardrobeItem {
    const max = this._itemPool.length;
    const randomValue = Math.floor(Math.random() * max);

    return this._itemPool[randomValue];
  }

  /**
   * Returns a random iterm from the list of items. Randomization is not affected by item rarity.
   * Players are not guaranteed to receive different items on every pull.
   * If a player lacks sufficient currency to make a pull, throw an error message.
   *
   * If a player has enough currency to make a pull,
   * subtract that amount from the player's inventory
   *
   * If the player already has the item they pulled, partially refund
   * the cost of the pull. Otherwise, add the item to their inventory
   *
   * Assumes the player has enough currency to make the pull.
   *
   * Emits the pulled item to the frontend.
   * @param player the player pulling from the gacha pool
   * @throws an error if the pull pool is empty
   */
  public pull(player: PlayerController): PullResult {
    let newCurrency = player.wardrobe.currency;

    const newInventory = player.wardrobe.inventory;
    if (this._itemPool.length > 0) {
      newCurrency -= this._pullCost;
      const pulledItem: WardrobeItem = this._getOneItem();
      const pulledItemIsDupe = newInventory.find(item => item.id === pulledItem.id);

      if (pulledItemIsDupe) {
        // refund duplicate.
        newCurrency += Math.round(this._pullCost * this._refundPercent);
      } else {
        newInventory.push(pulledItem);
      }
      const newWardrobeModel: WardrobeModel = {
        currency: newCurrency,
        currentSkin: player.wardrobe.currentSkin,
        currentOutfit: player.wardrobe.currentOutfit,
        inventory: newInventory,
      };
      player.wardrobe = newWardrobeModel;

      const result: PullResult = { item: pulledItem, wardrobe: newWardrobeModel };
      return result;
    }
    // A GachaContorller must have items for the user to pull.
    throw new Error('No items in the pool.');
  }

  /**
   * Return a representation of this GachaController that matches the
   * townService's representation and is suitable for transmitting over the network.
   */
  toGachaModel(): GachaModel {
    return {
      itemPool: this.itemPool,
      pullCost: this.pullCost,
      refundPercent: this.refundPercent,
      id: this.id,
    };
  }

  /**
   * Create a GachaController based on the properties of a given GachaModel.
   * @param modelGacha The model to generate a GachaController from.
   * @returns A new GachaController based on the given model.
   */
  static fromGachaModel(modelGacha: GachaModel): GachaController {
    return new GachaController(
      modelGacha.itemPool,
      modelGacha.pullCost,
      modelGacha.refundPercent,
      modelGacha.id,
    );
  }
}
