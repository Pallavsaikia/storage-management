import React from 'react'
import './ActivityList.css'
import edit from '../../assets/icons/edit.png'
import folderadd from '../../assets/icons/folder-add.png'
import deleteIcon from '../../assets/icons/delete.png'
import upload from '../../assets/icons/upload.png'
import { capitalizeName } from '../../util/capitalize_name'
import { isoStrToIndianDateStr } from '../../util/isoToDateTimeString'
import { getUploadTypeString } from '../../util/upload_type'
export const ActivityList = ({ activitydata }) => {

    function activityString(activitydata) {
        if (activitydata.action === "Modify") {
            return capitalizeName(activitydata.actor.name) + ' edited the folder details'
        }
        if (activitydata.action === "Upload") {
            if (activitydata.room != null) {
                return capitalizeName(activitydata.actor.name) + ' uploaded "' + activitydata.upload[0].filename + '" to the room "' + activitydata.room.roomID + '" ('+getUploadTypeString(activitydata.upload[0].uploadType)+')'
            } else {
                return capitalizeName(activitydata.actor.name) + ' uploaded "' + activitydata.upload[0].filename + '" to a room ('+getUploadTypeString(activitydata.upload[0].uploadType)+')'
            }

        }
        if (activitydata.action === "Delete") {
            return capitalizeName(activitydata.actor.name) + ' deleted the room "' + activitydata.deletedObj.name + '"'
        }
        if (activitydata.action === "Add") {
            if (activitydata.room != null) {
                return capitalizeName(activitydata.actor.name) + ' added the room "' + activitydata.room.roomID + '"'
            } else {
                return capitalizeName(activitydata.actor.name) + ' added a room that was deleted later'
            }

        }

    }

    return (
        <div className='root-activity-card'>
            <span className='date'>{isoStrToIndianDateStr(activitydata.createdAt)}</span>
            <div className='flex-div'>
                <div className='image-background'>
                    {activitydata.action === "Modify" ? <img src={edit} className='action-icon'></img> : null}
                    {activitydata.action === "Upload" ? <img src={upload} className='action-icon'></img> : null}
                    {activitydata.action === "Delete" ? <img src={deleteIcon} className='action-icon'></img> : null}
                    {activitydata.action === "Add" ? <img src={folderadd} className='action-icon'></img> : null}
                </div>
                <span className='details-span'>{activityString(activitydata)}</span>
            </div>

        </div>
    )
}
