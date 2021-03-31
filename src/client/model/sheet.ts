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
    key:   string
    value: CellType
    pos:   Position
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
        return this.sheet.row(this.index.y)
    }

    insertAbove() {
        console.log(`insert above line to ${this.index.y-1}`)
        const cells: CellType[] = Array(this.sheet.colNum()).fill('')
        this.sheet.insertRow(this.index.y - 1, cells)
    }

    insertBelow() {
        console.log(`insert below line to ${this.index.y}`)
        const cells: CellType[] = Array(this.sheet.colNum()).fill('')
        this.sheet.insertRow(this.index.y, cells)
    }

    insertLeft() {
        console.log(`insert left line to ${this.index.x}`)
        const cells: CellType[] = Array(this.sheet.body.length).fill('')
        this.sheet.insertCol(this.index.x, '', cells)
    }

    insertRight() {
        console.log(`insert right line to ${this.index.x + 1}`)
        const cells: CellType[] = Array(this.sheet.body.length).fill('')
        this.sheet.insertCol(this.index.x + 1, '', cells)
    }

    deleteRow() {
        console.log(`delete row ${this.index.y - 1}`)
        this.sheet.deleteRow(this.index.y - 1)
    }

    deleteCol() {
        console.log(`delete col ${this.index.x}`)
        this.sheet.deleteCol(this.index.x)
    }
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

    toHash(): any {
        let ret = this.cells.map((row) => {
            var hash: { [key: string]: string; } = {};
            for (var cell of row) {
                hash[cell.key] = cell.value as string
            }
            console.log(hash)
            return hash
        })
        ret.shift()

        return ret
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
        if (idx > this.body.length) { throw 'index exceeds table row size' }

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

    deleteRow(idx: number) {
        if (idx >= this.body.length) { throw 'index exceeds table row size' }

        this.body.splice(idx, 1)
        this.cells = this.createCell(this.body)
    }

    deleteCol(idx: number) {
        if (idx >= this.body.length) { throw "index exceeds table column size" }

        this.header.splice(idx, 1)
        this.body.map((row, i) => {
            row.splice(idx, 1)
        })
        this.cells = this.createCell(this.body)
    }

    moveRow(fromIdx: number, toIdx: number) {}
    moveCol(fromIdx: number, toIdx: number) {}
}