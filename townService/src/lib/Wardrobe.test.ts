import Wardrobe from './Wardrobe';
import { WardrobeItem, ItemCategory, DEFAULT_ITEMS } from './WardrobeItem';

describe('Wardrobe', () => {
  // A valid Wardrobe and WardrobeItem(s) to be reused within the tests
  let testWardrobe: Wardrobe;
  let testHair: WardrobeItem;
  let testSkin: WardrobeItem;
  let testClothing: WardrobeItem;
  let testAccessory: WardrobeItem;
  let testEyes: WardrobeItem;

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
    testWardrobe = new Wardrobe();
  });

  describe('addWardrobeItem', () => {});

  describe('currency', () => {
    it('gets the currency', () => {
      const testCurrency = testWardrobe.currency;
      expect(testWardrobe.currency).toEqual(testCurrency);
    });
    it('sets the currency to number', () => {
      testWardrobe.currency = 20;
      expect(testWardrobe.currency).toEqual(20);
    });
  });

  describe('currentSkin', () => {
    it('gets the current Skin', () => {
      const testCurrentSkin = testWardrobe.currentSkin;
      expect(testWardrobe.currentSkin).toEqual(testCurrentSkin);
    });
    it('sets the currency to number', () => {
      testWardrobe.currentSkin = testSkin;
      expect(testWardrobe.currentSkin).toEqual(testSkin);
    });
  });
  describe('currentEyes', () => {
    it('gets the current eyes', () => {
      const testCurrentEyes = testWardrobe.currentEyes;
      expect(testWardrobe.currentEyes).toEqual(testCurrentEyes);
    });
    it('sets the current eye color to a differnet eye color', () => {
      testWardrobe.currentEyes = testEyes;
      expect(testWardrobe.currentEyes).toEqual(testEyes);
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
  });

  describe('inventory', () => {
    it('gets the current accessory', () => {
      const testCurrentAccessory = testWardrobe.currentAccessory;
      expect(testWardrobe.currentAccessory).toEqual(testCurrentAccessory);
    });
  });
});
