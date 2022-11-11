/**
 * Represents the location of a WardrobeItem on the player's body.
 */
export type ItemCategory = 'skin' | 'eyes' | 'hair' | 'clothing' | 'accessory';

/**
 * Represents a single item in a Wardrobe, either a skin color, eye color, hairstyle, clothing, or accessory.
 */
export default class WardrobeItem {
  /** The name of the WardrobeItem */
  private readonly _name: string;

  /** The category of the item. */
  private readonly _category: ItemCategory;

  /** A string representing the location of the WardrobeItem sprite in the source code. */
  private readonly _spriteLocation: string;

  constructor(name: string, category: ItemCategory, spriteLocation: string) {
    this._name = name;
    this._category = category;
    this._spriteLocation = spriteLocation;
  }

  // Returns the name of the WardrobeItem.
  get name(): string {
    return this._name;
  }

  // Returns the category of the WardrobeItem.
  get category(): ItemCategory {
    return this._category;
  }

  // Returns the sprite file location of the WardrobeItem.
  get spriteLocation(): string {
    return this._spriteLocation;
  }
}
