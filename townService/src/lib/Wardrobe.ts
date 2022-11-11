import WardrobeItem, { ItemCategory } from './WardrobeItem';
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
  private _currentEyes: WardrobeItem;

  /** The current hairstlye set in the wardrobe. */
  private _currentHair: WardrobeItem;

  /** The current clothing item set in the wardrobe. */
  private _currentClothing: WardrobeItem;

  /** The current accessory item set in the wardrobe. */
  private _currentAccessory: WardrobeItem;

  /** A map of each item category available to the player and the wardrobe items in that cateogry they currently have unlocked.  */
  private _inventory: Map<ItemCategory, WardrobeItem[]>;

  constructor() {
    this._currency = 0;
    this._currentSkin = null;
    this._currentEyes = null;
    this._currentClothing = null;
    this._currentHair = null;
    this._currentAccessory = null;
    this._inventory = new Map<ItemCategory, WardrobeItem[]>();
    this.inventory.set('skin', []);
    this.inventory.set('eyes', []);
    this.inventory.set('hair', []);
    this.inventory.set('clothing', []);
    this.inventory.set('accessory', []);
    this.addWardrobeItem(this.currentSkin);
    this.addWardrobeItem(this.currentEyes);
    this.addWardrobeItem(this.currentClothing);
    this.addWardrobeItem(this.currentHair);
    this.addWardrobeItem(this.currentAccessory);
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
    if (this._itemIsInInventory(skin)) {
      this._currentSkin = skin;
    }
  }

  // Returns the current eye item of the player this wardrobe corresponds to.
  get currentEyes(): WardrobeItem {
    return this._currentEyes;
  }

  // Sets the eye item of the player to the given WardrobeItem if it is in the inventory.
  set currentEyes(eyes: WardrobeItem) {
    if (this._itemIsInInventory(eyes)) {
      this._currentEyes = eyes;
    }
  }

  // Returns the current hair item of the player this wardrobe corresponds to.
  get currentHair(): WardrobeItem {
    return this._currentHair;
  }

  // Sets the hair item of the player to the given WardrobeItem if it is in the inventory.
  set currentHair(hair: WardrobeItem) {
    if (this._itemIsInInventory(hair)) {
      this._currentHair = hair;
    }
  }

  // Returns the current clothing item of the player this wardrobe corresponds to.
  get currentClothing(): WardrobeItem {
    return this._currentClothing;
  }

  // Sets the clothing of the player to the given WardrobeItem if it is in the inventory.
  set currentClothing(clothing: WardrobeItem) {
    if (this._itemIsInInventory(clothing)) {
      this._currentClothing = clothing;
    }
  }

  // Returns the current accessory of the player this wardrobe corresponds to.
  get currentAccessory(): WardrobeItem {
    return this._currentAccessory;
  }

  // Sets the accessory of the player to the given WardrobeItem if it is in the inventory.
  set currentAccessory(accessory: WardrobeItem) {
    if (this._itemIsInInventory(accessory)) {
      this._currentAccessory = accessory;
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
  public addWardrobeItem(newItem: WardrobeItem) {
    // If the item is not already in the inventory, add the item
    if (!this._itemIsInInventory(newItem)) {
      // Get the array of WardrobeItems corresponding to the category of the newItem.
      const itemArray: WardrobeItem[] | undefined = this.inventory.get(newItem.category);
      if (itemArray !== undefined) {
        itemArray.push(newItem);
      }
      throw new Error('Item category not found');
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
