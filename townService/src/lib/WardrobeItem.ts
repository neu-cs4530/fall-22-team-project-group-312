import { Rarity, WardrobeItem } from '../types/CoveyTownSocket';

// Represents the default items every player has in their wardrobe upon initialization.
export const DEFAULT_ITEMS: WardrobeItem[] = [
  { name: 'default outfit', category: 'outfit', spriteLocation: '', rarity: 'common' },
  { name: '0', category: 'skin', spriteLocation: '', rarity: 'common' },
  { name: '1', category: 'skin', spriteLocation: '', rarity: 'common' },
  { name: '2', category: 'skin', spriteLocation: '', rarity: 'common' },
  { name: '3', category: 'skin', spriteLocation: '', rarity: 'common' },
  { name: '4', category: 'skin', spriteLocation: '', rarity: 'common' },
];

// Represents all other items players can unlock.
export const UNLOCKABLE_ITEMS: WardrobeItem[] = [
  { name: 'birthday suit', category: 'outfit', spriteLocation: '', rarity: 'ultraRare' },
];
