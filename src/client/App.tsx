import React, { useEffect, useState } from 'react';
import * as YAML from 'yaml'
import {Stage, Layer, Group, Rect, Text} from 'react-konva';
import './App.css';
import Cell from './Cell';
import ContextMenu from './Event';
import * as Logic from './sheet';

interface VsCodeApi {
  postMessage(msg: {}): void;
  setState(state: {}): void;
  getState(): {};
}

declare const vscode: VsCodeApi;

type SheetProps = {
  width: number
  height: number
  sheet: Logic.Sheet
  onClick: (i: number, h: string, v: any) => void
}

function insertEditableCell(x: number, y: number, width: number, height: number, data: Logic.CellType): HTMLTextAreaElement {
    let canvas    = document.getElementsByClassName('canvas')[0];
    let canvasPos = canvas.getBoundingClientRect();
    let input     = document.getElementById('input-layer');
    let textarea  = document.createElement('textarea');
    if (input === null) { return textarea; }

    input.appendChild(textarea);
    textarea.value              = data as string;
    textarea.style.position     = 'absolute';
    textarea.style.top          = (canvasPos.y + y) + 'px';
    textarea.style.left         = (canvasPos.x + x) + 'px';
    textarea.style.width        = (width - 10 /*padding*/) + 'px';
    textarea.style.height       = (height - 6)+ 'px';
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

const Sheet: React.FC<SheetProps> = props => {
  var [editCell, setEditCell] = useState({x: -1, y: -1})

  useEffect(() => {
    if (editCell.x < 0 || editCell.y < 0) return

    for (var row of props.sheet.cells) {
      for (var cell of row) {
        if (editCell.x == cell.index.x && editCell.y == cell.index.y) {
          let editableCell = cell

          let textarea = insertEditableCell(
            cell.pos.x,
            cell.pos.y,
            cell.width,
            cell.height,
            cell.value
          );
          textarea.addEventListener('keydown', (e) => {
            console.log('(' + editableCell.index.x + ', ' + editableCell.index.y + ')')
            if (e.keyCode === 13) {
              props.onClick(editableCell.index.y, editableCell.key, textarea.value)
              let input = document.getElementById('input-layer')
              if (input === null) { return; }

              while (input.firstChild) { input.removeChild(input.firstChild); }
              setEditCell({x: editableCell.index.x, y: editableCell.index.y + 1})
            } else if (e.keyCode === 9) { // tab
              props.onClick(editableCell.index.y, editableCell.key, textarea.value)
              let input = document.getElementById('input-layer')
              if (input === null) { return; }

              while (input.firstChild) { input.removeChild(input.firstChild); }
              setEditCell({x: editableCell.index.x + 1, y: editableCell.index.y})
            }
          });
        }
      }
    }
    return (() => {
      let input = document.getElementById('input-layer');
      if (input === null) { return; }
      while (input.firstChild) { input.removeChild(input.firstChild); }
    })
  }, [editCell])

  const table = props.sheet.cells.map ((row, i) => {
    return row.map((cell, j) => {
      return (
        <Cell
          key={i + '-' + j}
          x={cell.pos.x}
          y={cell.pos.y}
          width={cell.width}
          height={cell.height}
          cell={cell}
          onClick={() => {
            setEditCell({x: cell.index.x, y: cell.index.y})
          }}
        />
      )
    })
  })

  return (
    <Group>
      <Rect
        width={props.width}
        height={props.height}
        fill='gray'
      />
      {table}
    </Group>
  );
}

type CanvasProps = {
  sheet: Logic.Sheet
  onClick: (i: number, h: string, v: any) => void
}

const Canvas: React.FC<CanvasProps> = props => {
  var [width, setWidth] = useState(window.innerWidth)
  var [height, setHeight] = useState(window.innerHeight)

  window.addEventListener('resize', (event) => {
    setWidth(window.innerWidth)
    setHeight(window.innerHeight)
  })

  return (
    <Stage className="canvas" width={width} height={height}>
      <Layer>
        <Sheet
          width={width}
          height={height}
          sheet={props.sheet}
          onClick={(i: number, h: string, v: any) => props.onClick(i, h, v)}
        />
      </Layer>
    </Stage>
  );
}

type AppProps = {}

interface AppState {
  yaml: any
  vscode: VsCodeApi
}

class App extends React.Component<AppProps, AppState> {
  sheet: Logic.Sheet

  constructor(props: AppProps) {
    super(props);
    const yaml = YAML.parse("---");
    this.state = {
      yaml: yaml,
      vscode: vscode
    };

    window.addEventListener('message', event => {
      const message = event.data;

      switch (message.command) {
        case 'liml':
          console.log(message.data);
          const newYaml = YAML.parse(message.data);
          if (!Array.isArray(newYaml)) {
            return
          }
          this.setState({yaml: newYaml});
      }
    })
    this.sheet = new Logic.Sheet([], [])
  }

  updateData(id: number, header: string, value: any) {
    const newYaml = this.state.yaml.slice();
    newYaml[id-1][header] = value // header行を抜かしている
    this.setState({yaml: newYaml});
    // send data to editor
    this.state.vscode.postMessage({
      command: 'liml',
      data: YAML.stringify(this.state.yaml)
    })
  }

  render() {
    let header: string[];
    let body: string[][];

    if (!Array.isArray(this.state.yaml)) {
      header = [];
      body = [];
    } else {
      header = Object.keys(this.state.yaml[0]);
      body = this.state.yaml.map((hash) => { return header.map((h) => hash[h]); });
      this.sheet = new Logic.Sheet(header, body)
    }

    return (
      <div className="App">
        <Canvas
          sheet={this.sheet}
          onClick={(i: number, h: string, v: any) => this.updateData(i, h, v)}
        />
        <div id='input-layer'></div>
        <ContextMenu />
      </div>
    );
  }
}

export default App;