import React, { useState, useRef } from 'react';
import './Dashboard.css'
import { FolderContainer } from '../components/container/FolderContainer';
import { FolderContext } from '../context/FolderContext';
import { InfoContainer } from '../components/sidebar/InfoContainer';

const Dashboard = () => {

    const [data, setData] = useState([]);
    const [apiData, setApiData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [metaData, setMetaData] = useState(null);

    const cancelToken = useRef(null)

    function getvalueFromContainer(predata){
        setMetaData(predata)
    }

    return (
        
        <FolderContext.Provider value={{ data,setData,apiData, setApiData, loading, setLoading, cancelToken }}>
            <div className='parentGrid'>
                <FolderContainer meta_data_setter={getvalueFromContainer}/>
                <InfoContainer editdata={metaData}/>
            </div>
        </FolderContext.Provider>

    )
}

export default Dashboard