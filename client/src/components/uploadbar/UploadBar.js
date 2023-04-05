import React, { useState, useEffect } from 'react'
import './UploadBar.css'
import minimizeIcon from '../../assets/icons/minimize.png'
import closeIcon from '../../assets/icons/close-white.svg'
import maximizeIcon from '../../assets/icons/maximize.png'
import { UploadCard } from './UploadCard'
import { UploadProgressContext } from '../../context/UploadProgressContext'

export const UploadBar = ({ children }) => {
    const [progress, setProgress] = useState([]);
    const [minimize, setMinimize] = useState(false);
    const [close, setClose] = useState(true);

    const [progressCounter, setProgressCounter] = useState(0);

    function getUploadCards(progress) {
        const uploadCard = []
        if (progress.length != 0 && minimize === false) {
            for (let i = 0; i < progress.length; i++) {
                uploadCard.push(<UploadCard key={i} progress={progress[i].progress} type={progress[i].type} file={progress[i].filename}></UploadCard>)
            }
        }
        return uploadCard
    }

    function uploadUi() {

        if (!close) {
            return (
                <div className='parent-upload'>
                    <div className='upload-header'>
                        <span>Upload</span>
                        <div className='close-min-div'>
                            <img className="minimize-upload" src={minimize ? maximizeIcon : minimizeIcon} onClick={e => { setMinimize(oldata => { return !oldata }) }} />
                            <img className="close-upload" src={closeIcon} onClick={e => {
                                if (progressCounter === -1) {
                                    setProgress([])
                                    setClose(true)
                                }
                            }} />
                        </div>
                    </div>
                    <div className='progress-div-body'>
                        {getUploadCards(progress)}
                    </div>
                </div>
            )
        } else {
            return <></>


        }
    }
    useEffect(() => {
        uploadUi()
    }, [progressCounter]);
    return (
        <UploadProgressContext.Provider value={{ progress, setProgress, progressCounter, setProgressCounter, setMinimize, setClose }}>
            {children}
            {uploadUi()}

        </UploadProgressContext.Provider>

    )
}
