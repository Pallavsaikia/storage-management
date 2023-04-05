import React, { useState, useRef } from 'react';
import './FolderPage.css'
import { useParams } from 'react-router';
import { InfoBar } from '../components/sidebar/InfoBar';
import { RoomDetailContainer } from '../components/container/RoomDetailContainer';

const RoomPage = () => {
    const { id } = useParams();
    const [room, setRoom] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [loadingShimmer, setLoadingShimmer] = useState(false);
    const [selectedRoomData, setSelectedRoomData] = useState(null);
    return (
        <div className='parentGrid'>
            <RoomDetailContainer id={id}  room={room} setRoom={setRoom} modalVisible={modalVisible} setModalVisible={setModalVisible}  setLoadingShimmer={setLoadingShimmer}  setSelectedRoomData={setSelectedRoomData}  ></RoomDetailContainer>
            <InfoBar loadingShimmer={loadingShimmer} setLoadingShimmer={setLoadingShimmer} selectedRoomData={selectedRoomData} setSelectedRoomData={setSelectedRoomData} />
        </div>
    )
}

export default RoomPage