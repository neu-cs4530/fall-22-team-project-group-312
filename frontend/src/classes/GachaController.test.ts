import { mock, mockClear, MockProxy } from 'jest-mock-extended';

describe('Testing GachaPicker Controller', () => {
  // describe('Test getters and setters');
  describe('Test pull functionality', () => {
    it('Returns an item and a wardrobe that contains it and emits a wardrobe update');
    it('Subtracts currency on a unique pull');
    it('Refunds currency on a duplicate draw');
  });
  describe('Test GachaModel functionality', () => {
    it('Creates a GachaController from a GachaModel');
    it('Creates a GachaModel');
  });
});
