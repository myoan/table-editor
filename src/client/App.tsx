import * as React from 'react';
import * as YAML from 'yaml'
import {Stage, Layer, Group, Rect, Text} from 'react-konva';
import './App.css';
import Cell from './Cell';

interface VsCodeApi {
  postMessage(msg: {}): void;
  setState(state: {}): void;
  getState(): {};
}

declare const vscode: VsCodeApi;

type RowProps = {
  idx: number
  width: number
  height: number
  header: string[]
  data: string[]
  onClick: (h: string, v: any) => void
}

const Row: React.FC<RowProps> = props => {
  const cells = props.data.map((value, i) => {
    const w = props.width;
    const h = props.height;
    const x = w * i;
    const y = h * props.idx;
    return (
      <Cell
        key={i}
        x={x+i+1}
        y={y+props.idx+1}
        width={w}
        height={h}
        text={value}
        onClick={(v: any) => props.onClick(props.header[i], v)}
      />
    );
  })
  return (
    <Group>
      {cells}
    </Group>
  );
}

type SheetProps = {
  width: number
  height: number
  header: string[]
  body: string[][]
  onClick: (i: number, h: string, v: any) => void
}

function tableData(header: string[], body: string[][]): string[][] {
  return [header].concat(body);
}

const Sheet: React.FC<SheetProps> = props => {
  const table = tableData(props.header, props.body).map((row, i) => {
    return (
      <Row
        key={i}
        idx={i}
        width={150}
        height={30}
        header={props.header}
        data={row}
        onClick={(h: string, v: any) => props.onClick(i, h, v)}
      />
    );
  });
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
  header: string[]
  body: string[][]
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
          header={props.header}
          body={props.body}
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
    }

    return (
      <div className="App">
        <Canvas
          header={header}
          body={body}
          onClick={(i: number, h: string, v: any) => this.updateData(i, h, v)}
        />
        <div id='input-layer'></div>
      </div>
    );
  }
}

export default App;