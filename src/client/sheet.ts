export type CellType = string | number | boolean | undefined

export type Cell = {
    key: string,
    value: CellType,
    row: Row
}

export class Row {
    index: number
    private header: string[]
    private row:    CellType[]
    private cells:  Cell[]
    constructor(idx: number, header: string[], row: CellType[]) {
        this.index  = idx
        this.header = header
        this.row    = row
        this.cells  = this.row.map((cell, i) => {
            return {key: this.header[i], value: cell, row: this}
        });
    }

    cell(idx: number): Cell {
        return {key: this.header[idx], value: this.row[idx], row: this}
    }

    cellIndex(cell: Cell): number {
        return this.header.indexOf(cell.key)
    }

    nextCell(cell: Cell): Cell | undefined {
        const idx = this.cellIndex(cell);
        if (idx >= this.cells.length) {
            return undefined
        }
        return this.cells[idx + 1]
    }
}

export class Sheet {
    static readonly DEFAULT_CELL_WIDTH  = 150
    static readonly DEFAULT_CELL_HEIGHT = 30

    private header: string[]
    private body: CellType[][]

    constructor(header: string[], body: CellType[][]) {
        this.header = header
        this.body   = body
    }

    rowNum(): number {
        return this.body.length
    }

    colNum(): number {
        return this.header.length
    }

    cell(x: number, y: number): Cell {
        return this.getBody()[0].cell(0)
    }

    getBody(): Row[] {
        if (this.body.length == 0) { return []; }

        return this.body.map((row, i) => {
            return new Row(i, this.header, row)
        });
    }

    nextRow(row: Row): Row | undefined {
        if (row.index >= this.getBody().length) {
            return undefined
        }
        return this.getBody()[row.index + 1]
    }
}