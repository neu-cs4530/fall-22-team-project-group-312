import { Player, WardrobeItem } from '../types/CoveyTownSocket';
import GachaPicker from './GachaPicker';

describe('Gacha System tests', () => {
  beforeEach(() => {
    const testPlayer: Player = {
      location: undefined,
      _id: '',
      _userName: '',
      _sessionToken: '',
      townEmitter: undefined,
      _wardrobe: {},
      userName: '',
      id: '',
      videoToken: undefined,
      sessionToken: '',
      wardrobe: {},
    };
  });
  describe('Test item obtainability', () => {
    it('Produces nothing if the pull pool is empty');
    it('Produces an item from the pool', () => {
      const misa: WardrobeItem = {
        name: 'misa',
        category: 'outfit',
        spriteLocation: 'misa',
      };
      const ness: WardrobeItem = {
        name: 'ness',
        category: 'outfit',
        spriteLocation: 'ness',
      };
      const keqing: WardrobeItem = {
        name: 'keqing',
        category: 'outfit',
        spriteLocation: 'keqing',
      };
      const bday: WardrobeItem = {
        name: 'Birthday Suit',
        category: 'outfit',
        spriteLocation: 'bday',
      };
      const xiaohei: WardrobeItem = {
        name: 'Cat Boy',
        category: 'outfit',
        spriteLocation: 'xiaohei',
      };
      const pullableTestItemPool: WardrobeItem[] = [misa, ness, keqing, bday, xiaohei];

      const gachapon: GachaPicker = new GachaPicker(pullableTestItemPool);
    });
    it('Is able to produce duplicate items on consecutive pulls');
  });
  describe('Test interaction with Player inventory', () => {
    it('Costs players CoveyCoins per pull');
    it('Does not allow a Player with insufficient funds to pull');
    it('Adds new items to the player inventory');
    it('Does not change clothing in the inventory on duplicate pulls');
    it('Partially refund players for duplicate pulls');
  });
});

// test cases:
/**
 * - shouldn't be able to pull anything from an empty pool
 * - should be able to pull an item from a non-empty pool
 * - pulling an item should decrease currency
 * - should be able to pull duplicate items in the same pull
 * - should be able to pull the same item twice in two consecutive pulls
 * - should add new items to the player's inventory/wardrobe
 * - duplicate items should not affect the player's inventory
 * - should partially refund players when they get duplicates
 */
