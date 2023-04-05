import { React } from 'react'
import { debounce } from '../../util/debounce'
import './RoomCard.css'
import { useNavigate } from 'react-router';

import locked from '../../assets/icons/locked.png'
import unlocked from '../../assets/icons/unlocked.png'
import enabled from '../../assets/icons/enable.png'
import disabled from '../../assets/icons/disable.png'
import folder from '../../assets/icons/folder.svg'
import { Icon } from '../icon/Icon';

export const RoomCard = ({ clicked, setClicked, data, callbackSingleClick }) => {
    const navigate = useNavigate()

    function clickedOnce(e, id) {

        callbackSingleClick(id)
    }


    const clickHandler = debounce((e, room) => {

        if (e.detail === 1) {
            setClicked(room._id)
            clickedOnce(e, room._id)
        } else if (e.detail === 2) {
            setClicked(room._id)
            navigate('/room/' + room._id)
        }
    }, 300)

    function beforeClickHandler(e, data) {
        e.preventDefault()
        e.stopPropagation()
        clickHandler(e, data)
    }

    console.log(data.render)
    return (

        <div className={`shadow-sm card-border card-wide ${data._id === clicked ? 'selected-card' : ''} 
        
         ${(data.render === null || data.archivename === null || data.qc_render === null || data.qc_screenshot === null ||
                data.render === undefined || data.archivename === undefined || data.qc_render === undefined || data.qc_screenshot === undefined
            ) ? 'empty-card' : ''} `} onContextMenu={(e) => {
                e.preventDefault()
                e.stopPropagation()
            }} onClick={e => beforeClickHandler(e, data)}>
            <Icon src={folder} />
            <span className='card-text '>{data.roomID}</span>
            <div className={`details`}>

                {
                    data.isZipped ? <img src={locked} className='icon-end ' title="protected" /> : <img src={unlocked} className='icon-end ml-10' title="not protected yet" />
                }

                {
                    data.isActive ? <img src={enabled} className='icon-end ml-10' title="is active" /> : <img src={disabled} className='icon-end ' title="is inactive" />
                }

            </div>
        </div>
    )
}
