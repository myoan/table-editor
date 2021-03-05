import * as React from 'react';
import {Group, Rect, Text} from 'react-konva';

type CellProps = {
  x: number
  y: number
  width: number
  height: number
  text: string
  onClick: (v: any) => void
}

const Cell: React.FC<CellProps> = props => {
  return React.createElement(
    Group,
    {},
    React.createElement(
      Rect,
      {
        x: props.x,
        y: props.y,
        width: props.width,
        height: props.height,
        fill: 'white'
      }
    ),
    React.createElement(
      Text,
      {
        text: props.text,
        x: props.x+5,
        y: props.y+5,
        fontSize: 20
      }
    ),
    React.createElement(
      Rect,
      {
        x: props.x,
        y: props.y,
        width: props.width,
        height: props.height,
        fill: 'rgba(0, 0, 0, 0)',
        onClick: () => {
          console.log('cell clicked');
          let canvas = document.getElementsByClassName('canvas')[0];
          let canvasPos = canvas.getBoundingClientRect();
          let input = document.getElementById('input-layer');
          let textarea = document.createElement('textarea');
          if (input === null) { return }

          input.appendChild(textarea);
          textarea.value = props.text;
          textarea.style.position = 'absolute';
          textarea.style.top = (canvasPos.y + props.y) + 'px';
          textarea.style.left = (canvasPos.x + props.x) + 'px';
          textarea.style.width = (props.width - 10 /*padding*/) + 'px';
          textarea.style.height = (props.height - 6)+ 'px';
          textarea.style.fontSize = '20px';
          textarea.style.fontFamily = 'Arial';
          textarea.style.border = 'none';
          textarea.style.padding = '3px 5px';
          textarea.style.margin = '0px';
          textarea.style.overflow = 'hidden';
          textarea.style.background = 'white';
          textarea.style.outline = 'none';
          textarea.style.resize = 'none';
          textarea.addEventListener('keydown', (e) => {
            if (e.keyCode === 13) {
              console.log('press enter')
              console.log(textarea.value);
              props.onClick(textarea.value);
              let input = document.getElementById('input-layer');
              if (input === null) { return }

              while (input.firstChild) { input.removeChild(input.firstChild); }
            }
          });
        }
      }
    )
  );
}

export default Cell;