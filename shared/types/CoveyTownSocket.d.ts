export type TownJoinResponse = {
  /** Unique ID that represents this player * */
  userID: string;
  /** Secret token that this player should use to authenticate
   * in future requests to this service * */
  sessionToken: string;
  /** Secret token that this player should use to authenticate
   * in future requests to the video service * */
  providerVideoToken: string;
  /** List of players currently in this town * */
  currentPlayers: Player[];
  /** Friendly name of this town * */
  friendlyName: string;
  /** Is this a private town? * */
  isPubliclyListed: boolean;
  /** Current state of interactables in this town */
  interactables: Interactable[];
}

export type Interactable = ViewingArea | ConversationArea;

export type TownSettingsUpdate = {
  friendlyName?: string;
  isPubliclyListed?: boolean;
}

export type Direction = 'front' | 'back' | 'left' | 'right';
export interface Player {
  id: string;
  userName: string;
  location: PlayerLocation;
  wardrobe: WardrobeModel;
};

/**
 * Represents the location of a WardrobeItem on the player's body.
 */
 export type ItemCategory = 'skin' | 'outfit';
 export type ItemID = string;

 /**
  * Represents a single item in a Wardrobe, either a skin color, eye color, hairstyle, clothing, or accessory.
  */
 export type WardrobeItem = {
   id: ItemID;
   name: string;
   category: ItemCategory;
 };

/**
 * Representation of a wardrobe that the TownGameScene can interact with.
 */
 export interface WardrobeModel {
  /** The amount of currency a wardrobe currently has to be spent on WardrobeItems. */
  currency: number;
  /** The current skin color set in the wardrobe. */
  currentSkin: WardrobeItem;
  /** The current outfit set in the wardrobe. */
  currentOutfit: WardrobeItem;
  /** A list of the wardrobe items currently unlocked.  */
  inventory: WardrobeItem[];
}

// Represents all skin color options the player could possibly have
export const SKIN_COLORS: string[] = ['skin0', 'skin1', 'skin2', 'skin3'];

// Represents all outfit options the player could possiby have
export const OUTFITS: string[] = ['misa', 'bday', 'keqing', 'ness', 'xiaohei'];

export type XY = { x: number, y: number };

export interface PlayerLocation {
  /* The CENTER x coordinate of this player's location */
  x: number;
  /* The CENTER y coordinate of this player's location */
  y: number;
  /** @enum {string} */
  rotation: Direction;
  moving: boolean;
  interactableID?: string;
};
export type ChatMessage = {
  author: string;
  sid: string;
  body: string;
  dateCreated: Date;
};

export interface ConversationArea {
  id: string;
  topic?: string;
  occupantsByID: string[];
};
export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
};

export interface ViewingArea {
  id: string;
  video?: string;
  isPlaying: boolean;
  elapsedTimeSec: number;
}

export interface ServerToClientEvents {
  playerMoved: (movedPlayer: Player) => void;
  // New ServerToClient event for a changed wardrobe.
  playerWardrobeChanged: (wardrobePlayer: Player) => void;
  playerDisconnect: (disconnectedPlayer: Player) => void;
  playerJoined: (newPlayer: Player) => void;
  initialize: (initialData: TownJoinResponse) => void;
  townSettingsUpdated: (update: TownSettingsUpdate) => void;
  townClosing: () => void;
  chatMessage: (message: ChatMessage) => void;
  interactableUpdate: (interactable: Interactable) => void;
  wardrobeImported: (newWardrobeModel: WardrobeModel | undefined) => void;
  wardrobeExported: (wardrobeJson: string) => void;
}

export interface ClientToServerEvents {
  chatMessage: (message: ChatMessage) => void;
  playerMovement: (movementData: PlayerLocation) => void;
  interactableUpdate: (update: Interactable) => void;
  // New ClientToServer event for a changed wardrobe.
  playerWardobeChange: (newWardrobe: WardrobeModel) => void;
  exportWardrobe: () => void;
  importWardrobe: (wardrobeJSON: string) => void;
}