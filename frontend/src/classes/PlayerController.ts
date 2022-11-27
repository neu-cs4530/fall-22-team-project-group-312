import EventEmitter from 'events';
import TypedEmitter from 'typed-emitter';
import { Player as PlayerModel, PlayerLocation, Wardrobe } from '../types/CoveyTownSocket';

export type PlayerEvents = {
  movement: (newLocation: PlayerLocation) => void;
};

export type PlayerGameObjects = {
  sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  label: Phaser.GameObjects.Text;
  locationManagedByGameScene: boolean /* For the local player, the game scene will calculate the current location, and we should NOT apply updates when we receive events */;
};
export default class PlayerController extends (EventEmitter as new () => TypedEmitter<PlayerEvents>) {
  private _location: PlayerLocation;

  private _wardrobe: Wardrobe;

  private readonly _id: string;

  private readonly _userName: string;

  public gameObjects?: PlayerGameObjects;

  constructor(id: string, userName: string, location: PlayerLocation, wardrobe: Wardrobe) {
    super();
    this._id = id;
    this._userName = userName;
    this._location = location;
    this._wardrobe = wardrobe;
  }

  set location(newLocation: PlayerLocation) {
    this._location = newLocation;
    this._updateGameComponentLocation();
    this.emit('movement', newLocation);
  }

  get location(): PlayerLocation {
    return this._location;
  }

  get userName(): string {
    return this._userName;
  }

  get id(): string {
    return this._id;
  }

  // Returns the player's current wardrobe.
  get wardrobe(): Wardrobe {
    return this._wardrobe;
  }

  // Change the player's wardrobe. Emit an update signaling this change.
  set wardrobe(newWardrobe: Wardrobe) {
    this._wardrobe = newWardrobe;
    // Uses the movement emitter and update location method to signal a wardrobe change.
    this._updateGameComponentLocation();
    this.emit('movement', this.location);
  }

  toPlayerModel(): PlayerModel {
    return {
      id: this.id,
      userName: this.userName,
      location: this.location,
      wardrobe: this._wardrobe,
    };
  }

  private _updateGameComponentLocation() {
    if (this.gameObjects && !this.gameObjects.locationManagedByGameScene) {
      const { sprite, label } = this.gameObjects;
      if (!sprite.anims) return;
      sprite.setX(this.location.x);
      sprite.setY(this.location.y);
      label.setX(sprite.body.position.x);
      label.setY(sprite.body.position.y - 20);
      if (this.location.moving) {
        sprite.anims.play(`misa-${this.location.rotation}-walk`, true);
      } else {
        sprite.anims.stop();
        sprite.setTexture('atlas', `misa-${this.location.rotation}`);
      }
    }
  }

  /* Creates and stores sprite objects based on the currently equipped wardrobe items
  of the player. */
  private async _generateSprite() {
    // Signifies the folder where each sprite is held
  }

  static fromPlayerModel(modelPlayer: PlayerModel): PlayerController {
    return new PlayerController(
      modelPlayer.id,
      modelPlayer.userName,
      modelPlayer.location,
      modelPlayer.wardrobe,
    );
  }
}
