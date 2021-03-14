import * as React from 'react';
import * as YAML from 'yaml'
import {Stage, Layer, Group, Rect, Text} from 'react-konva';
import './App.css';
import Cell from './Cell';
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

const Sheet: React.FC<SheetProps> = props => {
  const table = props.sheet.cells.map ((row, i) => {
    return row.map((cell) => {
      return (
        <Cell
          key={i}
          x={cell.x}
          y={cell.y}
          width={cell.width}
          height={cell.height}
          cell={cell}
          onClick={(v: any) => props.onClick(i, cell.key, v)}
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
  const width = window.innerWidth;
  const height = window.innerHeight;
  console.log('width: ' + width + ', height: ' + height);
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
      </div>
    );
  }
}

export default App;