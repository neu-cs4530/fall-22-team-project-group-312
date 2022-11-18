import { WardrobeItem } from '../types/CoveyTownSocket';

// Represents the default items every player has in their wardrobe upon initialization.
export const DEFAULT_ITEMS: WardrobeItem[] = [
  { name: 'defualt outfit', category: 'outfit', spriteLocation: '' },
  { name: '0', category: 'skin', spriteLocation: '' },
  { name: '1', category: 'skin', spriteLocation: '' },
  { name: '2', category: 'skin', spriteLocation: '' },
  { name: '3', category: 'skin', spriteLocation: '' },
  { name: '4', category: 'skin', spriteLocation: '' },
];

// Represents all other items players can unlock.
export const UNLOCKABLE_ITEMS: WardrobeItem[] = [
  { name: 'birthday suit', category: 'outfit', spriteLocation: '' },
];
