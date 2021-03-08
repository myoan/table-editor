import React, { useEffect, useState } from 'react';
import {Group, Rect, Text} from 'react-konva';

export type CellProps = {
    x: number
    y: number
    width: number
    height: number
    text: string
    onClick: (v: any) => void
};

function InsertEditableCell(x: number, y: number, width: number, height: number, text: string): HTMLTextAreaElement {
    let canvas    = document.getElementsByClassName('canvas')[0];
    let canvasPos = canvas.getBoundingClientRect();
    let input     = document.getElementById('input-layer');
    let textarea  = document.createElement('textarea');
    if (input === null) { return textarea; }

    input.appendChild(textarea);
    textarea.value              = text;
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

    return textarea;
}

const Cell: React.FC<CellProps> = props => {
    useEffect(() => {
        let textarea = InsertEditableCell(props.x, props.y, props.width, props.height, props.text);
        textarea.addEventListener('keydown', (e) => {
            if (e.keyCode === 13) {
                console.log(textarea.value);
                props.onClick(textarea.value);
                let input = document.getElementById('input-layer');
                if (input === null) { return; }

                while (input.firstChild) { input.removeChild(input.firstChild); }
            }
        });
    })

    return (
        <Group>
            <Rect
                x={props.x}
                y={props.y}
                width={props.width}
                height={props.height}
                fill='white'
            />
            <Text
                text={props.text}
                x={props.x + 5}
                y={props.y + 5}
                fontSize={20}
            />
        </Group>
    )
}

export default Cell;