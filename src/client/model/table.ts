import * as sheet from './sheet'
import * as lemur from '../lib/framework'
import {Position, TableIndex} from '../lib/util'
import { posix } from 'node:path'

export type CellType = string | number | boolean | undefined

export class CellUI {
  x:      number
  y:      number
  width:  number
  height: number
  data:   Cell

  constructor(x: number, y: number, w: number, h: number, data: Cell) {
    this.x = x
    this.y = y
    this.width = w
    this.height = h
    this.data = data
  }

  index(): TableIndex {
    return this.data.index
  }

  isInclude(pos: Position): boolean {
    if (pos.x < this.x || (this.x + this.width) < pos.x) { return false}
    if (pos.y < this.y || (this.y + this.height) < pos.y) { return false}

    return true
  }
}

export class TableUI {
  static readonly HEAD_CELL_ROW_SIZE = 50
  static readonly BODY_CELL_ROW_SIZE = 150
  static readonly HEAD_CELL_COL_SIZE = 30
  static readonly BODY_CELL_COL_SIZE = 30
  static readonly HEAD_LINE_SIZE = 3
  static readonly BODY_LINE_SIZE = 1

  rowCellSizes: number[]
  colCellSizes: number[]
  table: Table

  constructor(header: string[], body: CellType[][]) {
    this.rowCellSizes = []
    this.colCellSizes = []
    this.table = new Table(header, body)
    this.updateCellSize()
  }

  setRowSize(index: number, size: number) {
    this.rowCellSizes[index] = size
  }

  setColSize(index: number, size: number) {
    this.colCellSizes[index] = size
  }

  rowSize(): number{
    return this.table.rowSize()
  }

  columnSize(): number{
    return this.table.columnSize()
  }

  updateCellSize() {
    this.rowCellSizes = Array(this.rowSize()).fill(TableUI.BODY_CELL_ROW_SIZE)
    this.colCellSizes = Array(this.columnSize()).fill(TableUI.BODY_CELL_COL_SIZE)
  }

  cells(): CellUI[][] {
    let cells: CellType[][] = [this.table.header]
    cells = cells.concat(this.table.body)
    cells = cells.map((row, i) => {
      let newRow: CellType[] = [i]
      return newRow.concat(row)
    })
    return cells.map((row, i) => {
      return row.map((c, j) => {
        return new CellUI(0, 0, 100, 100,
          {
            key: this.table.header[j],
            value: c,
            index: {x: j, y: i}
          }
        )
      })
    })
  }

  x(index: number): number {
    if (index == 0) { return 0 }

    let rowSizeSum = this.rowCellSizes.slice(0, index).reduce((acc, cur) => acc + cur)
    return rowSizeSum + TableUI.BODY_LINE_SIZE * index
  }

  y(index: number): number {
    if (index == 0) { return 0 }

    let colSizeSum = this.colCellSizes.slice(0, index).reduce((acc, cur) => acc + cur)
    return colSizeSum + TableUI.HEAD_LINE_SIZE + TableUI.BODY_LINE_SIZE * (index - 1)
  }

  cell(indexX: number, indexY: number): CellUI {
    return new CellUI(
      this.x(indexX),
      this.y(indexY),
      this.colCellSizes[indexX],
      this.rowCellSizes[indexY],
      this.table.cell(indexX, indexY)
    )
  }

  insertRow(idx: number, cells: CellType[]) {
    this.table.insertRow(idx, cells)
    this.rowCellSizes.splice(idx, 0, TableUI.BODY_CELL_ROW_SIZE)
  }

  insertColumn(idx: number, key: string, cells: CellType[]) {
    this.table.insertColumn(idx, key, cells)
    this.colCellSizes.splice(idx, 0, TableUI.BODY_CELL_COL_SIZE)
  }

  deleteRow(idx: number) {
    this.table.deleteRow(idx)
    this.rowCellSizes.splice(idx, 1)
  }

  deleteColumn(idx: number) {
    this.table.deleteColumn(idx)
    this.colCellSizes.splice(idx, 1)
  }

  insertAbove(cell: CellUI) {
    const cells: CellType[] = Array(this.columnSize()).fill('')
    this.insertRow(cell.data.index.y - 1, cells)
  }

  insertBelow(cell: CellUI) {
    const cells: CellType[] = Array(this.columnSize()).fill('')
    this.insertRow(cell.data.index.y, cells)
  }

  insertRight(cell: CellUI) {
    const cells: CellType[] = Array(this.rowSize()).fill('')
    this.insertRow(cell.data.index.x, cells)
  }

  insertLeft(cell: CellUI) {
    const cells: CellType[] = Array(this.rowSize()).fill('')
    this.insertRow(cell.data.index.x + 1, cells)
  }

  columnHeader(cell: CellUI): CellUI {
    return this.cell(cell.data.index.x, 0)
  }

  rowHeader(cell: CellUI): CellUI {
    return this.cell(0, cell.data.index.y)
  }
}

class Cell {
  key: string
  value: CellType
  index: TableIndex
  constructor(key: string, value: CellType, index: TableIndex) {
    this.key   = key
    this.value = value
    this.index = index
  }
}

export class Table {
  header: string[]
  body:   CellType[][]

  constructor(header: string[], body: CellType[][]) {
    this.header = header
    this.body   = body
  }

  cell(x: number, y: number): Cell {
    return new Cell(this.header[x], this.body[y][x], {x: x, y: y});
  }

  cells(): Cell[][] {
    return this.body.map((row, i) => {
      return row.map((cell, j) => {
        return new Cell(this.header[j], cell, {x: j, y: i});
      });
    });
  }

  columnSize():number {
    return this.header.length
  }

  rowSize(): number {
    return this.body.length
  }

  insertRow(idx: number, row: CellType[]) {
    if (idx > this.body.length) { throw 'index exceeds table row size' }

    this.body.splice(idx, 0, row)
  }

  insertColumn(idx: number, key: string, col: CellType[]) {
    if (col.length != this.body.length) { throw "column is different from column size" }
    if (idx > this.body.length) { throw "index exceeds table column size" }

    this.header.splice(idx, 0, key)
    this.body.map((row, i) => {
        row.splice(idx, 0, col[i])
    })
  }

  deleteRow(idx: number) {
    if (idx >= this.body.length) { throw 'index exceeds table row size' }

    this.body.splice(idx, 1)
  }

  deleteColumn(idx: number) {
    if (idx >= this.body.length) { throw "index exceeds table column size" }

    this.header.splice(idx, 1)
    this.body.map((row) => {
        row.splice(idx, 1)
    })
  }

  insertAbove(cell: Cell) {
    const cells: CellType[] = Array(this.columnSize()).fill('')
    this.insertRow(cell.index.y - 1, cells)
  }

  insertBelow(cell: Cell) {
    const cells: CellType[] = Array(this.columnSize()).fill('')
    this.insertRow(cell.index.y, cells)
  }

  insertLeft(cell: Cell) {
    const cells: CellType[] = Array(this.rowSize()).fill('')
    this.insertRow(cell.index.x, cells)
  }

  insertRight(cell: Cell) {
    const cells: CellType[] = Array(this.rowSize()).fill('')
    this.insertRow(cell.index.x + 1, cells)
  }
}

export class TableModel extends lemur.Model {
  header: string[]
  s:      sheet.Sheet
  table: TableUI

  constructor(header: string[], body: CellType[][]) {
    super()
    this.header = header
    this.s      = new sheet.Sheet(header, body)
    this.table  = new TableUI(header, body)

    this.onFileChanged()
  }

  onFileChanged() {
    this.notify('fileChanged')
  }

  refresh() {
    this.onFileChanged()
  }
}
