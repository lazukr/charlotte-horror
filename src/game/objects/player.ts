import Phaser from 'phaser';

const VELOCITY = 300;

export default class Player {
    private sprite: Phaser.Physics.Arcade.Sprite;
    private cursor: Phaser.Types.Input.Keyboard.CursorKeys;
    public readonly scene: Phaser.Scene;

    get body(): Phaser.Physics.Arcade.Body {
        return this.sprite.body as Phaser.Physics.Arcade.Body; 
    }

    get position(): Phaser.Math.Vector2 {
        return new Phaser.Math.Vector2(this.sprite.x, this.sprite.y);
    }

    constructor(scene: Phaser.Scene, location: Phaser.Math.Vector2) {
        const { x, y } = location;
        this.scene = scene;
        this.sprite = this.scene.physics.add.sprite(x, y, 'character');
        this.sprite.setCollideWorldBounds(true);
        this.cursor = this.scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
    }

    addColliders(gameObjects: Phaser.GameObjects.GameObject) {
        this.scene.physics.add.collider(this.sprite, gameObjects);
    }

    update() {
        const body = this.sprite.body as Phaser.Physics.Arcade.Body;
        body.setVelocity(0);
        if (this.cursor.left.isDown) {
            body.setVelocityX(-1);
        } else if (this.cursor.right.isDown) {
            body.setVelocityX(1);
        }

        if (this.cursor.up.isDown) {
            body.setVelocityY(-1);
        } else if (this.cursor.down.isDown) {
            body.setVelocityY(1);
        }
        body.velocity.setLength(VELOCITY);
    }
}