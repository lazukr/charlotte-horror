import Player from "./player";

export default class Flashlight {
    private scene: Phaser.Scene;
    private player: Player;
    private point: Phaser.Geom.Point;
    private midLine: Phaser.Geom.Line;
    private leftLine: Phaser.Geom.Line;
    private rightLine: Phaser.Geom.Line;
    private _debug: boolean = false;
    private flashlightGraphics: Phaser.GameObjects.Graphics;
    private triangle: Phaser.GameObjects.Triangle;
    
    public get viewTriangle(): Phaser.GameObjects.Triangle {
        return this.triangle;
    }

    public set debug(value: boolean) {
        this._debug = value;

        if (value) {
            this.flashlightGraphics = this.scene.add.graphics({
                lineStyle: {
                    width: 1,
                    color: 0xff00ff,
                    alpha: 1,
                },
                fillStyle: {
                    color: 0xf0f0f0,
                    alpha: 1,
                },
            });

            return;
        }
        if (this.flashlightGraphics) {
            this.flashlightGraphics.destroy();
        }
    }

    constructor(scene: Phaser.Scene, player: Player) {
        this.scene = scene;
        this.player = player;
        this.triangle = this.scene.add.triangle(0, 0, 0, 0, 0, 0, 0, 0, 0xff00ff, 1).setVisible(false);
    }

    update (cursor: Phaser.Input.Pointer) {
        const {x, y} = cursor;
        const {x: x1, y: y1} = this.player.position;
        const playerPosition = new Phaser.Geom.Point(x1, y1);

        this.point = new Phaser.Geom.Point(x, y);
        this.midLine = new Phaser.Geom.Line(x, y, x1, y1);
        this.leftLine = Phaser.Geom.Line.Clone(this.midLine);
        this.rightLine = Phaser.Geom.Line.Clone(this.midLine);
        Phaser.Geom.Line.RotateAroundPoint(this.leftLine, playerPosition, 0.2);
        Phaser.Geom.Line.RotateAroundPoint(this.rightLine, playerPosition, -0.2);

        const leftPoint = this.leftLine.getPoint(0);
        const rightPoint = this.rightLine.getPoint(0);
        const {x:x2, y: y2} = leftPoint;
        const {x:x3, y: y3} = rightPoint;

        this.triangle.setTo(x1, y1, x2, y2, x3, y3);

        if (this._debug) {
            this.flashlightGraphics.clear();
            const leftPoint = this.leftLine.getPoint(0);
            const rightPoint = this.rightLine.getPoint(0);
            const {x:x2, y: y2} = leftPoint;
            const {x:x3, y: y3} = rightPoint;
            this.flashlightGraphics.fillTriangle(x1, y1, x2, y2, x3, y3);
            this.flashlightGraphics.fillPointShape(this.point, 10);
            this.flashlightGraphics.strokeLineShape(this.midLine);
            this.flashlightGraphics.strokeLineShape(this.leftLine);
            this.flashlightGraphics.strokeLineShape(this.rightLine);
        }
    }
}