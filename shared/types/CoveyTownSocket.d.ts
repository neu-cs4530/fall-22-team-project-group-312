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
};

export type Interactable = ViewingArea | ConversationArea;

export type TownSettingsUpdate = {
  friendlyName?: string;
  isPubliclyListed?: boolean;
};

export type Direction = "front" | "back" | "left" | "right";
export interface Player {
  id: string;
  userName: string;
  location: PlayerLocation;
  wardrobe: WardrobeModel;
}

/**
 * Represents the location of a WardrobeItem on the player's body.
 */
export type ItemCategory = "skin" | "outfit";

/**
 * Represents how rare a particular WardrobeItem is
 */
export type Rarity = "common" | "rare" | "ultraRare";

/**
 * Represents a mapping of item rarities to numeric values
 */
export type RarityMapping = {
  common: number;
  rare: number;
  ultraRare: number;
};

 export type ItemID = string;

 /**
  * Represents a single item in a Wardrobe, either a skin color, eye color, hairstyle, clothing, or accessory.
  */
 export type WardrobeItem = {
   id: ItemID;
   name: string;
   category: ItemCategory;
   rarity: Rarity;
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

/**
 * Representation of the result of pulling from a gacha picker
 */
export type PullResult = {
  /** The item that was just retrieved */
  item: WardrobeItem;
  /** The updated Wardrobe containing the item and currency */
  wardrobe: WardrobeModel;
}

/**
 * Represents a way to select a random item from a set pool of items
 */
export interface GachaPicker {
  /** The pool of items that can be selected */
  itemPool: WardrobeItem[];
  /** How many CoveyCoins are needed to get an item */
  pullCost: number;
  /** The percent of coins returned to the player after pulling a duplicate item */
  refundPercent: number;
  /** A mapping of item rarities to numeric values (higher = more common) */
  rarityMapping: RarityMapping;
  /** The id of this GachaPicker */
  id: string;
  // pull: (pullingPlayer: Player) => void;
}

// Represents the default pull cost for GachaPickers
// export const PULL_COST = 1000;

// // Represents the default refund percentage for GachaPickers
// export const REFUND_PERCENT = 0.1;

// /** Represents the default rarity mapping for GachaPickers */
// export const DEFAULT_RARITY_MAPPING: RarityMapping = {
//   common: 10,
//   rare: 5,
//   ultraRare: 1,
// };

// Represents all skin color options the player could possibly have
export const SKIN_COLORS: string[] = ["skin0", "skin1", "skin2", "skin3"];

// Represents all outfit options the player could possiby have
export const OUTFITS: string[] = ["misa", "bday", "keqing", "ness", "xiaohei"];

export type XY = { x: number; y: number };

export interface PlayerLocation {
  /* The CENTER x coordinate of this player's location */
  x: number;
  /* The CENTER y coordinate of this player's location */
  y: number;
  /** @enum {string} */
  rotation: Direction;
  moving: boolean;
  interactableID?: string;
}
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
}
export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

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
  gachaUpdate: (gachapon: GachaPicker) => void;
  playerPulled: (pullingPlayer: Player) => void;
  wardrobeImported: (newWardrobeModel: WardrobeModel | undefined) => void;
  wardrobeExported: (wardrobeJson: string) => void;
}

export interface ClientToServerEvents {
  chatMessage: (message: ChatMessage) => void;
  playerMovement: (movementData: PlayerLocation) => void;
  interactableUpdate: (update: Interactable) => void;
  // New ClientToServer event for a changed wardrobe.
  playerWardobeChange: (newWardrobe: WardrobeModel) => void;
  // // New ClientToServer event for a gacha pull.
  // playerGachaPull: (pulledItem: WardrobeItem) => void;
  exportWardrobe: () => void;
  importWardrobe: (wardrobeJSON: string) => void;
}
