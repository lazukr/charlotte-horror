import Phaser from 'phaser';

export default class Vision {
    private darkness: Phaser.GameObjects.Rectangle;
    private raycastMask: Phaser.GameObjects.Graphics;
    private viewDarkness: Phaser.GameObjects.Rectangle;
    private view: Phaser.GameObjects.Image;
    private flashlightMask: Phaser.GameObjects.Graphics;

    public readonly scene: Phaser.Scene;

    public get isDark() {
        return this.viewDarkness.visible;
    }

    public set isDark(value: boolean) {
        this.viewDarkness.visible = value;
    }

    public get isRayCast() {
        return this.darkness.visible;
    }

    public set isRayCast(value: boolean) {
        this.darkness.visible = value;
    }

    constructor(scene: Phaser.Scene, dimensions: Phaser.Math.Vector2, flashlight: Phaser.GameObjects.Triangle) {
        const {x: width, y: height } = dimensions;
        this.scene = scene;
        this.raycastMask = this.scene.make.graphics({});
        this.raycastMask.setDefaultStyles({
            fillStyle: {
                color: 0x000000,
                alpha: 1,
            },
        });

        this.flashlightMask = this.scene.make.graphics({});
        this.flashlightMask.setDefaultStyles({
            fillStyle: {
                color: 0x000000,
                alpha: 1,
            },
        });

        this.darkness = this.scene.add.rectangle(0, 0, width, height, 0x000000, 0.95).setOrigin(0);
        this.viewDarkness = this.scene.add.rectangle(width/2, height/2, width * 2, height * 2, 0x000000, 0.95);
        this.view = this.scene.add.image(width/2, height/2, 'vision').setVisible(false);

        const viewMask = this.view.createBitmapMask();
        viewMask.invertAlpha = true;
        this.viewDarkness.setMask(viewMask);
    }

    update(position: Phaser.Geom.Point, intersections: Phaser.Geom.Point[]) {
        const {x, y} = position;
        this.view.setPosition(x, y);
        this.viewDarkness.setPosition(x, y);

        this.raycastMask.clear();
        this.raycastMask.fillPoints(intersections, true, true);
        const mask = this.raycastMask.createGeometryMask();
        mask.setInvertAlpha();
        this.darkness.setMask(mask);
    }
}