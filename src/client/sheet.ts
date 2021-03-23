export type CellType = string | number | boolean | undefined

export type Position = {
    x: number,
    y: number,
}

export type Index = {
    x: number,
    y: number,
}

export class Cell {
    sheet: Sheet
    key: string
    value: CellType
    pos: Position
    index: Index
    width: number
    height: number

    constructor(sheet: Sheet, key: string, value: CellType, pos: Position, index: Index, width: number, height: number) {
        this.sheet = sheet
        this.key = key
        this.value = value
        this.pos = pos
        this.index = index
        this.width = width
        this.height = height
    }

    column(): Line {
        return this.sheet.column(this.index.x)
    }

    row(): Line {
        return this.sheet.column(this.index.y)
    }

    onClickHandler      = () => console.log('onClick!!')
    onDblClickHandler   = () => console.log('onDblClick!!')
    onRightClickHandler = () => console.log('onRightClick!!')
}

export interface Line {
    index: number;
    size:  number;
    cells: Cell[];
    setSize(size: number): void;
}

class Column implements Line {
    index: number
    size:  number
    cells: Cell[]

    constructor(index: number, cells: Cell[]) {
        this.index = index
        this.cells = cells
        this.size  = this.cells[0].width
    }

    setSize(size: number) {
        this.size = size;
        for (var cell of this.cells) {
            cell.width = size;
        }
    }
}

class Row implements Line {
    index: number
    size:  number
    cells: Cell[]

    constructor(index: number, cells: Cell[]) {
        this.index = index
        this.cells = cells
        this.size  = this.cells[0].height
    }

    setSize(size: number) {
        this.size = size;
        for (var cell of this.cells) {
            cell.height = size;
        }
    }
}

export class Sheet {
    static readonly DEFAULT_CELL_WIDTH   = 150
    static readonly DEFAULT_CELL_HEIGHT = 30

    header: string[]
    body: CellType[][]
    cells: Cell[][]

    constructor(header: string[], body: CellType[][]) {
        this.header = header
        this.body = body
        this.cells = this.createCell(body)
    }

    private createCell(body: CellType[][]): Cell[][] {
        let table: CellType[][] = [this.header]
        table = table.concat(body)
        return table.map((row, i) => {
            return row.map((cell, j) => {
                return new Cell(
                    this,
                    this.header[j],
                    cell,
                    {
                        x: (Sheet.DEFAULT_CELL_WIDTH  * j) + j + 1,
                        y: (Sheet.DEFAULT_CELL_HEIGHT * i) + i + 1,
                    },
                    {
                        x: j,
                        y: i,
                    },
                    Sheet.DEFAULT_CELL_WIDTH,
                    Sheet.DEFAULT_CELL_HEIGHT)
            });
        });
    }

    private convertCellType(): CellType[][] {
        return this.cells.map((row) => {
            return row.map((cell) => {
                return cell.value
            })
        })
    }

    // TODO: Implement it
    cellFromPx(x: number, y: number): Cell {
        return this.cells[0][0]
    }

    table(): Cell[][] {
        return this.cells
    }

    rowNum(): number {
        return this.cells.length
    }

    colNum(): number {
        return this.header.length
    }

    cell(x: number, y: number): Cell {
        return this.cells[y][x]
    }

    row(idx: number): Row {
        return new Row(idx, this.cells[idx])
    }

    column(idx: number): Row {
        const cols = this.cells.map((row) => { return row[idx] })
        return new Column(idx, cols)
    }

    insertRow(idx: number, row: CellType[]) {
        if (idx >= this.body.length) { throw 'index exceeds table row size' }

        this.body.splice(idx, 0, row)
        this.cells = this.createCell(this.body)
    }

    insertCol(idx: number, key: string, col: CellType[]) {
        if (col.length != this.body.length) { throw "column is different from column size" }
        if (idx >= this.body.length) { throw "index exceeds table column size" }

        this.header.splice(idx, 0, key)
        this.body.map((row, i) => {
            row.splice(idx, 0, col[i])
        })
        this.cells = this.createCell(this.body)
    }

    deleteRow(idx: number) {}
    deleteCol(idx: number) {}

    moveRow(fromIdx: number, toIdx: number) {}
    moveCol(fromIdx: number, toIdx: number) {}
}