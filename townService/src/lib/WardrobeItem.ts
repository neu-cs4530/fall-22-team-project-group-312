import { WardrobeItem } from '../types/CoveyTownSocket';

// Represents the default items every player has in their wardrobe upon initialization.
export const DEFAULT_ITEMS: WardrobeItem[] = [
  { name: 'default outfit', category: 'outfit', spriteLocation: '', rarity: 0 },
  { name: '0', category: 'skin', spriteLocation: '', rarity: 0 },
  { name: '1', category: 'skin', spriteLocation: '', rarity: 0 },
  { name: '2', category: 'skin', spriteLocation: '', rarity: 0 },
  { name: '3', category: 'skin', spriteLocation: '', rarity: 0 },
  { name: '4', category: 'skin', spriteLocation: '', rarity: 0 },
];

// Represents all other items players can unlock.
export const UNLOCKABLE_ITEMS: WardrobeItem[] = [
  { name: 'birthday suit', category: 'outfit', spriteLocation: '', rarity: 1 },
];
