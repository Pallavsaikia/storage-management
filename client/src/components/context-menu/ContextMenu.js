import { React, useState } from 'react'
import { ContextMenuContext } from '../../context/ContextMenuContext'
import './ContextMenu.css'
import { capitalizeName } from '../../util/capitalize_name'
import { Icon } from '../icon/Icon'
export function MenuItem(item, icon, callback) {
    return {
        icon: icon,
        item: item,
        callback: callback
    }
}



export const ContextMenu = ({ children }) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const [posX, setPosX] = useState(0);
    const [posY, setPosY] = useState(0);
    const [menuList, setMenuList] = useState(null);

    function addMenuList(menu) {
        //menu is array of MenuList

        var menuListInner = []
        if (menu != null) {
            for (let i = 0; i < menu.length; i++) {
                menuListInner.push(
                    <div className="menuitem" key={i}  onClick={e => menu[i].callback()}>
                        <Icon src={menu[i].icon} />
                        <span className="menuText">{capitalizeName(menu[i].item)}</span>
                    </div>)
            }
        }
        return menuListInner

    }

    var divStyle = {
        left: posX + 'px',
        top: posY + 'px',
    }

    
    function menuUI() {
        
        if (menuVisible == false) {
            return (<div></div>)
        } else {
            return (
                
                <div className="shadow contextMenu" style={divStyle} onContextMenu={e=>{e.preventDefault()}}    >
                    <div className="menuHeader">Menu</div>
                    {addMenuList(menuList)}
                </div>
                
            )
        }
    }

    return (
        <ContextMenuContext.Provider value={{ setMenuVisible, setMenuList, setPosX, setPosY }}>
            {children}
            {menuUI()}
        </ContextMenuContext.Provider>
    )
}
