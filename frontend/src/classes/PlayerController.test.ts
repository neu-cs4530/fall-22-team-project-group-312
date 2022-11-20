import { mock, mockClear } from 'jest-mock-extended';
import { nanoid } from 'nanoid';
import Wardrobe from '../../../townService/src/lib/Wardrobe';
import { PlayerLocation, WardrobeItem } from '../types/CoveyTownSocket';
import PlayerController, { PlayerEvents } from './PlayerController';

describe('PlayerController', () => {
  // Create a listener for the movement event
  let testPlayer: PlayerController;
  const mockListeners = mock<PlayerEvents>();
  beforeEach(() => {
    const playerLocation: PlayerLocation = {
      moving: false,
      x: 0,
      y: 0,
      rotation: 'front',
    };
    const playerWardrobe = new Wardrobe();
    testPlayer = new PlayerController(nanoid(), nanoid(), playerLocation, playerWardrobe);
    mockClear(mockListeners.movement);
    testPlayer.addListener('movement', mockListeners.movement);
  });

  describe('Wardrobe', () => {
    it('Checks that the wardrobe is set and the movement event is properly emitted', () => {
      // Create a new wardrobe.
      const newWardrobe = new Wardrobe();
      const testOutfit: WardrobeItem = {
        name: 'test outfit',
        category: 'outfit',
      };
      newWardrobe.addWardrobeItem(testOutfit);
      // Set the wardrobe
      testPlayer.wardrobe = newWardrobe;
      expect(testPlayer.wardrobe).toEqual(newWardrobe);
      // Movement listener should be called
      expect(mockListeners.movement).toHaveBeenCalledWith(testPlayer.location);
    });
    it('Checks that changing the wardrobe to one with new set clothing changes the player sprite', () => {
      //testPlayer.gameObjects?.sprite.texture.key
    });
  });
});
