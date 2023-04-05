import { React, useEffect, useContext, useRef, useState } from 'react'
import { ContextMenuContext } from '../../context/ContextMenuContext';
import { MenuItem } from '../context-menu/ContextMenu';
import deleteIcon from '../../assets/icons/delete-red.svg'
import { deleteRoom, getMetaForRoomCreate, getPresignedUrls, getRoom, getRoomList, multiPartUploadComplete, updateroom, uploadToPresignedUrls } from '../../api/api';
import { RoomModal } from '../modal/RoomModal';
import { FolderCard } from '../card/FolderCard';
import { RoomCard } from '../card/RoomCard';
import './RoomContainer.css'
import { CustomCreateButton } from '../custom/CustomCreateButton';
import { useNavigate } from 'react-router';
import { NavBarContext } from '../../context/NavBarContext';
import { FileCard } from '../card/FileCard';
import { UploadBar } from '../uploadbar/UploadBar';
import { UploadCard } from '../uploadbar/UploadCard';
import { ImageViewer } from '../imageviewer/ImageViewer';
import { QC_RENDER_FILE_URL, QC_SCREENSHOT_FILE_URL, RENDER_FILE_URL } from '../../metadata/URLS';
import useConfirm from '../../hooks/useConfirm';
import { ConfirmDeleteDialog } from '../dialog/ConfirmDeleteDialog';
import { AlertData, AlertType } from '../alert/Alert';
import { AlertContext } from '../../context/AlertContext';
import generateFileURL, { filetypeDict } from '../../util/getFileDownloadUrl';
import { sliceFile } from '../../util/chunk_file';
import { PROGRESS_OBJ } from '../../util/PROGRESS';
import { UploadProgressContext } from '../../context/UploadProgressContext';
import { FILETYPES } from '../../util/UPLOAD_FOLDER_DATA';


export const RoomDetailContainer = ({ id, room, setRoom, setLoadingShimmer, setSelectedRoomData }) => {
    // do something else if the user declined
    const [getConfirmation, Confirmation] = useConfirm()

    const archive = useRef()
    const renderRef = useRef()
    const qcrender = useRef()
    const qcscreenshot = useRef()
    const uploadCount = useRef(0)

    const chunkProgressSizeList = useRef([])

    const { loadingNav, setLoadingNav } = useContext(NavBarContext)
    const { updateAlert } = useContext(AlertContext)



    const { progress, setProgress, progressCounter, setProgressCounter, setMinimize, setClose } = useContext(UploadProgressContext);


    const [clicked, setClicked] = useState();
    const [open, setOpen] = useState(false);


    const [clickedCard, setClickedCard] = useState(false);
    const [currenIndex, setCurrentIndex] = useState(null);

    const navigate = useNavigate()
    const imageList = useRef([])

    function onRightClick(e) {

    }
    function onLeftClick(e) {

    }


    function setImageList(room) {
        if (room) {
            while (imageList.current.length > 0) {
                imageList.current.pop();
            }

            imageList.current.push(room.render ? {
                src: room.s3URL + FILETYPES.render.foldername + "/" + room.render
            } : null)
            imageList.current.push(room.qc_render ? {
                src: room.s3URL + FILETYPES.qcrender.foldername + "/" + room.qc_render
            } : null)
            imageList.current.push(room.qc_screenshot ? {
                src: room.s3URL + FILETYPES.qcscreenshot.foldername + "/" + room.qc_screenshot
            } : null)
            setCurrentIndex(-1)
        }

    }

    async function getRoomDetails(id) {
        setLoadingNav(true)
        setLoadingShimmer(true)
        const res = await getRoom(id)

        if (res.success === true) {

            setRoom(oldata => { return res.data.room })
            setSelectedRoomData(res.data)
        }
        setLoadingShimmer(false)
        setLoadingNav(false)
    }




    function slash() {
        return "/"
    }

    function deleteRoomBtnclicked() {
        setOpen(true)
    }

    async function onDelete(cancelled, pw) {
        setOpen(false)
        if (!cancelled)

            setLoadingNav(true)
        const response = await deleteRoom(id, pw)
        if (response.success === true) {
            updateAlert(AlertData(response.message, AlertType.success))
            navigate('/folder/' + room.parentSet._id)
        } else {
            updateAlert(AlertData(response.message))
        }
        setLoadingNav(false)

    }





    async function uploadArchive(e, type) {
        if (e.target.files) {
            const _id = new Date().getTime()
            const blob = new Blob([e.target.files[0]])
            const blobList = sliceFile(blob)
            const emptyProgressList = []
            for (let index = 0; index < blobList.length; index++) {
                emptyProgressList.push(0)
            }
            setMinimize(false)
            setClose(false)
            setProgress(oldata => {

                return [PROGRESS_OBJ(_id, e.target.files[0].name, 0.1, type, emptyProgressList, blob.size), ...oldata]
            })

            const response = await getPresignedUrls(type.foldername, e.target.files[0].name, room._id, blobList.length)
            const promises = []
            if (response.success === true) {
                const uploadId = response.data.uploadId
                const foldername = response.data.foldername
                const filename = response.data.filename
                const urls = response.data.upload_urls


                for (let i = 0; i < urls.length; i++) {
                    promises.push(uploadToPresignedUrls(urls[i], blobList[i], _id, i, setProgress, setProgressCounter))
                }
                const resParts = await Promise.all(promises)
                const filepartArray = resParts.map((part, index) => ({
                    ETag: part.headers.etag,
                    PartNumber: index + 1
                }))
                const res = await multiPartUploadComplete(foldername, filename, uploadId, filepartArray, room._id)
                if (res.success === true) {
                    setProgress(oldata => {
                        for (let i = 0; i < oldata.length; i++) {
                            if (oldata[i]._id === _id) {
                                oldata[i].progress = 'done'
                            }
                        }
                        return oldata
                    })
                    //for it to allow closing..stating no upload
                    setProgressCounter(prevC => { return -1 })
                    setRoom(oldata => { return res.data.room })
                } else {
                    /**
                     * show alert
                     */
                }
            }

        }

    }

    async function uploadFile(e, type, getConfirmation) {
        if (!e.target.files[0].name.includes(room.roomID)) {
            const status = await getConfirmation("Filename  not matching with room id. It can be wrong file. Do you want to Proceed?")
            if (status) {
                console.log('yes')

            } else {
                console.log('no')
                return
            }
        }

        uploadArchive(e, type)

    }


    function closeCallBack() {
        // setArchiveProgress(null)
        // setQCRenderProgress(null)
        // setQCScreenshotProgress(null)
        // setRenderProgress(null)
    }



    useEffect(() => {
        getRoomDetails(id)
        return () => {
        };
    }, [id]);

    useEffect(() => {

        setImageList(room)
    }, [room]);


    function onDoubleClickCard(index, type) {
        setClicked(type.name)
        setClickedCard(true)
        setCurrentIndex(index)
    }

    function onCardClick(type, clicked, id) {

        if (type.name === FILETYPES.render.name) {
            setClicked(FILETYPES.render.name)
            renderRef.current.click();

        }
        if (type.name === FILETYPES.qcrender.name) {
            setClicked(FILETYPES.qcrender.name)
            qcrender.current.click();

        }

        if (type.name === FILETYPES.qcscreenshot.name) {
            setClicked(FILETYPES.qcscreenshot.name)
            qcscreenshot.current.click();

        }

        if (type.name === FILETYPES.archive.name) {
            setClicked(FILETYPES.archive.name)
            archive.current.click();

        }
    }

    return (
        <div className="flexgrid-parent" onContextMenu={e => onRightClick(e)} onClick={e => onLeftClick(e)} tabIndex="0">

            <CustomCreateButton danger={true} icon={deleteIcon} text='Delete Room' callback={e => { deleteRoomBtnclicked() }}>
                <div className='location-header'>
                    <span className='tab' onClick={e => { navigate('/') }}>Home</span>
                    <span className='tab-nohover'>{slash()}</span>
                    <span className='tab ' onClick={e => { navigate('/folder/' + room.parentSet._id) }}>{room ? room.parentSet.setID : null}</span>
                    <span className='tab-nohover'>{slash()}</span>
                    <span className='tab-nohover'>{room ? room.roomID : null}</span>
                </div>
            </CustomCreateButton>
            <div className='files-div'>

                <FileCard id={FILETYPES.render.name} clicked={clicked} description="Render" room={room} type={FILETYPES.render} callback={onCardClick} callbackDouble={onDoubleClickCard}></FileCard>
                <FileCard id={FILETYPES.qcrender.name} clicked={clicked} description="QC Render" room={room} type={FILETYPES.qcrender} callback={onCardClick} callbackDouble={onDoubleClickCard}></FileCard>
                <FileCard id={FILETYPES.qcscreenshot.name} clicked={clicked} description="QC Screenshot" room={room} type={FILETYPES.qcscreenshot} callback={onCardClick} callbackDouble={onDoubleClickCard}></FileCard>
                <FileCard id={FILETYPES.archive.name} clicked={clicked} description="Archive" room={room} type={FILETYPES.archive} callback={onCardClick}></FileCard>

                <input type='file' ref={archive} accept=".zip" style={{ display: 'none' }} onChange={e => { uploadFile(e, FILETYPES.archive, getConfirmation) }} />
                <input type='file' ref={qcscreenshot} accept=".png,.jpg" style={{ display: 'none' }} onChange={e => { uploadFile(e, FILETYPES.qcscreenshot, getConfirmation) }} />
                <input type='file' ref={qcrender} accept=".png,.jpg" style={{ display: 'none' }} onChange={e => { uploadFile(e, FILETYPES.qcrender, getConfirmation) }} />
                <input type='file' ref={renderRef} accept=".png,.jpg" style={{ display: 'none' }} onChange={e => { uploadFile(e, FILETYPES.render, getConfirmation) }} />


            </div>


            <ImageViewer
                imageList={imageList}
                setCurrentIndex={setCurrentIndex}
                currentIndex={currenIndex}
                clicked={clickedCard}
                setClicked={setClickedCard}
            />
            <Confirmation />
            <ConfirmDeleteDialog open={open} callback={onDelete} />
        </div>
    )
}
