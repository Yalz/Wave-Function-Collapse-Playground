class Tile {
    constructor(name, img, vertices) {
        this.name = name;

        if (img == undefined) {
            throw new Error('not a valid image path')
        }

        this.img = img;

        vertices.forEach(vertice => {
            if ((vertice.length % 2) != 1) {
                throw new Error('vertices should be an unpair amount : ' + vertice + ' in tile ' + path)
            }
        })

        this.vertices = vertices;
    }

    rotate(num) {
        const rotatedImg = this.img
  
        // Rotate edges
        const newEdges = [];
        const len = this.vertices.length;
        for (let i = 0; i < len; i++) {
          newEdges[i] = this.vertices[(i - num + len) % len];
        }
        return new Tile(rotatedImg, newEdges);
    }
}

class TileSet {

    constructor(tiles) {
        this.tiles = tiles;
    }

    randomTile() {
        const randomIndex = Math.floor(Math.random() * this.tiles.length);
        return [this.tiles[randomIndex]]
    }

    validateTileset() {
        this.validateImgs()
        this.validateVertices()
    }

    validateImgs() {
        tileSet.forEach(tile => {
            if(tile.img == null) {
                throw new Error("Img missing for tile", tile)
            } 
        });
    }

    validateVertices() {

    }
}