/**
 * Represents the location of a WardrobeItem on the player's body.
 */
export type ItemCategory = 'skin' | 'eyes' | 'hair' | 'clothing' | 'accessory';

/**
 * Represents a single item in a Wardrobe, either a skin color, eye color, hairstyle, clothing, or accessory.
 */
export type WardrobeItem = {
  name: string;
  category: ItemCategory;
  spriteLocation: string;
};

const DEFAULT_ITEMS: WardrobeItem[] = [
  { name: 'defualt hair', category: 'hair', spriteLocation: '' },
  { name: 'defualt eyes', category: 'eyes', spriteLocation: '' },
  { name: 'defualt clothing', category: 'clothing', spriteLocation: '' },
  { name: 'no accessory', category: 'accessory', spriteLocation: '' },
  { name: '0', category: 'skin', spriteLocation: '' },
  { name: '1', category: 'skin', spriteLocation: '' },
  { name: '2', category: 'skin', spriteLocation: '' },
  { name: '3', category: 'skin', spriteLocation: '' },
  { name: '4', category: 'skin', spriteLocation: '' },
];

const UNLOCKABLE_ITEMS: WardrobeItem[] = [
  { name: 'bald', category: 'hair', spriteLocation: '' },
  { name: 'keqing', category: 'hair', spriteLocation: '' },
];
