import { React, useEffect, useState, useContext, useRef, useCallback } from 'react'
import { getMetaForSetCreate, getSets } from '../../api/api';
import { AlertContext } from '../../context/AlertContext';
import { ContextMenuContext } from '../../context/ContextMenuContext';
import { AlertData } from '../alert/Alert';
import { FolderCard } from '../card/FolderCard'
import { MenuItem } from '../context-menu/ContextMenu';
import addFolder from '../../assets/icons/folder-plus.svg'
import addFolderGreen from '../../assets/icons/folder-plus-green.svg'
import './FolderContainer.css'
import { FolderModal } from '../modal/FolderModal';
import { NavBarContext } from '../../context/NavBarContext';
import { cleanSetList } from '../../util/cleanduplicate';
import { Icon } from '../icon/Icon';
import { CustomCreateButton } from '../custom/CustomCreateButton';
import { FolderContext } from '../../context/FolderContext';


export const FolderContainer = ({ children,meta_data_setter }) => {

    
    const [modalVisible, setModalVisible] = useState(false);
    const [pageno, setpageno] = useState(1);
    const [clickedFolder, setClickedFolder] = useState(null);
    const totalPage = useRef(1)
    const styleList = useRef()
    const modellerList = useRef()
    const observer=useRef()
    const { data, setData,setApiData } = useContext(FolderContext)
    const { updateAlert } = useContext(AlertContext)
    const { setMenuVisible, setMenuList, setPosX, setPosY } = useContext(ContextMenuContext)
    const { loadingNav, setLoadingNav } = useContext(NavBarContext)


    const lastFolderElementRef=useCallback(node=>{
        if(loadingNav) return
        if(observer.current) observer.current.disconnect()
        observer.current= new IntersectionObserver(entries=>{
            if(entries[0].isIntersecting){
                scrollcall()
            }

        })
        if(node) {
             observer.current.observe(node)
        }
    },[pageno,loadingNav])

    async function getSetApi(pageno) {
        setLoadingNav(true)


        const response = await getSets(pageno)
        if (response.success === true) {
            totalPage.current = response.data.totalCount
            setData(olddata => {
                const temp = [...olddata, ...response.data.sets]
                return cleanSetList(temp)
            })

        } else {
            updateAlert(AlertData(response.message))
        }
        setLoadingNav(false)

    }

    async function getMetaApiCall() {
        const response = await getMetaForSetCreate()
        if (response.success === true) {
            styleList.current = response.data.style
            modellerList.current = response.data.modellers
            meta_data_setter(response.data)
            // console.log(response)
        } else {
            updateAlert(AlertData(response.message))
        }

    }
    function addSets() {
        setMenuVisible(false)
        setModalVisible(true)
        // console.log(modalVisible)
    }


    function loadFolders(data,setData) {
        if (data != null) {
            const sets = data
            var folder = []
            for (let i = 0; i < sets.length; i++) {
                if (i === sets.length - 1) {
                    folder.push(<FolderCard clicked ={clickedFolder} setClicked={setClickedFolder} reference ={lastFolderElementRef}  i={i} data={sets[i]} key={sets[i]._id} ></FolderCard>)
                } else {
                    folder.push(<FolderCard clicked ={clickedFolder} setClicked={setClickedFolder}   i={i} data={sets[i]} key={sets[i]._id} ></FolderCard>)
                }
            }
            return folder
        }
    }
    function onRightClick(e) {
        e.preventDefault()
        if (!modalVisible) {
            setMenuVisible(true)
            setPosX(e.clientX)
            setPosY(e.clientY)
        }
    }
    function scrollcall() {
        if (totalPage.current > pageno) {
            setpageno((oldpage) => { return oldpage + 1 })
            setMenuVisible(false)
        }
    }
    function onLeftClick(e) {
        setApiData(null)
        setClickedFolder(null)
        setMenuVisible(false)
    }

    function addSetToList(addedset) {
        // setpageno(1)
        setData(olddata => {
            console.log(olddata)
            return [addedset, ...olddata]
        })

    }

    useEffect(() => {
        setMenuVisible(false)
        getMetaApiCall()
        setMenuList([MenuItem("Create Folder", addFolder, addSets)])
    }, [])




    useEffect(() => {
        getSetApi(pageno)
    }, [pageno])


    return (
        <div className="flexparent" onContextMenu={e => onRightClick(e)} tabIndex="0">
            <CustomCreateButton text="Create Folder" icon={addFolderGreen} callback={() => { setModalVisible(true) }} />
            <div className='flexg' onClick={e => onLeftClick(e)}>

                <FolderModal callback={addSetToList} visible={modalVisible} setVisible={setModalVisible} styleList={styleList.current} modellerList={modellerList.current}></FolderModal>
                {loadFolders(data,setData)}
                {children}
            </div>
        </div>

    )
}
