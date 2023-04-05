import React, { useContext, useRef } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './FolderCard.css'
import folder from '../../assets/icons/folder.svg'
import enable from '../../assets/icons/enable.png'
import disable from '../../assets/icons/disable.png'
import qc from '../../assets/icons/qc.png'
import { Icon } from '../icon/Icon';
import { debounce } from '../../util/debounce';
import { FolderContext } from '../../context/FolderContext';
import axios from 'axios';
import { getSetByID } from '../../api/api';
import { useNavigate } from 'react-router';


export const FolderCard = ({ clicked, setClicked, data, i, children, reference }) => {

    const { setApiData, setLoading, cancelToken } = useContext(FolderContext)
    const navigate = useNavigate()
    const clickedOnce = async (id) => {
        if (cancelToken.current) {
            if (typeof cancelToken.current != typeof undefined) {
                cancelToken.current.cancel("Operation canceled due to new request.")
            }
        }
        cancelToken.current = axios.CancelToken.source()

        try {
            setLoading(true)
            const results = await getSetByID(id, cancelToken.current)
            console.log(results)
            if (!results.cancelled) {
                setLoading(false)
            } else {

            }
            if (results.success === true) {
                setApiData(results.data)
            } else {
                //showalert
            }
        } catch (error) {
            console.log(error)
        }

    }

    const clickHandler = debounce((e, folder) => {
        if (e.detail === 1) {
            setClicked(folder._id)
            clickedOnce(folder._id)
        } else if (e.detail === 2) {
            setClicked(folder._id)
            navigate('/folder/' + folder._id)
        }
    }, 200)

    function beforeClickHandler(e, data) {
        e.preventDefault()
        e.stopPropagation()
        clickHandler(e, data)
    }

    return (
        <div ref={reference} className={`shadow-sm card-border card-wide ${data._id === clicked ? 'selected-card' : ''} `} onContextMenu={(e) => {
            e.preventDefault()
            e.stopPropagation()
        }} onClick={e => beforeClickHandler(e, data)}>
            <Icon src={folder} />
            <span className="foldername">{data.setID}</span>
            {children}
            <div className='details'>
                {
                    data.isQCDone ? <img src={qc} className='icon-end ' title="qc" /> : null
                }
                {
                    data.isActive ? <img src={enable} className='icon-end ml-10' title="active" /> : <img src={disable} className='icon-end ml-10' title="inactive" />
                }


            </div>

        </div>
    )
}
