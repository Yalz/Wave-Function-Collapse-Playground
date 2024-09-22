class Grid {

    constructor(DIM, tileset) {
        this.DIM = DIM
        this.tileSet = tileset;
        this.grid = []
        this.lastFirstUncollapsedItem = undefined
        this.init()
    }

    init() {
        for(let x = 0; x < this.DIM; x++ ) {
            let row = [];
            for(let y = 0; y < this.DIM; y++ ) {
                let cell = new Cell(x, y, this.tileSet);
                row.push(cell)
            }
            this.grid.push(row);
        }

        this.grid[0][0].randomise();
        this.grid[2][0].randomise();
    }

    updateGrid() {

        let collapsableCells = this.allCellsByCollapsable();

        if (this.lastFirstUncollapsedItem && collapsableCells[0] == this.lastFirstUncollapsedItem) {
            collapsableCells[0].freeGuessForCell()
            return
        }
        this.lastFirstUncollapsedItem = collapsableCells[0]

        collapsableCells.forEach(cell => {
            let cellUp = this.cellAt(cell.pos.y - 1, cell.pos.x);
            let cellRight = this.cellAt(cell.pos.y, cell.pos.x + 1);
            let cellDown = this.cellAt(cell.pos.y + 1, cell.pos.x);
            let cellLeft = this.cellAt(cell.pos.y, cell.pos.x - 1);

            cell.updateCell(cellUp, cellRight, cellDown, cellLeft)
        })
    }

    cellAt(y, x) {
        if(x < 0 || y < 0 || x >= this.DIM || y >= this.DIM) {
            return undefined;
        }
        return this.grid[x][y];
    }

    row(index) {
        return this.grid[index];
    }

    allCellsByCollapsable() {
        return this.grid.flat()
            .filter(cell => !cell.collapsed)
            .sort((cell1, cell2) => cell1.options.length - cell2.options.length);
    }

    uncollapsed() {
        return this.allCellsByCollapsable().length != 0
    }
    
}

class Cell {
    constructor(x, y, options) {
        this.collapsed = false;
        this.options = options.tiles;
        this.tileSet = options;
        this.pos = createVector(x, y);
    }

    randomise() {
        this.collapsed = true;
        this.options = this.tileSet.randomTile();
    }

    getCollapsedTile() {
        if (this.collapsed) {
            let img = this.options[0].img;
            img.resize(100, 100)
            return img;
        }
    }

    updateCell(cellUp, cellRight, cellDown, cellLeft) {
        this.tryCollapseCell(cellUp, 0)
        this.tryCollapseCell(cellRight, 1)
        this.tryCollapseCell(cellDown, 2)
        this.tryCollapseCell(cellLeft, 3)

        switch (this.options.length) {
            case 2:
                let randomInt = Math.floor(Math.random() * 2);
                this.options = [this.options[randomInt]]
                this.collapsed = true
            case 1:
                this.collapsed = true
                break;
            case 0:
                throw new Error('No more options for ' + this.pos.x + ',' + this.pos.y)
            default:
                break;
        }
    }

    freeGuessForCell() {
        let randomInt = Math.floor(Math.random() * this.options.length);
        this.options = [this.options[randomInt]]
        this.collapsed = true
    }

    tryCollapseCell(otherCell, index) {
        if (!otherCell || this.collapsed) {
            return
        }

        const inverseIndex = (index+2) % 4;

        let possibleVertices = this.options
                .map(option => option.vertices[index])
                .map(vertice => {
                    return vertice.split('').reverse().join('')
                });

        let possibleOtherCellVertices = otherCell.options.map(option => option.vertices[inverseIndex]);

        let common = this.findCommonElements(possibleVertices, possibleOtherCellVertices);

        this.options = this.options.filter(option => common.includes(option.vertices[index]))
    }

    findCommonElements(arr1, arr2) {
        return arr1.filter(element => arr2.includes(element));
    }
}