import { mock } from 'jest-mock-extended';
import { nanoid } from 'nanoid';
import { TownEmitter, Player as PlayerModel } from '../types/CoveyTownSocket';
import Player from './Player';
import Wardrobe from './Wardrobe';

describe('Player', () => {
  // Create a listener for the movement event
  let testPlayer: Player;
  const mockEmitter = mock<TownEmitter>();
  let playerWardrobe: Wardrobe;
  beforeEach(() => {
    testPlayer = new Player(nanoid(), mockEmitter);
    playerWardrobe = testPlayer.wardrobe;
  });

  describe('Wardrobe', () => {
    /* Some tests here are similar to the Wardrobe.test suite, but are written to ensure
    both constructors are working as intended and information can be properly accessed.
    */
    it('Gets the players wardrobe', () => {
      expect(testPlayer.wardrobe).toEqual(playerWardrobe);
    });
    it('Ensures that the wardrobe has a current skin and outfit when set as a Player property', () => {
      expect(playerWardrobe.currentOutfit).not.toBe(undefined);
      expect(playerWardrobe.currentSkin).not.toBe(undefined);
      expect(playerWardrobe.currentOutfit.id).toEqual('misa');
      expect(playerWardrobe.currentSkin.id).toBe('skin1');
    });
    it('Ensures the wardrobe inventory is defined and filled when set as a Player property', () => {
      expect(playerWardrobe.inventory).not.toBe(undefined);
      expect(playerWardrobe.inventory).not.toBe(undefined);
      expect(playerWardrobe.inventory.length).toEqual(6);
    });
  });
  describe('toPlayerModel', () => {
    it('Checks that toPlayerModel() properly copies the player wardrobe', () => {
      const newModel: PlayerModel = testPlayer.toPlayerModel();
      expect(testPlayer.wardrobe.toModel()).toEqual(newModel.wardrobe);
    });
  });
});
