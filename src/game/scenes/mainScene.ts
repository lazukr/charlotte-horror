import Phaser from 'phaser';
import { getVerticesOfTilemap } from '../utils/tilemapHelper';
import RayCaster from '../objects/rayCaster';
import Vision from '../objects/vision';
import Player from '../objects/player';
import Flashlight from '../objects/flashlight';

enum MapLayer {
    Collision,
    Floor,
    Walls,
    Ceiling,
    Shadow,
};

export default class MainScene extends Phaser.Scene {
    private mapLayers: Phaser.Tilemaps.StaticTilemapLayer[];
    private rayCaster: RayCaster;
    private vision: Vision;
    private player: Player;
    private flashlight: Flashlight;

    
    constructor() {
        super('MainScene');
        this.mapLayers = [];
    }

    preload(): void {
        this.load.image('dungeon', 'assets/tilesets/dungeon.png');
        this.load.image('vision', 'assets/sprites/vision.png');
        this.load.image('character', 'assets/sprites/character.png');
        this.load.tilemapTiledJSON('level3', 'assets/tilemaps/level3.json');
    }

    create (): void {
        const map = this.make.tilemap({
            key: 'level3',
        });
        const tileset = map.addTilesetImage('dungeon', 'dungeon');
        const { widthInPixels, heightInPixels } = map;
        const mapSize = new Phaser.Math.Vector2(widthInPixels, heightInPixels);

        for (const layerData of map.layers) {
            const { name } = layerData;
            const layer = map.createStaticLayer(name, tileset, 0, 0); 
            layer.setCollisionByProperty({
                collides: true,
            });
            this.mapLayers.push(layer);
        }

        for (const objectData of map.objects) {
   
            const { objects } = objectData;
            const {x, y} = objects[0];
            const startingPosition = new Phaser.Math.Vector2(x, y);
            this.player = new Player(this, startingPosition);
            this.player.addColliders(this.mapLayers[MapLayer.Collision]);
        }

        const mapVertices = getVerticesOfTilemap(this.mapLayers[MapLayer.Ceiling]);
        this.flashlight = new Flashlight(this, this.player);
        this.rayCaster = new RayCaster(this, mapVertices);
        this.vision = new Vision(this, mapSize, this.flashlight.viewTriangle);


        this.input.activePointer.x = mapSize.x / 2;
        this.input.activePointer.y = mapSize.y / 2;

        //this.vision.isDark = true;
        this.vision.isRayCast = true;
    }

    update (): void { 
        this.player.update();
        this.flashlight.update(this.input.activePointer);
        const { x, y } = this.player.position;
        const sourcePosition = new Phaser.Geom.Point(x, y);
        this.rayCaster.update(sourcePosition);
        this.vision.update(sourcePosition, this.rayCaster.intersections);
    }
}