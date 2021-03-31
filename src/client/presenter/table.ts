import * as YAML from 'yaml'
import * as lemur from '../lib/framework'
import {Position, TableIndex} from '../lib/util'

import * as sheet from '../model/sheet'
import {TableModel, CellUI} from '../model/table'
import {TableView} from '../view/table'

interface VsCodeApi {
  postMessage(msg: {}): void;
  setState(state: {}): void;
  getState(): {};
}

declare const vscode: VsCodeApi;

export type Cell = {
  pos: Position,
  index: TableIndex,
  width: number,
  height: number,
  data: string,
}

export type Command = {
  title: string
  callback: (cell: sheet.Cell) => void
}

const cmdInsertAbove = {
  title: 'insert line above',
  callback: (cell: sheet.Cell) => cell.insertAbove()
}

const cmdInsertBelow = {
  title: 'insert line below',
  callback: (cell: sheet.Cell) => cell.insertBelow()
}

const cmdInsertLeft = {
  title: 'insert line left',
  callback: (cell: sheet.Cell) => cell.insertLeft()
}

const cmdInsertRight = {
  title: 'insert line right',
  callback: (cell: sheet.Cell) => cell.insertRight()
}

const cmdDeleteRow = {
  title: 'delete row',
  callback: (cell: sheet.Cell) => cell.deleteRow()
}

const cmdDeleteColumn = {
  title: 'delete column',
  callback: (cell: sheet.Cell) => cell.deleteCol()
}

const cmdCopyCell = {
  title: 'copy',
  callback: (cell: sheet.Cell) => {
    console.log('execute copy')
  }
}

const cmdPasteCell = {
  title: 'paste',
  callback: (cell: sheet.Cell) => {
    console.log('execute paste')
  }
}

const cmdCutCell = {
  title: 'cut',
  callback: (cell: sheet.Cell) => {
    console.log('execute cut')
  }
}

export class TablePresenter extends lemur.Presenter {
  static readonly DEFAULT_CELL_WIDTH  = 150
  static readonly DEFAULT_CELL_HEIGHT = 30

  model: TableModel
  view:  TableView
  cells: Cell[][]
  width: number
  height: number

  constructor(model: TableModel, view: TableView) {
    super()
    this.model = model
    this.view  = view

    this.cells = []
    this.width = view.getCanvasWidth()
    this.height = view.getCanvasHeight()
  }

  update(key: string, s: lemur.Subject) {
    let view: TableView
    let cell: Cell | null
    let sCell: sheet.Cell
    switch(key) {
      case 'fileChanged':
        this.render()
        break;
      case 'clicked':
        view = s as TableView
        cell = this.findCellByPosition(view.pos)
        if (cell == null) { return }

        view.refresh()
        view.renderSelectedCell(cell)

        sCell = this.model.s.cell(cell.index.x, cell.index.y)
        view.colorizeCell(this.getLineHeader(sCell.column()))
        view.colorizeCell(this.getLineHeader(sCell.row()))
        break
      case 'doubleClicked':
        view = s as TableView
        cell = this.findCellByPosition(view.pos)
        if (cell == null) { return }

        let ta = this.insertEditableCell(cell)
        ta.addEventListener('keydown', (e) => {
          if (cell == null) { return }

          if (e.keyCode === 13) {
            sCell = this.model.s.cell(cell.index.x, cell.index.y)
            sCell.value = ta.value
            let input  = document.getElementById('input-layer');
            if (input == null) { return }

            while (input.firstChild) { input.removeChild(input.firstChild); }
            this.updateData()
            this.render()
            // setEditCell({x: editableCell.index.x, y: editableCell.index.y + 1})
          }
        })
        break;
      case 'rightClicked':
        view = s as TableView
        cell = this.findCellByPosition(view.pos)
        if (cell == null) { return }

        sCell = this.model.s.cell(cell.index.x, cell.index.y)
        const array: Command[] = [
          cmdInsertAbove,
          cmdInsertBelow,
          cmdInsertLeft,
          cmdInsertRight,
          cmdDeleteColumn,
          cmdDeleteRow,
          cmdCopyCell,
          cmdPasteCell,
          cmdCutCell,
        ]
        view.renderMenu(sCell, view.pos, array)
        break
      case 'refresh':
        this.render()
        break
      case 'mouseUped':
        view = s as TableView
        cell = this.findCellByPosition(view.pos)
        if (cell == null) { return }

        view.refresh()
        view.renderSelectedCell(cell)
        break
      case 'mouseDowned':
        break
      case 'mouseMoved':
        break
      case 'message':
        view = s as TableView
        let msg = view.data
        switch(msg.command) {
          case 'liml':
            console.log('get message');
            console.log(msg.data);
            const newYaml = YAML.parse(msg.data);
            if (!Array.isArray(newYaml)) { return }

            let header = Object.keys(newYaml[0]);
            let body = newYaml.map((hash) => { return header.map((h) => hash[h]); });
            this.model = new TableModel(header, body)
            this.render()
            break;
        }
        break
    }
  }

  updateData() {
    vscode.postMessage({
      command: 'liml',
      data: YAML.stringify(this.model.s.toHash())
    })
  }

  getLineHeader(line: sheet.Line): Cell {
    const h = line.cells[0]
    return {
      pos: {x: h.pos.x, y: h.pos.y},
      index: {x: h.index.x, y: h.index.y},
      width: h.width,
      height: h.height,
      data: h.value as string
    }
  }

  // TODO: viewerに移動
  insertEditableCell(cell: Cell): HTMLTextAreaElement {
    let canvas    = <HTMLCanvasElement>document.getElementById("sheet")
    let canvasPos = canvas.getBoundingClientRect();
    let input     = document.getElementById('input-layer');
    let textarea  = document.createElement('textarea');
    if (input === null) { return textarea; }

    while (input.firstChild) { input.removeChild(input.firstChild); }
    console.log('find textareas')

    input.appendChild(textarea);
    textarea.value              = cell.data
    textarea.style.position     = 'absolute'
    textarea.style.top          = (canvasPos.y + cell.pos.y) + 'px';
    textarea.style.left         = (canvasPos.x + cell.pos.x) + 'px';
    textarea.style.width        = (cell.width - 10 /*padding*/) + 'px';
    textarea.style.height       = (cell.height - 6)+ 'px';
    textarea.style.fontSize     = '20px';
    textarea.style.fontFamily   = 'Arial';
    textarea.style.border       = 'none';
    textarea.style.padding      = '3px 5px';
    textarea.style.margin       = '0px';
    textarea.style.overflow     = 'hidden';
    textarea.style.background   = 'white';
    textarea.style.outlineColor = 'green';
    textarea.style.resize       = 'none';
    textarea.focus()

    return textarea;
  }

  render() {
    this.view.clearCanvas()
    this.view.clearInputLayer()
    this.insertCells()
    this.view.render(this.cells)
  }

  insertCells() {
    this.cells = this.model.s.table().map((row) => {
      return row.map((cell) => {
        return this.insertCell(cell.pos.x, cell.pos.y, cell.index.x, cell.index.y, cell.width, cell.height, cell.value)
      });
    })
  }

  insertCell(x: number, y: number, ix: number, iy: number, w: number, h: number, data: sheet.CellType): Cell {
    return {
      pos: {x: x, y: y},
      index: {x: ix, y: iy},
      width: w,
      height: h,
      data: data as string
    }
  }

  findCellByPosition(pos: Position): Cell | null {
    for (var row of this.cells) {
      for (var cell of row) {
        if (cell.pos.x <= pos.x && cell.pos.y <= pos.y && (cell.pos.x + cell.width) > pos.x && (cell.pos.y + cell.height) > pos.y) {
          return cell
        }
      }
    }
    return null
  }

  findCellByPosition2(pos: Position): CellUI | null {
    for (var row of this.model.table.cells()) {
      for (var cell of row) {
        if (cell.isInclude(pos)) {
          return cell
        }
      }
    }
    return null
  }
}
