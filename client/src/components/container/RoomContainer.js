import { React, useEffect, useContext, useRef, useState } from 'react'
import { ContextMenuContext } from '../../context/ContextMenuContext';
import { MenuItem } from '../context-menu/ContextMenu';
import addRoomIcon from '../../assets/icons/room-add.svg'
import addRoomIconGreen from '../../assets/icons/room-add-green.svg'
import { getMetaForRoomCreate, getRoom, getRoomList } from '../../api/api';
import { RoomModal } from '../modal/RoomModal';
import { FolderCard } from '../card/FolderCard';
import { RoomCard } from '../card/RoomCard';
import './RoomContainer.css'
import { useNavigate } from 'react-router';
import { CustomCreateButton } from '../custom/CustomCreateButton';
import { NavBarContext } from '../../context/NavBarContext';
import axios from 'axios';

export const RoomContainer = ({ id, folder, setFolder, rooms, setRooms, modalVisible, setModalVisible, setLoadingShimmer, setSelectedRoomData, cancelToken }) => {

    const navigate = useNavigate()
    const { setMenuVisible, setMenuList, setPosX, setPosY } = useContext(ContextMenuContext)
    const { loadingNav, setLoadingNav } = useContext(NavBarContext)



    const roomType = useRef()
    const [clicked, setClicked] = useState(null);
    function addRoom() {
        setMenuVisible(false)
        setModalVisible(true)
        // console.log(modalVisible)
    }

    function onLeftClick(e) {
        console.log('here')
        setClicked(null)
        setSelectedRoomData(null)
        //set data null todo
        setMenuVisible(false)
    }

    function onRightClick(e) {
        e.preventDefault()
        setMenuVisible(true)
        setPosX(e.clientX)
        setPosY(e.clientY)
        if (!modalVisible) {

        }
    }

    async function metaApiCall() {
        setLoadingNav(true)
        const res = await getMetaForRoomCreate()

        if (res.success === true) {

            roomType.current = res.data.roomtype
        }
        setLoadingNav(false)
    }

    async function folderDataApiCall(id) {
        const res = await getRoomList(id)

        if (res.success === true) {
            setRooms(res.data.rooms)
            setFolder(res.data.setdetails)
        }

    }

    useEffect(() => {
        setMenuVisible(false)
        metaApiCall()
        folderDataApiCall(id)
        setMenuList([MenuItem("Add Room", addRoomIcon, addRoom)])
    }, [id]);


    function callbackAfterAdd(addedroom) {
        setRooms(olddata => {
            return [addedroom, ...olddata]
        })
    }

    function slash() {
        return "/"
    }

    async function singleClickCard(id) {
        if (cancelToken.current) {
            if (typeof cancelToken.current != typeof undefined) {
                cancelToken.current.cancel("Operation canceled due to new request.")
            }
        }
        cancelToken.current = axios.CancelToken.source()

        setLoadingShimmer(true)
        const response = await getRoom(id, cancelToken.current)
        if (response.success === true) {
            setSelectedRoomData(response.data)
        }

        if (!response.cancelled) {
            setLoadingShimmer(false)
        }

    }

    function roomCardUI(rooms) {
        const carduiList = []
        for (let i = 0; i < rooms.length; i++) {
            carduiList.push(<RoomCard key={rooms[i]._id} clicked={clicked} setClicked={setClicked} data={rooms[i]} callbackSingleClick={singleClickCard}></RoomCard>)
        }
        return carduiList
    }

    return (
        <div className="flexgrid-parent" onContextMenu={e => onRightClick(e)} onClick={e => onLeftClick(e)} tabIndex="0">

            <CustomCreateButton text="Add Room" icon={addRoomIconGreen} callback={() => { setModalVisible(true) }}>
                <div className='location-header'>
                    <span className='tab' onClick={e => { navigate('/') }}>Home</span>
                    <span className='tab-nohover'>{slash()}</span>
                    <span className='tab-nohover'>{folder ? folder.setID : null}</span>
                </div>
            </CustomCreateButton>
            <div className='flexgrid' onClick={e => onLeftClick(e)}>
                {roomCardUI(rooms)}
            </div>
            <RoomModal setid={id} modalVisible={modalVisible} setModalVisible={setModalVisible} roomTypeList={roomType.current} callback={callbackAfterAdd} ></RoomModal>
        </div>
    )
}
