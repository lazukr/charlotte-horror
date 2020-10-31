// turn an array of pair of points into lines
const getLinesFromPointPairs = (pairs: Phaser.Geom.Point[][]): Phaser.Geom.Line[] => {
    return pairs.map(pair => {
        return new Phaser.Geom.Line(pair[0].x, pair[0].y, pair[1].x, pair[1].y);
    });
}

// scans all lines in one directions and gets the points.
// since each tile contains 2 points on either direction, we can pair them off to construct the edges.
const getPointPairsInDirection = (points: Phaser.Geom.Point[], property: 'x' | 'y') => {
    const activeLines = [...new Set(points.map(point => point[property]))];
    const pointsOnLines = activeLines.map(line => {
        return points
            .filter(point => point[property] === line)
            .sort((a, b) => a[property] - b[property]);
    });

    const validPairs = pointsOnLines.map(line => {
        return line.reduce((result, value, index, array) => {
            if (index % 2 === 0) {
                result.push(array.slice(index, index + 2));
            }
            return result;
        }, []);
    });

    return validPairs.reduce((result, value) => {
        result.push(...value);
        return result;
    }, []);
}

export const sortPointsClockwiseToCentre = (centre: Phaser.Geom.Point, points: Phaser.Geom.Point[]): Phaser.Geom.Point[] => {
    return points.slice().sort((a, b) => {
        if (a.x - centre.x >= 0 && b.x - centre.x < 0) {
            return 1;
        }
        if (a.x - centre.x < 0 && b.x - centre.x >= 0) {
            return -1;
        }

        if (a.x - centre.x == 0 && b.x - centre.x == 0) {
            if (a.y - centre.y >= 0 || b.y - centre.y >= 0) {
                return a.y - b.y;
            }
            return b.y - a.y;
        }

        const det = (a.x - centre.x) * (b.y - centre.y) - (b.x - centre.x) * (a.y - centre.y);
        if (det < 0) {
            return 1;
        }
        if (det > 0) {
            return -1;
        }

        const d1 = (a.x - centre.x) * (a.x - centre.x) + (a.y - centre.y) * (a.y - centre.y);
        const d2 = (b.x - centre.x) * (b.x - centre.x) + (b.y - centre.y) * (b.y - centre.y);
        return d1 - d2;
    });
};

export const getEdgesOfTilemap = (points: Phaser.Geom.Point[]): Phaser.Geom.Line[] => {
    const horizontalPairs = getPointPairsInDirection(points, 'y');
    const verticalPairs = getPointPairsInDirection(points, 'x');

    const horizontalLines = getLinesFromPointPairs(horizontalPairs);
    const verticalLines = getLinesFromPointPairs(verticalPairs);

    return [...horizontalLines, ...verticalLines];
}

export const getVerticesOfTilemap = (tilemap: Phaser.Tilemaps.StaticTilemapLayer): Phaser.Geom.Point[] => {
    const verticesList: number[] = [];

    const filledtiles = tilemap.filterTiles((tile: Phaser.Tilemaps.Tile) => tile.index > -1);

    filledtiles.forEach(tile => {
        const { pixelX, pixelY, width, height } = tile;
        const topLeft = coordinateToNumber(pixelX, pixelY);
        const topRight = coordinateToNumber(pixelX + width, pixelY);
        const botLeft = coordinateToNumber(pixelX, pixelY + height);
        const botRight = coordinateToNumber(pixelX + width, pixelY + height);
        verticesList.push(topLeft, topRight, botLeft, botRight);
    });

    const verticesCount = tallyEntriesInList(verticesList);

    // keep odd counts, they are corners.
    const cornerVertices = Object.entries(verticesCount).filter(([key, count]) => count % 2 === 1);
    
    const points = cornerVertices.map(([key, value]) => {
        return numberToCoordinate(Number(key));
    });

    return points;
}

const tallyEntriesInList = (list: number[]) => {
    const tally: Record<number, number> = {};

    list.forEach(num => {
        if (!tally[num]) {
            tally[num] = 0;
        }
        tally[num]++;
    });

    return tally;
}

// very basic coordination system
const coordinateToNumber = (x: number, y: number) => {
    return x * 10000 + y;
}

const numberToCoordinate = (num: number) => {
    const x = Math.floor(num / 10000);
    const y = num % 10000;
    return new Phaser.Geom.Point(x, y);
}
