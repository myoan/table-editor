import React, { useEffect, useState } from 'react';
import {Group, Rect, Text} from 'react-konva';
import * as Logic from './sheet';

export type CellProps = {
    x: number
    y: number
    width: number
    height: number
    cell: Logic.Cell
    onClick: () => void
};

const Cell: React.FC<CellProps> = props => {
    return (
        <Group>
            <Rect
                x={props.x}
                y={props.y}
                width={props.width}
                height={props.height}
                fill='rgb(200,200,200)'
            />
            <Text
                text={props.cell.value as string}
                x={props.x + 5}
                y={props.y + 5}
                fontSize={20}
            />
            <Rect
                x={props.x}
                y={props.y}
                width={props.width}
                height={props.height}
                fill='rgba(0,0,0,0)'
                onClick={() => {
                    // TODO: Select Cell, but not editable
                    console.log('cell clicked!!')
                }}
                onDblClick={() => props.onClick() }
            />
        </Group>
    )
}

export default Cell;