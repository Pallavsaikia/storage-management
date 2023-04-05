import React, { useContext, useState, useEffect, useRef } from 'react'
import { FolderContext } from '../../context/FolderContext'
import './InfoContainer.css'
import { Icon, ICON_LARGE } from '../icon/Icon'


import folder from '../../assets/icons/folder.svg'
import category from '../../assets/icons/category.svg'
import person from '../../assets/icons/person.svg'
import { Shimmer } from '../shimmer/Shimmer'
import { EmptyDiv } from '../empty/EmptyDiv'
import { getSetByID } from '../../api/api'
import { AlertContext } from '../../context/AlertContext'
import { AlertData } from '../alert/Alert'
import { DetailsContainer } from './DetailsContainer'
import { FolderModal } from '../modal/FolderModal'
import { FolderEditModal } from '../modal/FolderEditModal'
import { ActivityContainer } from './ActivityContainer'
export const InfoContainer = ({ editdata }) => {

    const { data, setData, apiData, setApiData, loading, setLoading, cancelToken } = useContext(FolderContext)
    const { updateAlert } = useContext(AlertContext)
    const [selectedTab, setselectedTab] = useState(1);
    const [modalVisible, setModalVisible] = useState(false);

    function hideEmptyDiv(loading, appData) {
        return loading || appData

    }
    function showInfoDiv(loading, appData) {
        return !loading && appData

    }
    function updatedFolder(updateddata, createdBy, uploadedBy) {
        setApiData(oldata => {
            oldata.set = updateddata
            return oldata
        })

        setData(oldata => {
            for (let i = 0; i < oldata.length; i++) {
                if (oldata[i]._id === updateddata._id) {
                    oldata[i] = updateddata
                }
            }
            return oldata
        })
    }

    function onClick(e) {
        
        setModalVisible(true)
    }

    return (
        <div className='infodiv'>
            <div className='parentInfoContainer'>
                <div className='info-header'>

                    <div ><Icon src={folder} size={ICON_LARGE} > </Icon><span className='folder-header'>{apiData ? apiData.set.setID : 'My Folder'}</span></div>


                </div>
                <div className='details-activity-header'>
                    <span className={`${selectedTab === 1 ? 'selected-tab' : ''}`} onClick={(e) => { setselectedTab(1) }}>Details</span> <span className={`${selectedTab === 2 ? 'selected-tab' : ''}`} onClick={(e) => { setselectedTab(2) }}>Activity</span>
                </div>
                {loading && <Shimmer />}
                {!hideEmptyDiv(loading, apiData) && <EmptyDiv />}
                {showInfoDiv(loading, apiData) && <div>
                    {selectedTab === 1 && <DetailsContainer clickevent={onClick} data={apiData.set} />}
                    {selectedTab === 2 && <ActivityContainer activitylist={apiData.activity} ></ActivityContainer>}
                </div>}
            </div>
            <FolderEditModal data={apiData} callback={updatedFolder} visible={modalVisible} setVisible={setModalVisible} styleList={editdata ? editdata.style : null} modellerList={editdata ? editdata.modellers : null} />
        </div>


    )
}
