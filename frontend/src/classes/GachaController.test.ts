import { mock, mockClear } from 'jest-mock-extended';
import { nanoid } from 'nanoid';
import {
  GachaPicker as GachaModel,
  PlayerLocation,
  WardrobeItem,
  WardrobeModel,
} from '../types/CoveyTownSocket';
import GachaController, { GachaEvents } from './GachaController';
import PlayerController, { PlayerEvents } from './PlayerController';

describe('Testing GachaPicker Controller', () => {
  let misa: WardrobeItem;
  let ness: WardrobeItem;
  let keqing: WardrobeItem;

  let testPlayer: PlayerController;

  let emptyPool: WardrobeItem[];
  let nessPool: WardrobeItem[];
  let allPool: WardrobeItem[];

  let gachaEmptyFreeNoRefund: GachaController;
  let gachaNessFreeNoRefund: GachaController;
  let gachaNessCostTenTenPercent: GachaController;
  let gachaAllCostTenTenPercent: GachaController;

  const mockListeners = mock<GachaEvents>();
  const mockPlayerListeners = mock<PlayerEvents>();
  beforeEach(() => {
    misa = {
      id: 'misa',
      name: 'Misa',
      category: 'skin',
    };
    ness = {
      id: 'ness',
      name: 'Ness',
      category: 'skin',
    };
    keqing = {
      id: 'keqing',
      name: 'Keqing',
      category: 'skin',
    };

    const testLocation: PlayerLocation = {
      x: 0,
      y: 0,
      rotation: 'left',
      moving: false,
    };
    const testWardrobe: WardrobeModel = {
      currency: 0,
      currentSkin: {
        id: '',
        name: '',
        category: 'skin',
      },
      currentOutfit: {
        id: '',
        name: '',
        category: 'skin',
      },
      inventory: [],
    };
    emptyPool = [];
    nessPool = [ness];
    allPool = [misa, ness, keqing];

    testPlayer = new PlayerController(nanoid(), 'test', testLocation, testWardrobe);
    gachaEmptyFreeNoRefund = new GachaController(emptyPool, 0, 0, nanoid());
    gachaNessFreeNoRefund = new GachaController(nessPool, 0, 0, nanoid());
    gachaNessCostTenTenPercent = new GachaController(nessPool, 10, 0.1, nanoid());
    gachaAllCostTenTenPercent = new GachaController(allPool, 10, 0.1, nanoid());

    mockClear(mockListeners.gachaUpdate);
    gachaEmptyFreeNoRefund.addListener('gachaUpdate', mockListeners.gachaUpdate);
    gachaAllCostTenTenPercent.addListener('gachaUpdate', mockListeners.gachaUpdate);
    gachaNessCostTenTenPercent.addListener('gachaUpdate', mockListeners.gachaUpdate);
    gachaNessFreeNoRefund.addListener('gachaUpdate', mockListeners.gachaUpdate);

    mockClear(mockPlayerListeners.wardrobeChange);
    testPlayer.addListener('wardrobeChange', mockPlayerListeners.wardrobeChange);
  });
  describe('Test getters and setters', () => {
    it('Gets the itemPool for an empty pool', () => {
      expect(gachaEmptyFreeNoRefund.itemPool.length).toEqual(emptyPool.length);
      expect(gachaEmptyFreeNoRefund.itemPool).toEqual(emptyPool);
    });
    it('Gets the itemPool for a non-empty pool', () => {
      expect(gachaAllCostTenTenPercent.itemPool.length).toEqual(allPool.length);
      expect(gachaAllCostTenTenPercent.itemPool.includes(allPool[0])).toBe(true);
      expect(gachaAllCostTenTenPercent.itemPool.includes(allPool[1])).toBe(true);
      expect(gachaAllCostTenTenPercent.itemPool.includes(allPool[2])).toBe(true);
    });
    it('Sets the itemPool to empty and emits an update', () => {
      expect(gachaAllCostTenTenPercent.itemPool.length).toEqual(allPool.length);
      gachaAllCostTenTenPercent.itemPool = emptyPool;
      expect(gachaAllCostTenTenPercent.itemPool.length).toEqual(emptyPool.length);

      expect(mockListeners.gachaUpdate).toHaveBeenCalledWith(
        gachaAllCostTenTenPercent.toGachaModel(),
      );
    });
    it('Sets the itemPool to non-empty and emits an update', () => {
      expect(gachaEmptyFreeNoRefund.itemPool.length).toEqual(emptyPool.length);
      gachaEmptyFreeNoRefund.itemPool = allPool;
      expect(gachaEmptyFreeNoRefund.itemPool.length).toEqual(allPool.length);
      gachaEmptyFreeNoRefund.itemPool = nessPool;
      expect(gachaEmptyFreeNoRefund.itemPool.length).toEqual(nessPool.length);

      expect(mockListeners.gachaUpdate).toHaveBeenCalledWith(gachaEmptyFreeNoRefund.toGachaModel());
    });
    it('Gets the pullCost', () => {
      expect(gachaEmptyFreeNoRefund.pullCost).toEqual(0);
      expect(gachaAllCostTenTenPercent.pullCost).toEqual(10);
    });
    it('Sets the pullCost', () => {
      expect(gachaEmptyFreeNoRefund.pullCost).toEqual(0);
      gachaEmptyFreeNoRefund.pullCost = 5;
      expect(gachaEmptyFreeNoRefund.pullCost).toEqual(5);
      gachaEmptyFreeNoRefund.pullCost = 15;
      expect(gachaEmptyFreeNoRefund.pullCost).toEqual(15);

      expect(gachaAllCostTenTenPercent.pullCost).toEqual(10);
      gachaAllCostTenTenPercent.pullCost = 0;
      expect(gachaAllCostTenTenPercent.pullCost).toEqual(0);
    });
    it('Gets the refundPercent', () => {
      expect(gachaEmptyFreeNoRefund.refundPercent).toEqual(0);
      expect(gachaAllCostTenTenPercent.refundPercent).toEqual(0.1);
    });
    it('Sets the refundPercent', () => {
      expect(gachaEmptyFreeNoRefund.refundPercent).toEqual(0);
      gachaEmptyFreeNoRefund.refundPercent = 0.7;
      expect(gachaEmptyFreeNoRefund.refundPercent).toEqual(0.7);
      gachaEmptyFreeNoRefund.refundPercent = 0.2;
      expect(gachaEmptyFreeNoRefund.refundPercent).toEqual(0.2);

      expect(gachaAllCostTenTenPercent.refundPercent).toEqual(0.1);
      gachaAllCostTenTenPercent.refundPercent = 0;
      expect(gachaAllCostTenTenPercent.refundPercent).toEqual(0);
    });
    it('Gets the id', () => {
      const id = nanoid();
      const testGacha = new GachaController(emptyPool, 0, 0, id);
      expect(testGacha.id).toEqual(id);
    });
  });
  describe('Test pull functionality', () => {
    it('Returns an item and a wardrobe that contains it and emits a wardrobe update', () => {
      expect(testPlayer.wardrobe.inventory.includes(ness)).toBe(false);

      const result = gachaNessFreeNoRefund.pull(testPlayer);

      expect(result.item).toEqual(ness);
      expect(result.wardrobe.inventory.includes(ness)).toBe(true);

      expect(mockPlayerListeners.wardrobeChange).toHaveBeenCalledWith(result.wardrobe);
    });
    it('Throws an error when pulling from an empty pool', () => {
      expect(() => gachaEmptyFreeNoRefund.pull(testPlayer)).toThrowError();
    });
    it('Subtracts currency on a unique pull', () => {
      const startingCurrency = 20;
      testPlayer.wardrobe.currency = startingCurrency;
      expect(testPlayer.wardrobe.inventory.includes(ness)).toBe(false);

      const result = gachaAllCostTenTenPercent.pull(testPlayer);

      expect(result.wardrobe.currency).toEqual(
        startingCurrency - gachaAllCostTenTenPercent.pullCost,
      );
      expect(testPlayer.wardrobe.currency).toEqual(
        startingCurrency - gachaAllCostTenTenPercent.pullCost,
      );
    });
    it('Refunds currency on a duplicate draw', () => {
      const startingCurrency = 20;
      testPlayer.wardrobe.currency = startingCurrency;
      expect(testPlayer.wardrobe.inventory.includes(ness)).toBe(false);

      const result = gachaNessCostTenTenPercent.pull(testPlayer);

      expect(result.wardrobe.currency).toEqual(
        startingCurrency - gachaNessCostTenTenPercent.pullCost,
      );
      expect(result.wardrobe.inventory.includes(ness)).toBe(true);

      const sameResult = gachaNessCostTenTenPercent.pull(testPlayer);
      expect(sameResult.wardrobe.currency).toEqual(
        startingCurrency -
          gachaNessCostTenTenPercent.pullCost * 2 +
          gachaNessCostTenTenPercent.pullCost * gachaNessCostTenTenPercent.refundPercent,
      );
      expect(sameResult.wardrobe.inventory.includes(ness)).toBe(true);
    });
  });
  describe('Test GachaModel functionality', () => {
    it('Creates a GachaController from a GachaModel', () => {
      const model: GachaModel = {
        itemPool: emptyPool,
        pullCost: 0,
        refundPercent: 0,
        id: nanoid(),
      };
      const testController = GachaController.fromGachaModel(model);

      expect(testController.itemPool.length).toEqual(model.itemPool.length);
      expect(testController.pullCost).toEqual(model.pullCost);
      expect(testController.refundPercent).toEqual(model.refundPercent);
      expect(testController.id).toEqual(model.id);

      const model2: GachaModel = {
        itemPool: allPool,
        pullCost: 10,
        refundPercent: 0.5,
        id: nanoid(),
      };
      const testController2 = GachaController.fromGachaModel(model2);

      expect(testController2.itemPool).toEqual(model2.itemPool);
      expect(testController2.pullCost).toEqual(model2.pullCost);
      expect(testController2.refundPercent).toEqual(model2.refundPercent);
      expect(testController2.id).toEqual(model2.id);
    });
    it('Creates a GachaModel that matches this GachaController', () => {
      const model: GachaModel = gachaEmptyFreeNoRefund.toGachaModel();

      expect(gachaEmptyFreeNoRefund.itemPool).toEqual(model.itemPool);
      expect(gachaEmptyFreeNoRefund.pullCost).toEqual(model.pullCost);
      expect(gachaEmptyFreeNoRefund.refundPercent).toEqual(model.refundPercent);
      expect(gachaEmptyFreeNoRefund.id).toEqual(model.id);

      const model2: GachaModel = gachaAllCostTenTenPercent.toGachaModel();

      expect(gachaAllCostTenTenPercent.itemPool.length).toEqual(model2.itemPool.length);
      expect(gachaAllCostTenTenPercent.pullCost).toEqual(model2.pullCost);
      expect(gachaAllCostTenTenPercent.refundPercent).toEqual(model2.refundPercent);
      expect(gachaAllCostTenTenPercent.id).toEqual(model2.id);
    });
  });
});
