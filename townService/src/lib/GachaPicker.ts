import { Player, WardrobeItem } from '../types/CoveyTownSocket';

/**
 * A class to represent the randomized gacha pull system for getting new outfits
 */
export default class GachaPicker {
  public readonly items: WardrobeItem[];

  private _pullCost: number;

  constructor(items: WardrobeItem[], pullCost: number) {
    this.items = items;
    this._pullCost = pullCost;
  }

  /**
   * Returns a random iterm from the list of items. Randomization is affected by item weight.
   * Players are not guaranteed to receive different items on every pull.
   * If a player lacks sufficient currency to make a pull, throw an error message.
   * If a player has enough currency to make a pull,
   * subtract that amount from the player's inventory
   * @param player the player pulling from the gacha pool
   */
  public pull(player: Player): WardrobeItem {
    let maxRange = 0;
    for (let i = 0; i < this.items.length; i++) {
      maxRange += this.items.rarity;
    }
    const min = 0;
    if (player.wardrobe.currency >= this._pullCost) {
      player.wardrobe.currency -= this._pullCost;

      const randomNumber = Math.floor(Math.random() * (max - min + 1) + min);
      // // refactor
      // const random = this.safeNext() * this.totalWeight;
      // let currentWeight = 0;

      // for (const item of this.items) {
      //   currentWeight += item.weight;
      //   if (random <= currentWeight) {
      //     if (this.options?.removeOnPick) {
      //       this.internalSet(this.items.filter(i => i !== item));
      //     }

      //     return item.original;
      //   }
      // }

      // do the pull;
    } else {
      // emit a failure message;
    }
  }
}
