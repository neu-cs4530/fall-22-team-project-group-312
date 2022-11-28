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
      expect(testPlayer.wardrobe.inventory.get('outfit')?.length).toBe(1);
      // expect(testPlayer.wardrobe.inventory.get('outfit')).toEqual([]);
      expect(testPlayer.wardrobe.inventory.get('outfit')?.includes(ness)).toBe(false);
      gachapon.addItemToPool(ness);
      gachapon.pull(testPlayer);

      expect(testPlayer.wardrobe.inventory.get('outfit')?.length).toBe(2);
      expect(testPlayer.wardrobe.inventory.get('outfit')?.includes(misa)).toBe(true);
      // expect(testPlayer.wardrobe.inventory.get('outfit')).toEqual([]);
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
      expect(testPlayer.wardrobe.currency).toEqual(oldBalance - 5);
    });
    it('Does not allow a Player with insufficient funds to pull', () => {
      const gachapon: GachaPicker = new GachaPicker(nessPool, fiveCoins, 0);
      testPlayer.wardrobe.currency = 0;
      const oldBalance = testPlayer.wardrobe.currency;
      expect(testPlayer.wardrobe.inventory.get('outfit')?.includes(ness)).toBe(false);

      gachapon.pull(testPlayer);
      expect(testPlayer.wardrobe.currency).toEqual(oldBalance);
      expect(testPlayer.wardrobe.inventory.get('outfit')?.includes(ness)).toBe(false);
    });
    // it('Adds new items to the player inventory', () => {
    //   const gachapon: GachaPicker = new GachaPicker(nessPool, free, 0);
    //   testPlayer.wardrobe.currency = 10;
    //   expect(testPlayer.wardrobe.inventory.get('outfit')?.includes(ness)).toBe(false);
    //   const originalOutfits: WardrobeItem[] = testPlayer.wardrobe.inventory.get('outfit');

    //   gachapon.pull(testPlayer);

    //   expect(testPlayer.wardrobe.inventory.get('outfit')?.includes(ness)).toBe(true);
    //   expect(testPlayer.wardrobe.inventory.get('outfit')?.length).toEqual(
    //     originalOutfits.length + 1,
    //   );
    // });
    // it('Does not change clothing in the inventory on duplicate pulls', () => {
    //   const gachapon: GachaPicker = new GachaPicker(nessPool, free, 0);
    //   testPlayer.wardrobe.currency = 10;
    //   expect(testPlayer.wardrobe.inventory.get('outfit')?.includes(ness)).toBe(false);
    //   const originalOutfits: WardrobeItem[] =
    //     testPlayer.wardrobe.inventory.get('outfit') === undefined
    //       ? []
    //       : testPlayer.wardrobe.inventory.get('outfit');

    //   gachapon.pull(testPlayer);
    //   expect(testPlayer.wardrobe.inventory.get('outfit')?.includes(ness)).toBe(true);
    //   expect(testPlayer.wardrobe.inventory.get('outfit')?.length).toEqual(
    //     originalOutfits.length + 1,
    //   );

    //   gachapon.pull(testPlayer);
    //   expect(testPlayer.wardrobe.inventory.get('outfit')?.includes(ness)).toBe(true);
    //   expect(testPlayer.wardrobe.inventory.get('outfit')?.length).toEqual(
    //     originalOutfits.length + 1,
    //   );
    // });
    it('Refunds players for duplicate pulls', () => {
      const testCost = 10;
      const testRefund = 0.1;
      const gachapon: GachaPicker = new GachaPicker(nessPool, testCost, testRefund);
      testPlayer.wardrobe.currency = testCost * 3;
      const startingBalance = testPlayer.wardrobe.currency;
      gachapon.pull(testPlayer);
      const balanceAfterFirstPull = testPlayer.wardrobe.currency;
      gachapon.pull(testPlayer);
      const balanceAfterSecondPull = balanceAfterFirstPull - testCost;
      const balanceAfterRefund = testPlayer.wardrobe.currency;

      expect(balanceAfterFirstPull).toEqual(startingBalance - testCost);
      expect(balanceAfterRefund).toEqual(balanceAfterSecondPull + testCost * testRefund);
    });
    // it('Emits a message on a successful pull');
  });
});
