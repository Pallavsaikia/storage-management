import React, { useContext, useState, useEffect, useRef } from 'react'
import './InfoContainer.css'
import { Icon, ICON_LARGE } from '../icon/Icon'
import folder from '../../assets/icons/folder.svg'
import { Shimmer } from '../shimmer/Shimmer'
import { EmptyDiv } from '../empty/EmptyDiv'
import { ActivityContainer } from './ActivityContainer'
import { DetailsRoomContainer } from './DetailsRoomContainer'

export const InfoBar = ({ loadingShimmer, setLoadingShimmer, selectedRoomData, setSelectedRoomData }) => {

    const [selectedTab, setselectedTab] = useState(1);

    function hideEmptyDiv(loading, selectedRoomData) {
        return loading || selectedRoomData

    }
    function showInfoDiv(loading, selectedRoomData) {
        return !loading && selectedRoomData

    }


    return (
        <div className='infodiv'>
            <div className='parentInfoContainer'>
                <div className='info-header'>

                    <div ><Icon src={folder} size={ICON_LARGE} > </Icon><span className='folder-header'> {selectedRoomData?selectedRoomData.room.roomID:"My Folder"}</span></div>


                </div>
                <div className='details-activity-header'>
                    <span className={`${selectedTab === 1 ? 'selected-tab' : ''}`} onClick={(e) => { setselectedTab(1) }}>Details</span> <span className={`${selectedTab === 2 ? 'selected-tab' : ''}`} onClick={(e) => { setselectedTab(2) }}>Activity</span>
                </div>
                {loadingShimmer && <Shimmer />}
                {!hideEmptyDiv(loadingShimmer, selectedRoomData) && <EmptyDiv />}
                {showInfoDiv(loadingShimmer, selectedRoomData) && <div>
                    {selectedTab === 1 && <DetailsRoomContainer data={selectedRoomData.room} />}
                    {selectedTab === 2 && <ActivityContainer activitylist={selectedRoomData.activity} ></ActivityContainer>}
                </div>}
            </div>
        </div>


    )
}
