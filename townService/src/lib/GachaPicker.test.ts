import { mock } from 'jest-mock-extended';
import { nanoid } from 'nanoid';
import { TownEmitter, WardrobeItem } from '../types/CoveyTownSocket';
import GachaPicker from './GachaPicker';
import Player from './Player';

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
      id: 'misa',
      name: 'Default Outfit',
      category: 'outfit',
      rarity: 'common',
    };
    ness = {
      id: 'ness',
      name: 'Ness',
      category: 'outfit',
      rarity: 'common',
    };
    keqing = {
      name: 'Keqing',
      category: 'outfit',
      id: 'keqing',
      rarity: 'rare',
    };
    bday = {
      name: 'Birthday Suit',
      category: 'outfit',
      id: 'bday',
      rarity: 'ultraRare',
    };
    xiaohei = {
      name: 'Cat Boy',
      category: 'outfit',
      id: 'xiaohei',
      rarity: 'rare',
    };

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
      expect(gachapon.refundPercent).toEqual(0.1);
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
      const originalPoolSize = gachapon.itemPool.length;
      gachapon.addItemToPool(ness);
      expect(gachapon.itemPool.length).toBe(originalPoolSize + 1);
      expect(gachapon.itemPool).toContain(ness);
    });
    it('Pulling after adding a new item to the pool can retrieve the new item', () => {
      const gachapon: GachaPicker = new GachaPicker(emptyPool, free, 0);
      const oldInventorySize = testPlayer.wardrobe.inventory.length;

      expect(testPlayer.wardrobe.inventory.includes(ness)).toBe(false);

      gachapon.addItemToPool(ness);
      gachapon.pull(testPlayer);

      expect(testPlayer.wardrobe.inventory.length).toEqual(oldInventorySize + 1);
      expect(testPlayer.wardrobe.inventory.includes(ness)).toBe(true);
    });
  });

  describe('Test item obtainability', () => {
    it('Throws an error if the pull pool is empty', () => {
      const gachapon: GachaPicker = new GachaPicker(emptyPool, free, 0);
      expect(() => gachapon.pull(testPlayer)).toThrowError();
    });
  });

  describe('Test interaction with Player inventory', () => {
    it('Can cost nothing', () => {
      const gachapon: GachaPicker = new GachaPicker(allItemsPool, free, 0);
      testPlayer.wardrobe.currency = 1;
      const oldBalance = testPlayer.wardrobe.currency;
      gachapon.pull(testPlayer);

      expect(testPlayer.wardrobe.currency).toEqual(oldBalance);
    });
    it('Costs players CoveyCoins per pull', () => {
      const gachapon: GachaPicker = new GachaPicker(allItemsPool, fiveCoins, 0);
      testPlayer.wardrobe.currency = fiveCoins + 20;
      const oldBalance = testPlayer.wardrobe.currency;
      gachapon.pull(testPlayer);

      expect(testPlayer.wardrobe.currency).toEqual(oldBalance - fiveCoins);
    });
    it('Does not remove other items in the player inventory', () => {
      const gachapon: GachaPicker = new GachaPicker(nessPool, free, 0);
      const oldInventoryLength = testPlayer.wardrobe.inventory.length;
      const result = gachapon.pull(testPlayer);
      const newInventory = testPlayer.wardrobe.inventory;

      expect(newInventory.length).toEqual(oldInventoryLength + 1);
    });
    it('Adds new items to the player inventory', () => {
      const gachapon: GachaPicker = new GachaPicker(nessPool, free, 0);
      testPlayer.wardrobe.currency = 10;
      expect(testPlayer.wardrobe.inventory.includes(ness)).toBe(false);
      const originalInventoryLength = testPlayer.wardrobe.inventory.length;

      const result = gachapon.pull(testPlayer);

      expect(testPlayer.wardrobe.inventory.includes(result)).toBe(true);
      expect(testPlayer.wardrobe.inventory.length).toEqual(originalInventoryLength + 1);
    });
    it('Does not change clothing in the inventory on duplicate pulls', () => {
      const gachapon: GachaPicker = new GachaPicker(nessPool, free, 0);
      testPlayer.wardrobe.currency = 10;
      const originalInventoryLength = testPlayer.wardrobe.inventory.length;

      const firstPull = gachapon.pull(testPlayer);
      expect(testPlayer.wardrobe.inventory.includes(firstPull)).toBe(true);
      expect(testPlayer.wardrobe.inventory.length).toEqual(originalInventoryLength + 1);

      const secondPull = gachapon.pull(testPlayer);
      expect(testPlayer.wardrobe.inventory.includes(firstPull)).toBe(true);
      expect(testPlayer.wardrobe.inventory.length).toEqual(originalInventoryLength + 1);
    });
    it('Does not refund players on non-duplicate pulls', () => {
      const testCost = 10;
      const testRefund = 0.1;
      const gachapon: GachaPicker = new GachaPicker(nessPool, testCost, testRefund);
      testPlayer.wardrobe.currency = testCost * 3;

      const startingBalance = testPlayer.wardrobe.currency;
      const result = gachapon.pull(testPlayer);

      expect(testPlayer.wardrobe.currency).toEqual(startingBalance - testCost);
    });
    it('Refunds players for duplicate pulls', () => {
      const testCost = 10;
      const testRefund = 0.1;
      const gachapon: GachaPicker = new GachaPicker(nessPool, testCost, testRefund);
      testPlayer.wardrobe.currency = testCost * 3;
      const startingBalance = testPlayer.wardrobe.currency;
      const firstPull = gachapon.pull(testPlayer);

      const balanceAfterFirstPull = testPlayer.wardrobe.currency;
      const secondPull = gachapon.pull(testPlayer);

      expect(balanceAfterFirstPull).toEqual(startingBalance - testCost);

      expect(testPlayer.wardrobe.currency).toEqual(
        balanceAfterFirstPull - testCost + testCost * testRefund,
      );
    });
    // it('Emits a message on a successful pull');
  });
});
