import Phaser from 'phaser';
import { sortPointsClockwiseToCentre, getEdgesOfTilemap } from '../utils/tilemapHelper';

export default class RayCaster {
    public readonly vertices: Phaser.Geom.Point[];
    public readonly edges: Phaser.Geom.Line[];
    private rays: Phaser.Geom.Line[];
    private allIntersections: Phaser.Geom.Point[][];

    private staticGraphics: Phaser.GameObjects.Graphics;
    private raysGraphics: Phaser.GameObjects.Graphics;
    private debug: boolean;

    public readonly scene: Phaser.Scene;

    public set debugMode(value: boolean) {
        this.debug = value;
        if (value) {
            this.staticGraphics = this.scene.add.graphics({
                lineStyle: {
                    width: 1,
                    color: 0xff0000,
                    alpha: 1,
                },
                fillStyle: {
                    color: 0xffff00,
                    alpha: 1,
                },
            });

            this.raysGraphics = this.scene.add.graphics({
                lineStyle: {
                    width: 1,
                    color: 0x00000ff,
                    alpha: 1,
                },
                fillStyle: {
                    color: 0xff00ff,
                    alpha: 1,
                },
            });

            this.vertices.forEach(vertex => {
                this.staticGraphics.fillPointShape(vertex, 10);
            });

            this.edges.forEach(edge => {
                this.staticGraphics.strokeLineShape(edge);
            });
            return;
        }

        if (this.staticGraphics) {
            this.staticGraphics.destroy();
        }

        if (this.raysGraphics) {
            this.raysGraphics.destroy();
        }
    }

    public get intersections() {
        return this.allIntersections.map(points => {
            return points[0];
        }).filter(point => !!point);
    }

    constructor(scene: Phaser.Scene, sourceVertices: Phaser.Geom.Point[]) {
        this.scene = scene;
        this.edges = getEdgesOfTilemap(sourceVertices);
        this.vertices = sourceVertices.map(point => {
            const { x, y } = point;
            return [
                new Phaser.Geom.Point(x + 0.1, y + 0.1),
                new Phaser.Geom.Point(x + 0.1, y - 0.1),
                new Phaser.Geom.Point(x - 0.1, y + 0.1),
                new Phaser.Geom.Point(x - 0.1, y - 0.1),
            ];
        }).reduce((result, value) => {
            result.push(...value);
            return result;
        }, []);
    }

    update(source: Phaser.Geom.Point) {
        const sortedPoints = sortPointsClockwiseToCentre(source, this.vertices);
        this.rays = sortedPoints.map(point => {
            const ray = new Phaser.Geom.Line(source.x, source.y, point.x, point.y);
            Phaser.Geom.Line.Extend(ray, 0, 1000);
            return ray;
        });

        this.allIntersections = this.rays.map(ray => {
            const intersections: Phaser.Geom.Point[] = [];
            this.edges.forEach(edge => {
                const point = new Phaser.Geom.Point();
                if (Phaser.Geom.Intersects.LineToLine(ray, edge, point)) {
                    intersections.push(point);
                }
            })

            intersections.sort((a, b) => {
                return Phaser.Math.Distance.BetweenPoints(a, source) -
                    Phaser.Math.Distance.BetweenPoints(b, source);
            });

            return intersections;
        });

        if (this.debug) {
            this.raysGraphics.clear();
            this.intersections.forEach(vertex => {
                this.raysGraphics.fillPointShape(vertex, 8);
            });
            this.rays.forEach(ray => {
                this.raysGraphics.strokeLineShape(ray);
            });
        }
    }
}