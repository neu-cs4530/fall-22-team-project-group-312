import { DEFAULT_ITEMS } from './WardrobeItem';
import { WardrobeItem, ItemCategory } from '../types/CoveyTownSocket';

export const CURRENCY_GAIN_FROM_CHAT = 1;
export const CURRENCY_GAIN_RATE_FROM_INTERACTABLE_AREA = 2;
export const CURRENCY_GAIN_RATE_FROM_VIEWING_AREA = 2;
export const CURRENCY_GAIN_RATE_FROM_PROXIMITY = 1;

export interface WardrobeJSON {
  currency: number;
  currentSkin: WardrobeItem;
  currentOutfit: WardrobeItem;
  inventory: WardrobeItem[];
}

/**
 * Serves as an inventory for a Player that contains their current currency, any WardrobeItems they
 * have acquired, and the information for the WardrobeItems they are currently wearing.
 */
export default class Wardrobe {
  /** The amount of currency a wardrobe currently has to be spent on WardrobeItems. */
  private _currency: number;

  /** The current skin color set in the wardrobe. */
  private _currentSkin: WardrobeItem;

  /** The current eye color set in the wardrobe. */
  private _currentOutfit: WardrobeItem;

  /** A map of each item category available to the player and the wardrobe items in that cateogry they currently have unlocked.  */
  private _inventory: Map<ItemCategory, WardrobeItem[]>;

  constructor() {
    this._currency = 0;
    this._inventory = new Map<ItemCategory, WardrobeItem[]>();
    this.inventory.set('skin', []);
    this.inventory.set('outfit', []);
    // Add all default items to wardrobe.
    DEFAULT_ITEMS.forEach((item: WardrobeItem) => this.addWardrobeItem(item));
    // Set the default items to the currently worn items in the wardrobe.
    this._currentSkin = DEFAULT_ITEMS.find(
      (item: WardrobeItem) => item.name === '0',
    ) as WardrobeItem;
    this._currentOutfit = DEFAULT_ITEMS.find(
      (item: WardrobeItem) => item.name === 'defualt outfit',
    ) as WardrobeItem;
  }

  public static getWardrobeFromJSON(jsonString: string): Wardrobe | undefined {
    let json: WardrobeJSON;
    try {
      json = JSON.parse(jsonString) as WardrobeJSON;
    } catch {
      return undefined;
    }
    const wardrobe = new Wardrobe();
    wardrobe.currency = json.currency;
    wardrobe._currentSkin = json.currentSkin;
    wardrobe._currentOutfit = json.currentOutfit;
    json.inventory.forEach(item => wardrobe.addWardrobeItem(item));
    return wardrobe;
  }

  public exportWardrobe(): string {
    return JSON.stringify({
      currency: this._currency,
      currentSkin: this._currentSkin,
      currentOutfit: this.currentOutfit,
      inventory: this._inventory.get('outfit') as WardrobeItem[],
    });
  }

  // Returns the currency in the wardrobe.
  get currency(): number {
    return this._currency;
  }

  // Sets the currency in the wardrobe to a new value.
  set currency(value: number) {
    if (value >= 0) {
      this._currency = value;
    } else {
      throw new Error('Currency cannot be negative.');
    }
  }

  // Returns the current skin item of the player this wardrobe corresponds to.
  get currentSkin(): WardrobeItem {
    return this._currentSkin;
  }

  // Sets the skin item of the player to the given WardrobeItem if it is in the inventory.
  set currentSkin(skin: WardrobeItem) {
    if (this._itemIsInInventory(skin) && skin.category === 'skin') {
      this._currentSkin = skin;
    } else {
      throw new Error('Item not in inventory  or invalid');
    }
  }

  // Returns the current outfit of the player this wardrobe corresponds to.
  get currentOutfit(): WardrobeItem {
    return this._currentOutfit;
  }

  // Sets the outfit item of the player to the given WardrobeItem if it is in the inventory.
  set currentOutfit(outfit: WardrobeItem) {
    if (this._itemIsInInventory(outfit) && outfit.category === 'outfit') {
      this._currentOutfit = outfit;
    } else {
      throw new Error('Item not in inventory or invalid');
    }
  }

  // Returns the inventory of the player this wardrobe corresponds to.
  get inventory(): Map<ItemCategory, WardrobeItem[]> {
    return this._inventory;
  }

  /**
   * Adds a new item to the wardrobe if it has not already been added.
   * @param newItem The item to be added.
   * @returns True if the item is not already in the wardrobe, false otherwise.
   */
  public addWardrobeItem(newItem: WardrobeItem): boolean {
    // If the item is not already in the inventory, add the item
    if (!this._itemIsInInventory(newItem)) {
      // Get the array of WardrobeItems corresponding to the category of the newItem.
      const itemArray: WardrobeItem[] | undefined = this.inventory.get(newItem.category);
      if (itemArray !== undefined) {
        itemArray.push(newItem);
        return true;
      }
      throw new Error('Item category not found');
    } else {
      return false;
    }
  }

  /** Checks if the given item is currently in the wardrobe inventory */
  private _itemIsInInventory(item: WardrobeItem): boolean {
    // Get the array of WardrobeItems corresponding to the category of the newItem.
    const itemArray: WardrobeItem[] | undefined = this.inventory.get(item.category);

    if (itemArray !== undefined) {
      // Check if the newItem is already in the array, if not, push it to the array and return true.
      if (itemArray.find(i => i.name === item.name) === undefined) {
        return false;
      }
      return true;
    }
    throw new Error('Item category not found');
  }
}
