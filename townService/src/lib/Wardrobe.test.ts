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

  describe('Default Items', () => {
    it('Ensures default items have been properly added', () => {
      DEFAULT_ITEMS.forEach(item => expect(testWardrobe.addWardrobeItem(item)).toBe(false));
    });
  });

  describe('currency', () => {
    it('gets the currency', () => {
      const testCurrency = testWardrobe.currency;
      expect(testWardrobe.currency).toEqual(testCurrency);
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
      expect(testWardrobe.inventory.get('skin')?.includes(unaddedSkin)).toBe(true);
      // Trying to add again should return false.
      expect(testWardrobe.addWardrobeItem(unaddedSkin)).toBe(false);
    });
    it('returns true and adds new hair, and cannot be added twice', () => {
      expect(testWardrobe.addWardrobeItem(unaddedOutfit)).toBe(true);
      expect(testWardrobe.inventory.get('outfit')?.includes(unaddedOutfit)).toBe(true);
      // Trying to add again should return false.
      expect(testWardrobe.addWardrobeItem(unaddedOutfit)).toBe(false);
    });
  });
});
