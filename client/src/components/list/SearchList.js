import React from 'react'
import './SearchList.css'
import folder from '../../assets/icons/folder.svg'
export const SearchList = ({ value, callback }) => {

    return (
        <div className='parent-list' onClick={e => { callback(value) }}>
            <img src={folder} className='search-result-icon' />
            <div className='search-restult-name' >{value.name}</div>
        </div>

    )
}

