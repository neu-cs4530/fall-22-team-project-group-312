import {
  RarityMapping,
  TownEmitter,
  WardrobeItem,
  GachaPicker as GachaModel,
  PullResult,
} from '../types/CoveyTownSocket';
import Player from './Player';

/**
 * A class to represent the randomized gacha pull system for getting new outfits.
 */
export default class GachaPicker {
  private _itemPool: WardrobeItem[];

  private _pullCost: number;

  private _refundPercent: number;

  private _townEmitter: TownEmitter;

  // The higher the number, the more likely you are to pull an item of this rarity from the pool
  private _rarityMapping: RarityMapping;

  private _id: string;

  public get itemPool(): WardrobeItem[] {
    return this._itemPool;
  }

  public set itemPool(newPool: WardrobeItem[]) {
    this._itemPool = newPool;
  }

  public get pullCost(): number {
    return this._pullCost;
  }

  public get refundPercent(): number {
    return this._refundPercent;
  }

  /**
   * Adds a new WardrobeItem to this GachaPicker
   * @param item the new item to add
   */
  public addItemToPool(item: WardrobeItem): void {
    this._itemPool.push(item);
    this._townEmitter.emit('gachaUpdate', this.toGachaModel());
  }

  public get rarityMapping(): RarityMapping {
    return this._rarityMapping;
  }

  public get id(): string {
    return this._id;
  }

  /**
   * Creates a new GachaPicker.
   *
   * @param itemPool : the list of WardrobeItems a player can obtain
   * @param pullCost : how many CoveyCoins are needed for one pull
   * @param refundPercent : the percent of a pull that is refunded when a player gets a duplicate,
   * given as a decimal (e.g. 10% = 0.1, 100% = 1)
   */
  constructor(
    itemPool: WardrobeItem[],
    pullCost: number,
    refundPercent: number,
    townEmitter: TownEmitter,
    rarityMapping: RarityMapping,
    id: string,
  ) {
    this._itemPool = itemPool;
    this._pullCost = pullCost;
    this._refundPercent = refundPercent;
    this._townEmitter = townEmitter;
    this._rarityMapping = rarityMapping;
    this._id = id;
  }

  // returns a random item from the selection pool without accounting for item rarity
  // assumes there's at least one item in the pool
  private _getOneItem(): WardrobeItem {
    const max = this._itemPool.length;
    return this._itemPool[Math.random() * max];
  }

  /**
   * Returns a random iterm from the list of items. Randomization is not affected by item weight.
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
  public pull(player: Player): PullResult {
    let newCurrency = player.wardrobe.currency;
    if (this._itemPool.length > 0) {
      newCurrency -= this._pullCost;
      const pulledItem: WardrobeItem = this._getOneItem();
      const pulledItemIsNew = player.wardrobe.addWardrobeItem(pulledItem);
      if (!pulledItemIsNew) {
        // player already has the item so refund, rounded to the nearest integer
        newCurrency += Math.round(this._pullCost * this._refundPercent);
      }
      player.wardrobe.currency = newCurrency;
      this._townEmitter.emit('playerWardrobeChanged', player.toPlayerModel());

      const result: PullResult = { item: pulledItem, wardrobe: player.wardrobe.toModel() };
      return result;
    }
    throw new Error('No items in the pool.');
  }

  toGachaModel(): GachaModel {
    return {
      itemPool: this._itemPool,
      pullCost: this._pullCost,
      refundPercent: this._refundPercent,
      id: this._id,
    };
  }
}
