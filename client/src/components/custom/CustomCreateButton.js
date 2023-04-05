import React from 'react'
import { SubmitButton } from '../form/buttons/SubmitButton'
import { Icon } from '../icon/Icon'
import { IconColored } from '../icon/IconColored'
import './CustomCreateButton.css'
export const CustomCreateButton = ({ children,danger, hideBtn, callback, text, icon }) => {
    return (
        <div className='custom-create-div'>

            {!hideBtn && <div className={`add-btn${danger?'-red':''}`} onClick={callback}>
                <IconColored src={icon} />

                <span>{text}</span>
            </div>}




            <div className='line' />
            {children}
        </div>
    )
}
