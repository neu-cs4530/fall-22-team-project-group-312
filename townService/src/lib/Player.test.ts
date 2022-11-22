import { mock } from 'jest-mock-extended';
import { nanoid } from 'nanoid';
import { TownEmitter, Player as PlayerModel } from '../types/CoveyTownSocket';
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
    // TODO: fix this
    it('Checks that toPlayerModel() properly copies the player wardrobe', () => {
      const newModel: PlayerModel = testPlayer.toPlayerModel();
      expect(testPlayer.wardrobe.toModel()).toEqual(newModel.wardrobe);
    });
  });
});
