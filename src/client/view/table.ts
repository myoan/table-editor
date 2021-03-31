import * as lemur from '../lib/framework'
import {Position, TableIndex} from '../lib/util'
import {Cell, Command} from '../presenter/table'
import * as sheet from '../model/sheet'

export class TableView extends lemur.View {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  pos: Position
  data: any

  constructor() {
    console.log('TableView!!')
    super()
    this.canvas = <HTMLCanvasElement>document.getElementById("sheet")
    this.canvas.width = 2000
    this.canvas.height = 2000
    // this.canvas.width = window.innerWidth
    // this.canvas.height = window.innerHeight

    this.pos = {x: 0, y: 0}
    this.data = null
    this.ctx = this.canvas.getContext("2d")!

    this.setupEventListener()
  }

  render(cells: Cell[][]) {
    console.log('render')

    cells.map((row) => {
      row.map((cell) => {
        this.ctx.fillStyle = "white"
        this.ctx.fillRect(cell.pos.x, cell.pos.y, cell.width, cell.height);
        this.ctx.fillStyle = "black"
        this.ctx.font = '20px Arial'
        this.ctx.fillText(cell.data, cell.pos.x + 5, cell.pos.y + 20);
      })
    })
  }

  renderMenu(cell: sheet.Cell, pos: Position, commands: Command[]) {
    let input = document.getElementById('input-layer')!;
    while (input.firstChild) { input.removeChild(input.firstChild); }
    let menu  = document.createElement('div');
    menu.classList.add('menu')
    input.appendChild(menu)

    menu.style.top = `${pos.y}px`
    menu.style.left = `${pos.x}px`
    menu.style.position = 'fixed'

    let ul = document.createElement('ul')
    menu.appendChild(ul)

    for (let cmd of commands) {
      let li = document.createElement('li')
      let node = document.createTextNode(cmd.title)
      li.appendChild(node)
      ul.appendChild(li)
      li.addEventListener('click', e => {
        console.log(`clicked: ${cmd.title}`)
        cmd.callback(cell)
        while (input.firstChild) { input.removeChild(input.firstChild); }
        this.notify('refresh')
      })
    }
  }

  clearInputLayer() {
    let input = document.getElementById('input-layer')!;
    while (input.firstChild) { input.removeChild(input.firstChild); }
  }

  renderSelectedCell(cell: Cell) {
    this.ctx.strokeStyle = "green"
    this.ctx.strokeRect(cell.pos.x, cell.pos.y, cell.width, cell.height);
  }

  colorizeCell(cell: Cell) {
    this.ctx.fillStyle = "gray"
    this.ctx.fillRect(cell.pos.x, cell.pos.y, cell.width, cell.height);
    this.ctx.fillStyle = "black"
    this.ctx.font = '20px Arial'
    this.ctx.fillText(cell.data, cell.pos.x + 5, cell.pos.y + 20);
  }

  setupEventListener() {
    this.canvas.addEventListener("click", (e) => {
      this.capturePosition(e)
      this.notify('clicked') // TODO: notify with clicked event
    })
    this.canvas.addEventListener("dblclick", (e) => {
      this.capturePosition(e)
      this.notify('doubleClicked') // TODO: notify with clicked event
    })
    this.canvas.addEventListener("contextmenu", (e) => {
      e.preventDefault()

      this.capturePosition(e)
      this.notify('rightClicked')
    })
    this.canvas.addEventListener("mouseup", (e) => {
      this.capturePosition(e)
      this.notify('mouseUped')
    })
    this.canvas.addEventListener("mousedown", (e) => {
      this.capturePosition(e)
      this.notify('mouseDowned')
    })
    this.canvas.addEventListener("mousemove", (e) => {
      this.capturePosition(e)
      this.notify('mouseMoved')
    })
    window.addEventListener('message', e => {
      this.data = e.data;
      this.notify('message')
    })
  }

  capturePosition(e: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect()
    this.pos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  getCanvasWidth(): number {
    return 100
  }
  getCanvasHeight(): number {
    return 120
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  refresh() {
    this.notify('refresh')
  }
}