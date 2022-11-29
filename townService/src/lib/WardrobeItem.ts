import { WardrobeItem } from '../types/CoveyTownSocket';

// Represents the default items every player has in their wardrobe upon initialization.
export const DEFAULT_ITEMS: WardrobeItem[] = [
  { id: 'misa', name: 'Default Outfit', category: 'outfit', rarity: 'common' },
  { id: 'skin0', name: 'skin0', category: 'skin', rarity: 'common' },
  { id: 'skin1', name: 'skin1', category: 'skin', rarity: 'common' },
  { id: 'skin2', name: 'skin2', category: 'skin', rarity: 'common' },
  { id: 'skin3', name: 'skin3', category: 'skin', rarity: 'common' },
  { id: 'skin4', name: 'skin4', category: 'skin', rarity: 'common' },
];

// Represents all other items players can unlock.
export const UNLOCKABLE_ITEMS: WardrobeItem[] = [
  { id: 'bday', name: 'Birthday Suit', category: 'outfit', rarity: 'ultraRare' },
  { id: 'keqing', name: 'Keqing', category: 'outfit', rarity: 'rare' },
  { id: 'ness', name: 'Ness', category: 'outfit', rarity: 'common' },
  { id: 'xiaohei', name: 'Catboy', category: 'outfit', rarity: 'common' },
];
