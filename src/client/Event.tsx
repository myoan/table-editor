import React, { useEffect, useState } from 'react';
import './event.scss';

type ContextMenuProps = {}

const ContextMenu: React.FC<ContextMenuProps> = props => {
    var [state, setState] = useState({x: '', y: '', showMenu: false});

    useEffect(() => { 
        document.addEventListener("click", (e) => {
            if (state.showMenu) setState({x: '', y: '', showMenu: false})
        });
        document.addEventListener("contextmenu", (e) => {
            e.preventDefault()

            setState({
                x: e.pageX + 'px',
                y: e.pageY + 'px',
                showMenu: true
            })
        });
        // return (() =>
        //     document.removeEventListener("contextmenu", contextMenuHandler)
        // )
    })
    const {showMenu, x, y} = state;
    console.log(`showmenu: ${showMenu}, (${x}, ${y})`)
    if (showMenu) {
        return (
            <div
            className="menu"
            style={{
                top: y,
                left: x,
                position: 'fixed',
            }} >
                <ul>
                    <li onClick={() => console.log('hello clcik')} >Insert line above</li>
                    <li>Insert line below</li>
                    <li>Delete column</li>
                    <li>Delete line</li>
                    <li>Copy</li>
                    <li>Peste</li>
                    <li>Cut</li>
                    <li>Clear</li>
                </ul>
            </div>
        );
    } else {
        return null
    }
}

export default ContextMenu;