import { mock } from 'jest-mock-extended';
import { nanoid } from 'nanoid';
import { ItemCategory, PlayerLocation, TownEmitter, WardrobeItem } from '../types/CoveyTownSocket';
import GachaPicker from './GachaPicker';
import Player from './Player';
import Wardrobe from './Wardrobe';

describe('Gacha System tests', () => {
  let misa: WardrobeItem;
  let ness: WardrobeItem;
  let keqing: WardrobeItem;
  let bday: WardrobeItem;
  let xiaohei: WardrobeItem;
  beforeEach(() => {
    misa = {
      name: 'misa',
      category: 'outfit',
      spriteLocation: 'misa',
      rarity: 'common',
    };
    ness = {
      name: 'ness',
      category: 'outfit',
      spriteLocation: 'ness',
      rarity: 'common',
    };
    keqing = {
      name: 'keqing',
      category: 'outfit',
      spriteLocation: 'keqing',
      rarity: 'rare',
    };
    bday = {
      name: 'Birthday Suit',
      category: 'outfit',
      spriteLocation: 'bday',
      rarity: 'ultraRare',
    };
    xiaohei = {
      name: 'Cat Boy',
      category: 'outfit',
      spriteLocation: 'xiaohei',
      rarity: 'rare',
    };

    const testLocation: PlayerLocation = {
      x: 0,
      y: 0,
      rotation: 'right',
      moving: false
    }
    const testWardrobe = new Wardrobe();

    const testPlayer: Player = new Player(nanoid(), mock<TownEmitter>());
    };
  });
  describe('Test item obtainability', () => {
    it('Produces nothing if the pull pool is empty');
    it('Produces an item from the pool', () => {
      
      const pullableTestItemPool: WardrobeItem[] = [misa, ness, keqing, bday, xiaohei];

      const gachapon: GachaPicker = new GachaPicker(pullableTestItemPool, 10, 0.4);
    });
    it('Is able to produce duplicate items on consecutive pulls');
  });
  describe('Test interaction with Player inventory', () => {
    it('Costs players CoveyCoins per pull');
    it('Does not allow a Player with insufficient funds to pull');
    it('Adds new items to the player inventory');
    it('Does not change clothing in the inventory on duplicate pulls');
    it('Partially refunds players for duplicate pulls');
    it('Emits a message on a successful pull');
    it('Throws an error on a failed pull');
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
