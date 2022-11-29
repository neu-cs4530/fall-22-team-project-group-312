import EventEmitter from 'events';
import { useEffect, useState } from 'react';
import TypedEmitter from 'typed-emitter';
import { GachaPicker as GachaModel, RarityMapping, WardrobeItem } from '../types/CoveyTownSocket';
import PlayerController from './PlayerController';

export type GachaEvents = {
  gachaUpdate: (gachapon: GachaModel) => void;
};
export default class GachaController extends (EventEmitter as new () => TypedEmitter<GachaEvents>) {
  private _itemPool: WardrobeItem[];

  private readonly _id: string;

  private _pullCost: number;

  private _refundPercent: number;

  // The higher the number, the more likely you are to pull an item of this rarity from the pool
  private _rarityMapping: RarityMapping;

  constructor(
    pool: WardrobeItem[],
    pullCost: number,
    refundPercent: number,
    rarityMapping: RarityMapping,
    id: string,
  ) {
    super();
    this._id = id;
    this._itemPool = pool;
    this._pullCost = pullCost;
    this._refundPercent = refundPercent;
    this._rarityMapping = rarityMapping;
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

  public get rarityMapping(): RarityMapping {
    return this._rarityMapping;
  }

  // returns a random item from the selection pool, accounting for item rarity
  // assumes there's at least one item in the pool
  private _getOneItem(): WardrobeItem {
    const rarityList: number[] = [];
    for (let i = 0; i < this._itemPool.length; i++) {
      const rarityIndex = i > 0 ? i - 1 : 0;
      rarityList.push(this._rarityMapping[this._itemPool[i].rarity] + rarityList[rarityIndex]);
    }

    let indexOfPulledItem = 0;
    const randomValue = Math.random() * rarityList[rarityList.length - 1];

    for (indexOfPulledItem; indexOfPulledItem < this._itemPool.length; indexOfPulledItem++) {
      if (this._rarityMapping[this._itemPool[indexOfPulledItem].rarity] > randomValue) {
        break;
      }
    }
    if (indexOfPulledItem >= 0 && indexOfPulledItem < this._itemPool.length) {
      return this._itemPool[indexOfPulledItem];
    }
    return this._itemPool[0];
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
   * @throws an error if the pull pool is empty
   */
  public pull(player: PlayerController): WardrobeItem {
    if (this._itemPool.length > 0) {
      player.wardrobe.currency -= this._pullCost;
      const pulledItem: WardrobeItem = this._getOneItem();
      const playerHasGivenItem = player.wardrobe.addWardrobeItem(pulledItem);
      if (!playerHasGivenItem) {
        // refund
        player.wardrobe.currency += Math.round(this._pullCost * this._refundPercent);
      }
      // emit

      return pulledItem;
    }
    throw new Error('No items in the pool.');
  }

  toGachaModel(): GachaModel {
    return {
      id: this.id,
      itemPool: this.itemPool,
      pullCost: this.pullCost,
      refundPercent: this.refundPercent,
      rarityMapping: this.rarityMapping,
    };
  }

  /**
   * Return a representation of this GachaController that matches the
   * townService's representation and is suitable for transmitting over the network.
   */
  toConversationAreaModel(): GachaModel {
    return {
      itemPool: this.itemPool,
      pullCost: this.pullCost,
      refundPercent: this.refundPercent,
      rarityMapping: this.rarityMapping,
      id: this.id,
    };
  }

  static fromGachaModel(modelGacha: GachaModel): GachaController {
    return new GachaController(
      modelGacha.itemPool,
      modelGacha.pullCost,
      modelGacha.refundPercent,
      modelGacha.rarityMapping,
      modelGacha.id,
    );
  }
}

/**
 * A react hook to retrieve gacha data from a GachaController.
 *
 * This hook will re-render any components that use it when the topic changes.
 */
export function useGachaPool(gachapon: GachaController): GachaModel {
  const [gacha, setGacha] = useState(gachapon.toGachaModel());
  useEffect(() => {
    gachapon.addListener('gachaUpdate', setGacha);
    return () => {
      gachapon.removeListener('gachaUpdate', setGacha);
    };
  }, [gachapon]);
  return gacha;
}

/**
 * A react hook to retrieve gacha data from a GachaController.
 *
 * This hook will re-render any components that use it when the topic changes.
 */
export function useGachaResponse(gachapon: GachaController): GachaModel {
  const [gacha, setGacha] = useState(gachapon.toGachaModel());
  useEffect(() => {
    gachapon.addListener('gachaUpdate', setGacha);
    return () => {
      gachapon.removeListener('gachaUpdate', setGacha);
    };
  }, [gachapon]);
  return gacha;
}
