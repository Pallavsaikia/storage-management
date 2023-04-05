import { React, useRef, useContext,useState } from 'react'
import './FolderModal.css'
import { EditText } from '../form/input_fields/EditText'
import DropDown from '../form/input_fields/DropDown'
import { Icon } from '../icon/Icon'
import close from '../../assets/icons/close.svg'
import { IconAnimate } from '../icon/IconAnimate'
import { Switch } from '../switch/Switch'
import { TextArea } from '../form/textarea/TextArea'
import { SubmitButton } from '../form/buttons/SubmitButton'
import { createSets, updateSets } from '../../api/api'
import { AlertContext } from '../../context/AlertContext'
import { NavBarContext } from '../../context/NavBarContext'
import { AlertData, AlertType } from '../alert/Alert'
export const FolderEditModal = ({ visible, setVisible, styleList, modellerList, data, callback }) => {

  const name = useRef()
  const style = useRef()
  const modeller = useRef()
  const isActive = useRef()
  const isQcDone = useRef()
  const isGltfDone = useRef()
  const remarks = useRef()

  const [disabled, setdisabled] = useState(false);

  const { updateAlert } = useContext(AlertContext)
  const { loadingNav, setLoadingNav } = useContext(NavBarContext)

  async function handleCallBack(e, set) {
    e.preventDefault();
    setLoadingNav(true)
    setdisabled(true)
    console.log(modeller.current.value)
    const response = await updateSets(
      set._id,
      name.current.value,
      style.current.value,
      modeller.current.value.toString(),
      isQcDone.current.checked,
      isGltfDone.current.checked,
      isActive.current.checked,
      remarks.current.value
    )


    if (response.success === true) {
      updateAlert(AlertData(response.message, AlertType.success))
      callback(response.data.set)
      setVisible(false)
    } else {
      updateAlert(AlertData(response.message))
    }
    setdisabled(false)
    setLoadingNav(false)
  }

  if (visible) {
    return (
      <div className='modal-shadow'>
        <div className='modal-card'>
          <div className='modal-header'>
            <span>Edit Folder</span>
            <IconAnimate className="modal-close" src={close} onClick={(e) => { setVisible(false) }} />
          </div>
          <form onSubmit={(e) => handleCallBack(e, data.set)}>
            <EditText value={data.set.setID} reference={name} placeholder="Enter Unique Folder/Set Name" top={4}></EditText>

            <DropDown selected={data.set.style} reference={style} top={0} optionsList={styleList} placeholder="-- Select a style --"></DropDown>
            <DropDown selected={data.set.createdBy ? data.set.createdBy._id : null} reference={modeller} top={0} optionsList={modellerList} placeholder="-- who created it --"></DropDown>
            <div className='div-switch'>
              <Switch reference={isActive} defaultVal={data.set.isActive} text="Is Active?"></Switch>
              <Switch reference={isGltfDone} defaultVal={data.set.isGLTFDone} text="Is Gltf Done?"></Switch>
            </div>
            <div className='div-switch'>
              <Switch reference={isQcDone} defaultVal={data.set.isQCDone} text="Is Qc Done?"></Switch>
            </div>
            <TextArea value={data.set.remarks} top={2} reference={remarks} placeholder="Enter Remarks for this set if any" />
            <SubmitButton disabled={disabled} text="Update" top={5} />
          </form>

        </div>
      </div>
    )
  } else {
    return (null)
  }
}
