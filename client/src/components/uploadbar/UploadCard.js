import React from 'react'
import ProgressBar from '../progressbar/ProgressBar'
import './UploadBar.css'
import done from '../../assets/icons/done.png'
import { SpinnerInfo } from '../spinner/SpinnerInfo'
import camericon from '../../assets/icons/camera-fill-light.svg'
import qcrendericon from '../../assets/icons/qc-render.svg'
import qcscreenshotICON from './../../assets/icons/qc-img.svg'
import zipICON from './../../assets/icons/zip-img.svg'
import { FILETYPES } from '../../util/UPLOAD_FOLDER_DATA'
export const UploadCard = ({ progress, file, type }) => {

    function progressFlagUi(progress) {
        if (progress === 'done') {
            return (<img className="done-upload" src={done} />)
        } else if (progress === 100 || progress === 0.1) {
            return (<SpinnerInfo />)
        }
    }
    function geticon(type) {
        if (type.name === FILETYPES.render.name) {
            return camericon
        }
        if (type.name === FILETYPES.qcrender.name) {
            return qcrendericon
        }
        if (type.name === FILETYPES.qcscreenshot.name) {
            return qcscreenshotICON
        }
        if (type.name === FILETYPES.archive.name) {
            return zipICON
        }
    }
    return (
        <>
            {progress !== null && <div className='upload-detail-parent-div'>
                <div className='upload-detail-div'>
                    {/* <span className='upload-details'> {file ? file : ''} ({type ? type?.name : ''})</span> */}
                    <div className='icon-file-div'>
                        <img className='upload-type-icon' src={geticon(type)} />
                        <span className='upload-details'> {file ? file : ''} </span>
                    </div>
                    {progressFlagUi(progress)}
                </div>

                <ProgressBar top={10} bgcolor="#bb5600" progress={progress ? progress : 0} height={5}></ProgressBar>

            </div>}
        </>
    )
}
