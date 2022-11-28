import { WardrobeItem } from '../types/CoveyTownSocket';
import Player from './Player';

export const PULL_COST = 1000;

/**
 * A class to represent the randomized gacha pull system for getting new outfits.
 */
export default class GachaPicker {
  private _itemPool: WardrobeItem[];

  private _pullCost: number;

  private _refundPercent: number;

  // The higher the number, the more likely you are to pull an item of this rarity from the pool
  private _rarityMapping = {
    common: 10,
    rare: 5,
    ultraRare: 1,
  };

  public get itemPool(): WardrobeItem[] {
    return this._itemPool;
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
  }

  /**
   * Creates a new GachaPicker.
   *
   * @param itemPool : the list of WardrobeItems a player can obtain
   * @param pullCost : how many CoveyCoins are needed for one pull
   * @param refundPercent : the percent of a pull that is refunded when a player gets a duplicate,
   * given as a decimal (e.g. 10% = 0.1, 100% = 1)
   */
  constructor(itemPool: WardrobeItem[], pullCost: number, refundPercent: number) {
    this._itemPool = itemPool;
    this._pullCost = pullCost;
    this._refundPercent = refundPercent;
  }

  // might refactor this to go into the Player interface instead
  private static _playerHasGivenItem(player: Player, item: WardrobeItem): boolean {
    const inventory: WardrobeItem[] | undefined = player.wardrobe.inventory.get('outfit');

    return inventory !== undefined ? inventory.includes(item) : false;
  }

  // returns a random item from the selection pool, accounting for item rarity
  private _getOneItem(): WardrobeItem {
    const rarityList: number[] = [];
    for (let i = 0; i < this._itemPool.length; i++) {
      rarityList.push(this._rarityMapping[this._itemPool[i].rarity] + rarityList[i - 1] || 0);
    }

    let indexOfPulledItem = 0;
    const randomValue = Math.random() * rarityList[rarityList.length - 1];

    for (indexOfPulledItem; indexOfPulledItem < this._itemPool.length; indexOfPulledItem++) {
      if (this._rarityMapping[this._itemPool[indexOfPulledItem].rarity] > randomValue) {
        break;
      }
    }
    return this._itemPool[indexOfPulledItem];
  }

  /**
   * Returns a random iterm from the list of items. Randomization is affected by item weight.
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
   */
  public pull(player: Player): WardrobeItem {
    player.wardrobe.currency -= this._pullCost;
    const pulledItem: WardrobeItem = this._getOneItem();
    if (GachaPicker._playerHasGivenItem(player, pulledItem)) {
      // refund
      player.wardrobe.currency += this._pullCost * this._refundPercent;
      // emit
    } else {
      // adds it to the player's inventory
      player.wardrobe.addWardrobeItem(pulledItem);
    }

    return pulledItem;
  }
}
