import { mock } from 'jest-mock-extended';
import { nanoid } from 'nanoid';
import { TownEmitter } from '../types/CoveyTownSocket';
import Player from './Player';

describe('Player', () => {
  // Create a listener for the movement event
  let testPlayer: Player;
  const mockEmitter = mock<TownEmitter>();
  beforeEach(() => {
    testPlayer = new Player(nanoid(), mockEmitter);
  });

  describe('Wardrobe', () => {
    it('Gets the players wardrobe', () => {
      const playerWardrobe = testPlayer.wardrobe;
      expect(testPlayer.wardrobe).toEqual(playerWardrobe);
    });
  });
  describe('toPlayerModel', () => {
    it('Checls that toPlayerModel() properly copies the player wardrobe', () => {
      const newModel = testPlayer.toPlayerModel();
      expect(testPlayer.wardrobe).toEqual(newModel.wardrobe);
    });
  });
});
