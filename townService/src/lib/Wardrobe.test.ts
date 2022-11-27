import Wardrobe from './Wardrobe';
import { DEFAULT_ITEMS } from './WardrobeItem';
import { WardrobeItem } from '../types/CoveyTownSocket';

describe('Wardrobe', () => {
  // A valid Wardrobe and WardrobeItem(s) to be reused within the tests
  let testWardrobe: Wardrobe;
  let testSkin: WardrobeItem;
  let testOutfit: WardrobeItem;
  let unaddedSkin: WardrobeItem;
  let unaddedOutfit: WardrobeItem;
  // Mock listeners for each of the WardrobeEvents, will be added to the testArea
  // const mockListeners = mock<ViewingAreaEvents>();
  beforeEach(() => {
    // the other name needs to be changed later
    testSkin = {
      id: '2',
      name: '2',
      category: 'skin',
    };
    testOutfit = {
      id: 'other',
      name: 'other clothing',
      category: 'outfit',
    };
    unaddedSkin = {
      id: 'unaddedskin',
      name: 'unadded skin',
      category: 'skin',
    };
    unaddedOutfit = {
      id: 'unaddedoutfit',
      name: 'unadded outfit',
      category: 'outfit',
    };
    testWardrobe = new Wardrobe();
    // Add test items to wardrobe.
    testWardrobe.addWardrobeItem(testSkin);
    testWardrobe.addWardrobeItem(testOutfit);
  });

  describe('constructor', () => {
    it('Ensures default items have been properly added', () => {
      DEFAULT_ITEMS.forEach(item => expect(testWardrobe.addWardrobeItem(item)).toBe(false));
      // Tests all 6 default items and 2 test items have been added
      expect(testWardrobe.inventory.length).toEqual(8);
    });
    it('Ensures a current skin and current outfit are set', () => {
      expect(testWardrobe.currentSkin).not.toBe(undefined);
      expect(testWardrobe.currentOutfit).not.toBe(undefined);
      expect(testWardrobe.currentSkin.id).toEqual('skin1');
      expect(testWardrobe.currentOutfit.id).toEqual('misa');
    });
  });

  describe('currency', () => {
    it('gets the currency', () => {
      // Expect initial currency to be 0.
      expect(testWardrobe.currency).toEqual(0);
    });
    it('sets the currency to number', () => {
      testWardrobe.currency = 20;
      expect(testWardrobe.currency).toEqual(20);
    });
    it('Throws an error if currency is set to a negative value', () => {
      expect(() => {
        testWardrobe.currency = -20;
      }).toThrowError();
    });
  });

  describe('currentSkin', () => {
    it('gets the current Skin', () => {
      const testCurrentSkin = testWardrobe.currentSkin;
      expect(testWardrobe.currentSkin).toEqual(testCurrentSkin);
    });
    it('sets the current skin to something in the Wardrobe', () => {
      testWardrobe.currentSkin = testSkin;
      expect(testWardrobe.currentSkin).toEqual(testSkin);
    });
    it('Throws an error if the skin to add is not in the wardrobe.', () => {
      expect(() => {
        testWardrobe.currentSkin = unaddedSkin;
      }).toThrowError();
    });
    it('Throws an error if the item is not of the right category', () => {
      expect(() => {
        testWardrobe.currentSkin = testOutfit;
      }).toThrowError();
    });
  });
  describe('currentOutfit', () => {
    it('gets the current outfit', () => {
      const testCurrentOutfit = testWardrobe.currentOutfit;
      expect(testWardrobe.currentOutfit).toEqual(testCurrentOutfit);
    });
    it('sets the current eye color to a different eye color', () => {
      testWardrobe.currentOutfit = testOutfit;
      expect(testWardrobe.currentOutfit).toEqual(testOutfit);
    });
    it('Throws an error if the eye color to add is not in the wardrobe.', () => {
      expect(() => {
        testWardrobe.currentOutfit = unaddedOutfit;
      }).toThrowError();
    });
    it('Throws an error if the item is not of the right category', () => {
      expect(() => {
        testWardrobe.currentOutfit = testSkin;
      }).toThrowError();
    });
  });

  describe('inventory', () => {
    it('gets the inventory', () => {
      const testCurrentInventory = testWardrobe.inventory;
      expect(testWardrobe.inventory).toEqual(testCurrentInventory);
    });
  });

  describe('addWardrobeItem', () => {
    it('returns false if item to add is already in the inventory', () => {
      expect(testWardrobe.addWardrobeItem(testSkin)).toBe(false);
    });
    it('returns true and adds new skin, and cannot be added twice', () => {
      expect(testWardrobe.addWardrobeItem(unaddedSkin)).toBe(true);
      expect(testWardrobe.inventory.includes(unaddedSkin)).toBe(true);
      // Length of inventory changes
      expect(testWardrobe.inventory.length).toEqual(9);
      // Trying to add again should return false.
      expect(testWardrobe.addWardrobeItem(unaddedSkin)).toBe(false);
    });
    it('returns true and adds new hair, and cannot be added twice', () => {
      expect(testWardrobe.addWardrobeItem(unaddedOutfit)).toBe(true);
      expect(testWardrobe.inventory.includes(unaddedOutfit)).toBe(true);
      // Length of inventory changes
      expect(testWardrobe.inventory.length).toEqual(9);
      // Trying to add again should return false.
      expect(testWardrobe.addWardrobeItem(unaddedOutfit)).toBe(false);
    });
  });

  describe('exportWardrobe', () => {
    it('returns the correct item with no unlocked items', () => {
      expect(new Wardrobe().exportWardrobe()).toEqual(
        '{"currency":0,' +
          '"currentSkin":{"name":"0","category":"skin","spriteLocation":""},' +
          '"currentOutfit":{"name":"defualt outfit","category":"outfit","spriteLocation":""},' +
          '"inventory":[' +
          '{"name":"defualt outfit","category":"outfit","spriteLocation":""}]' +
          '}',
      );
    });
  });
});
