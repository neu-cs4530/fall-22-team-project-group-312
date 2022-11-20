import { WardrobeItem } from '../types/CoveyTownSocket';

// Represents the default items every player has in their wardrobe upon initialization.
export const DEFAULT_ITEMS: WardrobeItem[] = [
  { id: 'misa', name: 'Default Outfit', category: 'outfit' },
  { id: 'skin0', name: 'skin0', category: 'skin' },
  { id: 'skin1', name: 'skin1', category: 'skin' },
  { id: 'skin2', name: 'skin2', category: 'skin' },
  { id: 'skin3', name: 'skin3', category: 'skin' },
  { id: 'skin4', name: 'skin4', category: 'skin' },
];

// Represents all other items players can unlock.
export const UNLOCKABLE_ITEMS: WardrobeItem[] = [
  { id: 'bday', name: 'Birthday Suit', category: 'outfit' },
  { id: 'keqing', name: 'Keqing', category: 'outfit' },
  { id: 'ness', name: 'Ness', category: 'outfit' },
  { id: 'xiaohei', name: 'Catboy', category: 'outfit' },
];
