import { mock, mockClear } from 'jest-mock-extended';
import { nanoid } from 'nanoid';
import Wardrobe from '../components/VideoCall/VideoFrontend/components/Buttons/OpenWardrobeButton/WardrobePanel';
import { PlayerLocation, WardrobeItem } from '../types/CoveyTownSocket';
import ConversationAreaController, { ConversationAreaEvents } from './ConversationAreaController';
import PlayerController from './PlayerController';

describe('[T2] ConversationAreaController', () => {
  // A valid ConversationAreaController to be reused within the tests
  let testArea: ConversationAreaController;
  const mockListeners = mock<ConversationAreaEvents>();
  let testHair: WardrobeItem;
  let testSkin: WardrobeItem;
  let testClothing: WardrobeItem;
  let testAccessory: WardrobeItem;
  let testEyes: WardrobeItem;
  beforeEach(() => {
    const playerLocation: PlayerLocation = {
      moving: false,
      x: 0,
      y: 0,
      rotation: 'front',
    };
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
    const playerWardrobe = new Wardrobe();
    Wardrobe = {
      currency: 0,
      currentSkin: testSkin,
      currentEyes: testEyes,
      currentHair: testHair,
      currentClothing: testClothing,
      currentAccessory: testAccessory,
      inventory: null,
    };
    testArea = new ConversationAreaController(nanoid(), nanoid());
    testArea.occupants = [
      new PlayerController(nanoid(), nanoid(), playerLocation, playerWardrobe),
      new PlayerController(nanoid(), nanoid(), playerLocation, playerWardrobe),
      new PlayerController(nanoid(), nanoid(), playerLocation, playerWardrobe),
    ];
    mockClear(mockListeners.occupantsChange);
    mockClear(mockListeners.topicChange);
    testArea.addListener('occupantsChange', mockListeners.occupantsChange);
    testArea.addListener('topicChange', mockListeners.topicChange);
  });
  describe('isEmpty', () => {
    it('Returns true if the occupants list is empty', () => {
      testArea.occupants = [];
      expect(testArea.isEmpty()).toBe(true);
    });
    it('Returns true if the topic is undefined', () => {
      testArea.topic = undefined;
      expect(testArea.isEmpty()).toBe(true);
    });
    it('Returns false if the occupants list is set and the topic is defined', () => {
      expect(testArea.isEmpty()).toBe(false);
    });
  });
  describe('setting the occupants property', () => {
    it('does not update the property if the new occupants are the same set as the old', () => {
      const origOccupants = testArea.occupants;
      const occupantsCopy = testArea.occupants.concat([]);
      const shuffledOccupants = occupantsCopy.reverse();
      testArea.occupants = shuffledOccupants;
      expect(testArea.occupants).toEqual(origOccupants);
      expect(mockListeners.occupantsChange).not.toBeCalled();
    });
    it('emits the occupantsChange event when setting the property and updates the model', () => {
      const newOccupants = testArea.occupants.slice(1);
      testArea.occupants = newOccupants;
      expect(testArea.occupants).toEqual(newOccupants);
      expect(mockListeners.occupantsChange).toBeCalledWith(newOccupants);
      expect(testArea.toConversationAreaModel()).toEqual({
        id: testArea.id,
        topic: testArea.topic,
        occupantsByID: testArea.occupants.map(eachOccupant => eachOccupant.id),
      });
    });
  });
  describe('setting the topic property', () => {
    it('does not update the property if the topic is the same string', () => {
      const topicCopy = `${testArea.topic}`;
      testArea.topic = topicCopy;
      expect(mockListeners.topicChange).not.toBeCalled();
    });
    it('emits the topicChange event when setting the property and updates the model', () => {
      const newTopic = nanoid();
      testArea.topic = newTopic;
      expect(mockListeners.topicChange).toBeCalledWith(newTopic);
      expect(testArea.topic).toEqual(newTopic);
      expect(testArea.toConversationAreaModel()).toEqual({
        id: testArea.id,
        topic: newTopic,
        occupantsByID: testArea.occupants.map(eachOccupant => eachOccupant.id),
      });
    });
  });
});
