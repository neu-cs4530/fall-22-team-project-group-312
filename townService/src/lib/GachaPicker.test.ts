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
  let testPlayer: Player;

  const free = 0;
  const fiveCoins = 5;

  let emptyPool: WardrobeItem[];
  let nessPool: WardrobeItem[];
  let nonEmptyPool: WardrobeItem[];
  let allItemsPool: WardrobeItem[];
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
      moving: false,
    };
    const testWardrobe = new Wardrobe();

    testPlayer = new Player(nanoid(), mock<TownEmitter>());
    emptyPool = [];
    nessPool = [ness];
    nonEmptyPool = [misa, ness, keqing];
    allItemsPool = [misa, ness, keqing, bday, xiaohei];
  });

  describe('Test getters', () => {
    it('Gets the pull cost when free', () => {
      const gachapon: GachaPicker = new GachaPicker(emptyPool, free, 0);
      expect(gachapon.pullCost).toBe(0);
    });
    it('Gets the pull cost when not free', () => {
      const gachapon: GachaPicker = new GachaPicker(emptyPool, 10, 0);
      expect(gachapon.pullCost).toBe(10);
    });
    it('Gets an empty item pool', () => {
      const gachapon: GachaPicker = new GachaPicker(emptyPool, free, 0);
      expect(gachapon.itemPool.length).toBe(0);
    });
    it('Gets a non-empty item pool', () => {
      const gachapon: GachaPicker = new GachaPicker(allItemsPool, free, 0);
      expect(gachapon.itemPool.length).toBe(5);
      expect(gachapon.itemPool.includes(misa)).toBe(true);
      expect(gachapon.itemPool.includes(ness)).toBe(true);
      expect(gachapon.itemPool.includes(xiaohei)).toBe(true);
      expect(gachapon.itemPool.includes(keqing)).toBe(true);
      expect(gachapon.itemPool.includes(bday)).toBe(true);
    });
    it('Gets the refund percent when no refund', () => {
      const gachapon: GachaPicker = new GachaPicker(allItemsPool, free, 0);
      expect(gachapon.refundPercent).toBe(0);
    });
    it('Gets the refund percent as a decimal', () => {
      const gachapon: GachaPicker = new GachaPicker(allItemsPool, 10, 0.1);
      expect(gachapon.pullCost).toEqual(0.1);
    });
  });
  describe('Modifying the pool', () => {
    it('Adds a new item to an empty pull pool', () => {
      const gachapon: GachaPicker = new GachaPicker(emptyPool, free, 0);
      expect(gachapon.itemPool.length).toBe(0);
      gachapon.addItemToPool(ness);
      expect(gachapon.itemPool.length).toBe(1);
      expect(gachapon.itemPool).toContain(ness);
    });
    it('Adds a new item to a non-empty pool', () => {
      const gachapon: GachaPicker = new GachaPicker(nonEmptyPool, free, 0);
      expect(gachapon.itemPool.length).toBe(0);
      gachapon.addItemToPool(ness);
      expect(gachapon.itemPool.length).toBe(1);
      expect(gachapon.itemPool).toContain(ness);
    });
    it('Pulling after adding the new item can retrieve the new item', () => {
      const gachapon: GachaPicker = new GachaPicker(emptyPool, free, 0);
      expect(testPlayer.wardrobe.inventory.get('outfit')?.length).toBe(6);
      expect(testPlayer.wardrobe.inventory.get('outfit')?.includes(ness)).toBe(false);
      gachapon.addItemToPool(ness);
      gachapon.pull(testPlayer);
      expect(testPlayer.wardrobe.inventory.get('outfit')?.length).toBe(7);
      expect(testPlayer.wardrobe.inventory.get('outfit')?.includes(ness)).toBe(true);
    });
  });
  describe('Test item obtainability', () => {
    it('Does not change the player wardrobe if the pull pool is empty', () => {
      const testPool: WardrobeItem[] = [];
      const originalOutfits: WardrobeItem[] =
        testPlayer.wardrobe.inventory.get('outfit') === undefined
          ? []
          : testPlayer.wardrobe.inventory.get('outfit');
      const gachapon: GachaPicker = new GachaPicker(testPool, free, 0);
      gachapon.pull(testPlayer);
      expect(testPlayer.wardrobe.inventory.get('outfit')?.length).toBe(originalOutfits.length);
      expect(testPlayer.wardrobe.inventory.get('outfit')).toEqual(originalOutfits);
    });
    // it('Is able to produce duplicate items on consecutive pulls');
  });
  describe('Test interaction with Player inventory', () => {
    it('Can cost nothing');
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
