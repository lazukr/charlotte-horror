import Phaser from 'phaser';

enum MapLayer {
    floor,
    walls,
    ceiling,
};


export default class TestScene extends Phaser.Scene {
    private layers: Record<string, Phaser.Tilemaps.StaticTilemapLayer> = {};

    constructor() {
        super('TestScene');
    }

    preload(): void {
        this.load.image('blue_castle', 'assets/tilesets/blue_castle.png');
        this.load.tilemapTiledJSON('level0', 'assets/tilemaps/level0.json');

    }

    create (): void {
        const map = this.make.tilemap({
            key: 'level0',
        });

        const tileset = map.addTilesetImage('blue_castle', 'blue_castle');

        for (const mapLayer in MapLayer) {
            if (!mapLayer || !isNaN(Number(mapLayer))) {
                continue;
            }

            this.layers[mapLayer] = map.createStaticLayer(mapLayer, tileset, 0, 0);
        }
    }

    update (): void {
    
    }
}
