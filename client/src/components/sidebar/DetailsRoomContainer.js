import React from 'react'
import { Icon, ICON_VERY_LARGE } from '../icon/Icon'
import { IconColored } from '../icon/IconColored'

import folder from '../../assets/icons/folder.svg'
import folderIcon from '../../assets/icons/folder.png'
import enable from '../../assets/icons/enable.png'
import disable from '../../assets/icons/disable.png'
import errornote from '../../assets/icons/error.png'
import locked from '../../assets/icons/locked.png'
import unlocked from '../../assets/icons/unlocked.png'
import time from '../../assets/icons/time.png'
import edit from '../../assets/icons/edit.png'

import './DetailsContainer.css'
import { capitalizeName } from '../../util/capitalize_name'
import { isoStrToIndianDateStr } from '../../util/isoToDateTimeString'
import { downloadArchive } from '../../api/api'



export const DetailsRoomContainer = ({ clickevent, data }) => {
    function handleClick(e) {
        // clickevent(e)
    }

    async function downloadClick(e, filename) {
        if (data?.archivename) {
            const response = await downloadArchive(filename)
            if (response.success === true) {
                window.open(response.data.url, 'download');
            }
        }
    }

    function downloadBtn(data) {
        if (data?.archivename) {
            return (
                <div className='parent-link'>
                    <a href="#" className='download-link' onClick={e => { downloadClick(e, data?.archivename) }}>Download archive</a>
                </div>
            )
        } else {
            return <></>
        }
    }
    return (
        <div className='parent-details-container'>

            <div className='icon-div'><Icon src={folder} size={ICON_VERY_LARGE} /></div>
            {/* <div className='edit-div' onClick={(e) => { }}><img src={edit} className='edit-btn'></img></div> */}


            <span className='header-title'>Created By</span>
            <span className='description description-main'>{data.createdBy ? capitalizeName(data.createdBy.name) : "----"}</span>
            {downloadBtn(data)}
            <div className='divider' />

            <span className='other-details '>Other Details</span>
            <div className='mtop-2 vertical-center'>
                <img className='icon-details' src={folderIcon} title="style of set" />
                <span className='description mleft-2 black'>{data.parentSet.setID ? capitalizeName(data.parentSet.setID) : "----"}</span>
            </div>

            <div className='mtop-2 vertical-center'>
                {data.isActive ? <img className='icon-details' src={enable} title="is set active" /> : <img className='icon-details' src={disable} title="is set active" />}
                <span className='description mleft-2 black'>{data.isActive ? "Active" : "InActive"}</span>
            </div>


            <div className='mtop-2 vertical-center'>
                <img className='icon-details' src={data.isZipped ? locked : unlocked} title="is room password protected" />
                <span className='description mleft-2 black'>{data.isZipped ? "Yes" : "No"}</span>
            </div>

            <div className='mtop-2 vertical-center'>
                <img className='icon-details' src={errornote} title="error while zipping" />

                <span className='error-des'>{data.error_zipping ? data.error_zipping : "-----"}</span>

            </div>

            <div className='mtop-2 vertical-center'>
                <img className='icon-details' src={time} title="created at" />
                <span className='description mleft-2 black'>{isoStrToIndianDateStr(data.createdAt)}</span>
            </div>

        </div>
    )
}
