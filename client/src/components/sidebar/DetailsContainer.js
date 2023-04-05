import React from 'react'
import { Icon, ICON_VERY_LARGE } from '../icon/Icon'
import { IconColored } from '../icon/IconColored'

import folder from '../../assets/icons/folder.svg'
import styleIcon from '../../assets/icons/style-icon.png'
import enable from '../../assets/icons/enable.png'
import disable from '../../assets/icons/disable.png'
import gltfIcon from '../../assets/icons/glasses.png'
import note from '../../assets/icons/note.png'
import qc from '../../assets/icons/qc.png'
import time from '../../assets/icons/time.png'
import edit from '../../assets/icons/edit.png'

import './DetailsContainer.css'
import { capitalizeName } from '../../util/capitalize_name'
import { isoStrToIndianDateStr } from '../../util/isoToDateTimeString'


export const DetailsContainer = ({clickevent, data }) => {
    return (
        <div className='parent-details-container'>

            <div className='icon-div'><Icon src={folder} size={ICON_VERY_LARGE} /></div>
            <div className='edit-div' onClick={(e)=>{clickevent(e)}}><img src={edit} className='edit-btn'></img></div>

            <span className='header-title'>Uploaded By</span>
            <span className='description description-main'>{data.uploadedBy ? capitalizeName(data.uploadedBy.name) : "----"}</span>
            <div className='divider' />

            <span className='header-title'>Created By</span>
            <span className='description description-main'>{data.createdBy ? capitalizeName(data.createdBy.name) : "----"}</span>
            <div className='divider' />
            <span className='other-details '>Other Details</span>
            <div className='mtop-2 vertical-center'>
                <img className='icon-details' src={styleIcon} title="style of set" />
                <span className='description mleft-2 black'>{data.style ? capitalizeName(data.style) : "----"}</span>
            </div>

            <div className='mtop-2 vertical-center'>
            {data.isActive ? <img className='icon-details' src={enable} title="is set active" /> : <img className='icon-details' src={disable} title="is set active" />}
                <span className='description mleft-2 black'>{data.isActive ? "Active" : "InActive"}</span>
            </div>

            <div className='mtop-2 vertical-center'>
                <img className='icon-details' src={gltfIcon} title="are rooms in set converted to gltf" />
                <span className='description mleft-2 black'>{data.isGLTFDone ? "Yes" : "No"}</span>
            </div>

            <div className='mtop-2 vertical-center'>
                <img className='icon-details' src={qc} title="is qc done on rooms in set" />
                <span className='description mleft-2 black'>{data.isQCDone ? "Yes" : "No"}</span>
            </div>

            <div className='mtop-2 vertical-center'>
                <img className='icon-details' src={note} title="any remarks on sets" />
                <span className='description mleft-2 black'>{data.remarks ? data.remarks : "-----"}</span>
            </div>

            <div className='mtop-2 vertical-center'>
                <img className='icon-details' src={time} title="created at" />
                <span className='description mleft-2 black'>{isoStrToIndianDateStr(data.createdAt)}</span>
            </div>

        </div>
    )
}
