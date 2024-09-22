let tileImgProps = {
  width: 100,
  height: 100
}

let tileSetData;
let tileSet
let DIM = 5;
let grid;
let finished = false;

let tileset = 'tilesets/Knots/'

function preload() {
  tileSetData = loadXML(tileset + 'tileset.xml', initTiles);
}

function initTiles(){
  const tiles = tileSetData.getChild("tiles").getChildren().map(tile => {
    let name = tile.getString("name")
    let path = tile.getString("path")
    let vertices = tile.getChild("vertices").getChildren().map(child => child.getString("code"))
    return new Tile(name, loadImage(tileset + path), vertices)
  });

  /*
  tiles.forEach(element => {
    for (let j = 1; j < 4; j++) {
      let newTile = element.rotate(j);
      if (tiles.filter(tile => tile.vertices == newTile.vertices).length != 1) {
        tiles.push();
      }    
    }
  });
  */
  tileSet = new TileSet(tiles);
}

function setup() {
  createCanvas(tileImgProps.width * DIM, tileImgProps.height * DIM);

  grid = new Grid(DIM, tileSet);
}

function draw() {
  frameRate(5);

  if (grid.uncollapsed()){
    try {
      grid.updateGrid()
    } catch (error) {
      console.warn(error)
      grid = new Grid(DIM, tileSet)
    }
  }
  else if(finished != true) {
    finished = true
    console.log("Finished!")
  }

  for(let i = 0; i < DIM; i++ ) {
    let row = grid.row(i);
    for(let j = 0; j < DIM; j++ ) {
      const collapsedTile = row[j].getCollapsedTile();
      if (collapsedTile) {
        image(collapsedTile, tileImgProps.width * i, tileImgProps.height * j);
      }
    }
  }
}