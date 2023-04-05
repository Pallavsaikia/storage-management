import React from 'react'
import './FileCard.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import renderICON from './../../assets/icons/camera-fill-light.svg'
import qcRenderICON from './../../assets/icons/qc-render.svg'
import qcscreenshotICON from './../../assets/icons/qc-img.svg'
import zipICON from './../../assets/icons/zip-img.svg'
import uploadIcon from './../../assets/icons/upload.svg'
import zipUploadedIcon from './../../assets/icons/zipped.png'
import { debounce } from '../../util/debounce';
import generateFileURL, { filetypeDict } from '../../util/getFileDownloadUrl';
import { FILETYPES } from '../../util/UPLOAD_FOLDER_DATA';

export const FileCard = ({ description, type, room, callback, callbackDouble, clicked, id }) => {

    function getDefaultImg(type) {
        if (type.name === FILETYPES.render.name) {
            return renderICON
        }
        if (type.name === FILETYPES.qcrender.name) {
            return qcRenderICON
        }
        if (type.name === FILETYPES.qcscreenshot.name) {
            return qcscreenshotICON
        }
        if (type.name === FILETYPES.archive.name) {
            return zipICON
        }
    }

    function fileImage(filename, foldername, s3url) {
        return (< img src={s3url + foldername + "/" + filename} className="img-loaded" />)

    }

    console.log(clicked)


    function getUI(room, type) {

        if (!room) {
            return (<img src={getDefaultImg(type)} className="img-default" />)
        } else {
            if (type.name === FILETYPES.render.name) {
                if (room.render) {
                    return fileImage(room.render, type.foldername, room.s3URL)
                } else {
                    return (<img src={getDefaultImg(type)} className="img-default" />)
                }
            }
            if (type.name === FILETYPES.qcrender.name) {
                if (room.qc_render) {
                    return fileImage(room.qc_render, type.foldername, room.s3URL)
                } else {
                    return (<img src={getDefaultImg(type)} className="img-default" />)
                }
            }

            if (type.name === FILETYPES.qcscreenshot.name) {
                if (room.qc_screenshot) {
                    return fileImage(room.qc_screenshot, type.foldername, room.s3URL)
                } else {
                    return (<img src={getDefaultImg(type)} className="img-default" />)
                }
            }

            if (type.name === FILETYPES.archive.name) {
                if (room.archivename) {
                    return (< img src={zipUploadedIcon} className="img-default" />)
                } else {
                    return (<img src={getDefaultImg(type)} className="img-default" />)
                }
            }

        }
    }

    const clickHandler = debounce((e, type, clicked, id) => {
        if (e.detail === 1) {

        } else if (e.detail === 2) {
            // callbackDouble()
            if (type.name === FILETYPES.render.name) {
                callbackDouble(0, type)
            }
            if (type.name === FILETYPES.qcrender.name) {
                callbackDouble(1, type)
            }

            if (type.name === FILETYPES.qcscreenshot.name) {
                callbackDouble(2, type)
            }

            if (type.name === FILETYPES.archive.name) {

            }
        }
    }, 200)

    return (
        <div className={`card card-custom${clicked === id ? '-clicked' : ''}`} onClick={e => { clickHandler(e, type, clicked, id) }}>
            <div className="img-div">
                {getUI(room, type)}
            </div>

            <div className='description-div'>
                <div className='description-text'>{description}</div>
            </div>
            <div className='upload-div shadow-sm' onClick={e => { callback(type, clicked, id) }}>
                <img src={uploadIcon} className='upload-img' />
            </div>
        </div>
    )
}
