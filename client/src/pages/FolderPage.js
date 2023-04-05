import React, { useState, useRef } from 'react';
import './FolderPage.css'
import { useParams } from 'react-router';
import { RoomContainer } from '../components/container/RoomContainer';
import { InfoBar } from '../components/sidebar/InfoBar';

const FolderPage = () => {
    const { id } = useParams();
    const [rooms, setRooms] = useState([]);
    const [selectedRoomData, setSelectedRoomData] = useState(null);
    const [folder, setFolder] = useState();
    const [modalVisible, setModalVisible] = useState(false);
    const [loadingShimmer, setLoadingShimmer] = useState(false);

    const cancelToken = useRef(null)

    return (
        <div className='parentGrid'>
            <RoomContainer cancelToken={cancelToken} setLoadingShimmer={setLoadingShimmer} setSelectedRoomData={setSelectedRoomData} id={id} folder={folder} setFolder={setFolder} rooms={rooms} setRooms={setRooms} modalVisible={modalVisible} setModalVisible={setModalVisible}></RoomContainer>
            <InfoBar loadingShimmer={loadingShimmer} setLoadingShimmer={setLoadingShimmer} selectedRoomData={selectedRoomData} setSelectedRoomData={setSelectedRoomData} />
        </div>
    )
}

export default FolderPage