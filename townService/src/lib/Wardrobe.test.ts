import Wardrobe from './Wardrobe';
import { DEFAULT_ITEMS } from './WardrobeItem';
import { WardrobeItem } from '../types/CoveyTownSocket';

describe('Wardrobe', () => {
  // A valid Wardrobe and WardrobeItem(s) to be reused within the tests
  let testWardrobe: Wardrobe;
  let testHair: WardrobeItem;
  let testSkin: WardrobeItem;
  let testClothing: WardrobeItem;
  let testAccessory: WardrobeItem;
  let testEyes: WardrobeItem;
  let unaddedHair: WardrobeItem;
  let unaddedSkin: WardrobeItem;
  let unaddedClothing: WardrobeItem;
  let unaddedAccessory: WardrobeItem;
  let unaddedEyes: WardrobeItem;
  // Mock listeners for each of the WardrobeEvents, will be added to the testArea
  // const mockListeners = mock<ViewingAreaEvents>();
  beforeEach(() => {
    // the other name needs to be changed later
    testHair = {
      name: 'other hair',
      category: 'hair',
      spriteLocation: '',
    };
    testSkin = {
      name: '2',
      category: 'skin',
      spriteLocation: '',
    };
    testClothing = {
      name: 'other clothing',
      category: 'clothing',
      spriteLocation: '',
    };
    testAccessory = {
      name: 'other accessory',
      category: 'accessory',
      spriteLocation: '',
    };
    testEyes = {
      name: 'other eyes',
      category: 'eyes',
      spriteLocation: '',
    };
    unaddedHair = {
      name: 'unadded hair',
      category: 'hair',
      spriteLocation: '',
    };
    unaddedSkin = {
      name: 'unadded skin',
      category: 'skin',
      spriteLocation: '',
    };
    unaddedClothing = {
      name: 'unadded clothing',
      category: 'clothing',
      spriteLocation: '',
    };
    unaddedAccessory = {
      name: 'unadded accessory',
      category: 'accessory',
      spriteLocation: '',
    };
    unaddedEyes = {
      name: 'unadded eyes',
      category: 'eyes',
      spriteLocation: '',
    };
    testWardrobe = new Wardrobe();
    // Add test items to wardrobe.
    testWardrobe.addWardrobeItem(testHair);
    testWardrobe.addWardrobeItem(testSkin);
    testWardrobe.addWardrobeItem(testClothing);
    testWardrobe.addWardrobeItem(testAccessory);
    testWardrobe.addWardrobeItem(testEyes);
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
        testWardrobe.currentSkin = testEyes;
      }).toThrowError();
    });
  });
  describe('currentEyes', () => {
    it('gets the current eyes', () => {
      const testCurrentEyes = testWardrobe.currentEyes;
      expect(testWardrobe.currentEyes).toEqual(testCurrentEyes);
    });
    it('sets the current eye color to a different eye color', () => {
      testWardrobe.currentEyes = testEyes;
      expect(testWardrobe.currentEyes).toEqual(testEyes);
    });
    it('Throws an error if the eye color to add is not in the wardrobe.', () => {
      expect(() => {
        testWardrobe.currentEyes = unaddedEyes;
      }).toThrowError();
    });
    it('Throws an error if the item is not of the right category', () => {
      expect(() => {
        testWardrobe.currentEyes = testSkin;
      }).toThrowError();
    });
  });

  describe('currentHair', () => {
    it('gets the current hair', () => {
      const testCurrentHair = testWardrobe.currentHair;
      expect(testWardrobe.currentHair).toEqual(testCurrentHair);
    });
    it('sets the currenct hair to a different hair color', () => {
      testWardrobe.currentHair = testHair;
      expect(testWardrobe.currentHair).toEqual(testHair);
    });
    it('Throws an error if the hair to add is not in the wardrobe.', () => {
      expect(() => {
        testWardrobe.currentHair = unaddedHair;
      }).toThrowError();
    });
    it('Throws an error if the item is not of the right category', () => {
      expect(() => {
        testWardrobe.currentHair = testSkin;
      }).toThrowError();
    });
  });
  describe('currentClothing', () => {
    it('gets the current clothing', () => {
      const testCurrentClothing = testWardrobe.currentClothing;
      expect(testWardrobe.currentClothing).toEqual(testCurrentClothing);
    });
    it('sets the currenct clothing to a different piece of clothing', () => {
      testWardrobe.currentClothing = testClothing;
      expect(testWardrobe.currentClothing).toEqual(testClothing);
    });
    it('Throws an error if the clothing to add is not in the wardrobe.', () => {
      expect(() => {
        testWardrobe.currentClothing = unaddedClothing;
      }).toThrowError();
    });
    it('Throws an error if the item is not of the right category', () => {
      expect(() => {
        testWardrobe.currentClothing = testSkin;
      }).toThrowError();
    });
  });

  describe('currentAccessory', () => {
    it('gets the current accessory', () => {
      const testCurrentAccessory = testWardrobe.currentAccessory;
      expect(testWardrobe.currentAccessory).toEqual(testCurrentAccessory);
    });
    it('sets the currenct accessory to a different accessory', () => {
      testWardrobe.currentAccessory = testAccessory;
      expect(testWardrobe.currentAccessory).toEqual(testAccessory);
    });
    it('Throws an error if the accessory to add is not in the wardrobe.', () => {
      expect(() => {
        testWardrobe.currentAccessory = unaddedAccessory;
      }).toThrowError();
    });
    it('Throws an error if the item is not of the right category', () => {
      expect(() => {
        testWardrobe.currentAccessory = testSkin;
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
      expect(testWardrobe.addWardrobeItem(unaddedHair)).toBe(true);
      expect(testWardrobe.inventory.get('hair')?.includes(unaddedHair)).toBe(true);
      // Trying to add again should return false.
      expect(testWardrobe.addWardrobeItem(unaddedHair)).toBe(false);
    });
    it('returns true and adds new clothing, and cannot be added twice', () => {
      expect(testWardrobe.addWardrobeItem(unaddedClothing)).toBe(true);
      expect(testWardrobe.inventory.get('clothing')?.includes(unaddedClothing)).toBe(true);
      // Trying to add again should return false.
      expect(testWardrobe.addWardrobeItem(unaddedClothing)).toBe(false);
    });
    it('returns true and adds new eyes, and cannot be added twice', () => {
      expect(testWardrobe.addWardrobeItem(unaddedEyes)).toBe(true);
      expect(testWardrobe.inventory.get('eyes')?.includes(unaddedEyes)).toBe(true);
      // Trying to add again should return false.
      expect(testWardrobe.addWardrobeItem(unaddedEyes)).toBe(false);
    });
    it('returns true and adds new accessory, and cannot be added twice', () => {
      expect(testWardrobe.addWardrobeItem(unaddedAccessory)).toBe(true);
      expect(testWardrobe.inventory.get('accessory')?.includes(unaddedAccessory)).toBe(true);
      // Trying to add again should return false.
      expect(testWardrobe.addWardrobeItem(unaddedAccessory)).toBe(false);
    });
  });
});
