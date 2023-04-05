import React from 'react'
import './EmptyDiv.css'
import InfoIcon from '../../assets/icons/detail-big.svg'
import { ICON_LARGE, Icon } from '../icon/Icon'

export const EmptyDiv = () => {
    return (
        <div className='parent-empty-div'>
            <img className='icon-colored-big' src={InfoIcon} />
            <span>Select A Folder to View Details</span>
        </div>
    )
}
