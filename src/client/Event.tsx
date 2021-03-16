import React, { useEffect, useState } from 'react';

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
            <ul
                className="menu"
                style={{ top: y, left: x, position: 'fixed' }}
            >
                <li>Insert up Line</li>
                <li>Insert down Line</li>
            </ul>
        );
    } else {
        return null
    }
}

export default ContextMenu;