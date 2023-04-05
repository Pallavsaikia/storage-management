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
import { createSets } from '../../api/api'
import { AlertContext } from '../../context/AlertContext'
import { NavBarContext } from '../../context/NavBarContext'
import { AlertData, AlertType } from '../alert/Alert'
export const FolderModal = ({ visible, setVisible, styleList, modellerList, callback }) => {

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

  async function handleCallBack(e) {
    e.preventDefault();
    setdisabled(true)
    setLoadingNav(true)
    console.log(isActive.current.checked)
    console.log(isGltfDone.current.checked)
    console.log(isQcDone.current.checked)

    const response = await createSets(
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
            <span>Create Folder</span>
            <IconAnimate className="modal-close" src={close} onClick={(e) => { setVisible(false) }} />
          </div>
          <form onSubmit={(e) => handleCallBack(e)}>
            <EditText reference={name} placeholder="Enter Unique Folder/Set Name" top={4}></EditText>

            <DropDown reference={style} top={0} optionsList={styleList} placeholder="-- Select a style --"></DropDown>
            <DropDown reference={modeller} top={0} optionsList={modellerList} placeholder="-- who created it --"></DropDown>
            <div className='div-switch'>
              <Switch reference={isActive} defaultVal={true} text="Is Active?"></Switch>
              <Switch reference={isGltfDone} defaultVal={false} text="Is Gltf Done?"></Switch>
            </div>
            <div className='div-switch'>
              <Switch reference={isQcDone} defaultVal={true} text="Is Qc Done?"></Switch>
            </div>
            <TextArea top={2} reference={remarks} placeholder="Enter Remarks for this set if any" />
            <SubmitButton disabled={disabled} text="Create" top={5} />
          </form>

        </div>
      </div>
    )
  } else {
    return (null)
  }
}
