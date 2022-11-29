import { mock, mockClear } from 'jest-mock-extended';
import { nanoid } from 'nanoid';
import Wardrobe from '../../../townService/src/lib/Wardrobe';
import { PlayerLocation, WardrobeItem } from '../types/CoveyTownSocket';
import PlayerController, { PlayerEvents } from './PlayerController';

describe('PlayerController', () => {
  // Create a listener for the movement event
  let testPlayer: PlayerController;
  const mockListeners = mock<PlayerEvents>();
  let testOutfit: WardrobeItem;
  beforeEach(() => {
    const playerLocation: PlayerLocation = {
      moving: false,
      x: 0,
      y: 0,
      rotation: 'front',
    };
    const playerWardrobe = new Wardrobe();
    testPlayer = new PlayerController(nanoid(), nanoid(), playerLocation, playerWardrobe);
    mockClear(mockListeners.wardrobeChange);
    testPlayer.addListener('wardrobeChange', mockListeners.wardrobeChange);
    testOutfit = {
      id: 'testoutfit',
      name: 'test outfit',
      category: 'outfit',
      rarity: 'common',
    };
  });

  describe('Wardrobe', () => {
    it('Checks that the wardrobe is set and the movement event is properly emitted', () => {
      // Create a new wardrobe.
      const newWardrobe = new Wardrobe();
      newWardrobe.addWardrobeItem(testOutfit);
      // Set the wardrobe
      testPlayer.wardrobe = newWardrobe;
      expect(testPlayer.wardrobe).toEqual(newWardrobe);
      // Wardrobe listener should be called
      expect(mockListeners.wardrobeChange).toHaveBeenCalledWith(testPlayer.wardrobe);
    });
    it('Checks that changing the wardrobe to one with new set clothing changes the player sprite', () => {
      const newWardrobe = new Wardrobe();
      newWardrobe.addWardrobeItem(testOutfit);
      newWardrobe.currentOutfit = testOutfit;
      testPlayer.wardrobe = newWardrobe;
      // The setter should have now updated the sprite key of the player sprite
      expect(testPlayer.wardrobe.currentOutfit.id).toEqual('testoutfit');
    });
  });
});
