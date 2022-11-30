import { DEFAULT_ITEMS, UNLOCKABLE_ITEMS } from './WardrobeItem';
import { WardrobeItem, WardrobeModel, ItemID } from '../types/CoveyTownSocket';

// Different rates for gaining currency by completing various objectives.
export const CURRENCY_GAIN_FROM_CHAT = 1;
export const CURRENCY_GAIN_RATE_FROM_INTERACTABLE_AREA = 2;
export const CURRENCY_GAIN_RATE_FROM_VIEWING_AREA = 2;
export const CURRENCY_GAIN_RATE_FROM_PROXIMITY = 1;

/**
 * Represents a parsed JSON string that contains the information needed to update a
 * Wardrobe object.
 */
export interface WardrobeJSON {
  currency: number;
  currentSkinID: ItemID;
  currentOutfitID: ItemID;
  inventory: ItemID[];
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

  /** A list of the wardrobe items currently unlocked.  */
  private _inventory: WardrobeItem[];

  constructor() {
    this._currency = 0;
    this._inventory = [];
    // Add all default items to wardrobe.
    DEFAULT_ITEMS.forEach((item: WardrobeItem) => this.addWardrobeItem(item));
    // Set the default items to the currently worn items in the wardrobe.
    this._currentSkin = this.inventory.find(
      (item: WardrobeItem) => item.id === 'skin1',
    ) as WardrobeItem;
    this._currentOutfit = this.inventory.find(
      (item: WardrobeItem) => item.id === 'misa',
    ) as WardrobeItem;
  }

  /**
   * Updates a wardrobe based on a json string of wardrobe info. Used in
   * the import wardrobe feature to automatically fill a wardrobe based on a player's previous
   * items.
   * @param jsonString The json string containing the information to update a wardobe.
   */
  public updateWardrobeFromJSON(jsonString: string): void {
    let json: WardrobeJSON;
    // Parse the string for Wardrobe information
    try {
      json = JSON.parse(jsonString) as WardrobeJSON;
    } catch {
      throw new Error('Invalid string format for json');
    }
    const newWardrobe = new Wardrobe();
    newWardrobe.currency = json.currency;
    // Add each unlocked item to the inventory.
    json.inventory.forEach(newItemId => {
      const newItem = UNLOCKABLE_ITEMS.find(item => item.id === newItemId);
      if (newItem === undefined) {
        throw new Error('Invalid item in inventory');
      }
      newWardrobe.addWardrobeItem(newItem);
    });
    // Set current equipped items.
    const currentSkin = newWardrobe.inventory.find(item => item.id === json.currentSkinID);
    if (currentSkin === undefined) {
      throw new Error('Invalid skin equipped');
    }
    newWardrobe.currentSkin = currentSkin;
    const currentOutfit = newWardrobe.inventory.find(item => item.id === json.currentOutfitID);
    if (currentOutfit === undefined) {
      throw new Error('Invalid outfit equipped');
    }
    newWardrobe.currentOutfit = currentOutfit;
    // Sets this wardrobes data to match the new one
    this.currency = newWardrobe.currency;
    this.inventory = newWardrobe.inventory;
    this.currentOutfit = newWardrobe.currentOutfit;
    this.currentSkin = newWardrobe.currentSkin;
  }

  /**
   * Converts the Wardrobe to a JSON string for the user to save and use for future imports.
   * @returns A string in JSON format representing the information of this Wardrobe.
   */
  public exportWardrobeToJSON(): string {
    // Convery the information of the Wardrobe to a string.
    return JSON.stringify({
      currency: this.currency,
      currentSkinID: this.currentSkin.id,
      currentOutfitID: this.currentOutfit.id,
      inventory: this._inventory
        .filter(item => DEFAULT_ITEMS.find(i => i.id === item.id) === undefined)
        .map(item => item.id),
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

  // Returns the current skin of the player this wardrobe corresponds to.
  get currentSkin(): WardrobeItem {
    return this._currentSkin;
  }

  // Sets the skin of the player to the given WardrobeItem if it is in the inventory.
  set currentSkin(skin: WardrobeItem) {
    if (this._itemIsInInventory(skin) && skin.category === 'skin') {
      this._currentSkin = skin;
    } else {
      throw new Error('Item not in inventory or invalid');
    }
  }

  // Returns the current outfit of the player this wardrobe corresponds to.
  get currentOutfit(): WardrobeItem {
    return this._currentOutfit;
  }

  // Sets the outfit of the player to the given WardrobeItem if it is in the inventory.
  set currentOutfit(outfit: WardrobeItem) {
    if (this._itemIsInInventory(outfit) && outfit.category === 'outfit') {
      this._currentOutfit = outfit;
    } else {
      throw new Error('Item not in inventory or invalid');
    }
  }

  // Returns the inventory of the player this wardrobe corresponds to.
  get inventory(): WardrobeItem[] {
    return this._inventory;
  }

  // Sets the inventory of the player this wardrobe corresponds to.
  set inventory(newInventory: WardrobeItem[]) {
    this._inventory = newInventory;
  }

  /**
   * Converts a Wardrobe to a WardrobeModel suitable for emitters and PlayerController.
   * @returns A WardrobeModel object based on the wardrobe
   */
  public toModel(): WardrobeModel {
    return {
      currency: this.currency,
      currentSkin: this.currentSkin,
      currentOutfit: this.currentOutfit,
      inventory: this.inventory,
    };
  }

  /**
   * Updates this wardrobe based on the given WardrobeModel
   * @param model A WardrobeModel object that this Wardrobe will update to match.
   */
  public updateFromModel(model: WardrobeModel) {
    this.currency = model.currency;
    this.currentOutfit = model.currentOutfit;
    this.currentSkin = model.currentSkin;
    this.inventory = model.inventory;
  }

  /**
   * Adds a new item to the wardrobe if it has not already been added.
   * @param newItem The item to be added.
   * @returns True if the item is not already in the wardrobe, false otherwise.
   */
  public addWardrobeItem(newItem: WardrobeItem): boolean {
    // If the item is not already in the inventory, add the item
    if (!this._itemIsInInventory(newItem)) {
      this.inventory.push(newItem);
      return true;
    }
    // Return false if item is already within the inventory.
    return false;
  }

  /** Checks if the given item is currently in the wardrobe inventory */
  private _itemIsInInventory(item: WardrobeItem): boolean {
    // Check if the newItem is already in the inventory
    if (this.inventory.find(i => i.id === item.id) === undefined) {
      return false;
    }
    return true;
  }
}
