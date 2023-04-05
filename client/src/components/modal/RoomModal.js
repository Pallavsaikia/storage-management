import { React, useRef, useContext, useState } from 'react'
import './RoomModal.css'
import { EditText } from '../form/input_fields/EditText'
import DropDown from '../form/input_fields/DropDown'
import { Icon } from '../icon/Icon'
import close from '../../assets/icons/close.svg'
import { IconAnimate } from '../icon/IconAnimate'
import { Switch } from '../switch/Switch'
import { TextArea } from '../form/textarea/TextArea'
import { SubmitButton } from '../form/buttons/SubmitButton'
import { addRoom, createSets } from '../../api/api'
import { AlertContext } from '../../context/AlertContext'
import { NavBarContext } from '../../context/NavBarContext'
import { AlertData, AlertType } from '../alert/Alert'
export const RoomModal = ({ setid, modalVisible, setModalVisible, roomTypeList, callback }) => {

  const roomtype = useRef()

  const [disabled, setdisabled] = useState(false);

  const { updateAlert } = useContext(AlertContext)
  const { loadingNav, setLoadingNav } = useContext(NavBarContext)

  async function handleCallBack(e, setid, roomtype) {
    e.preventDefault()
    setdisabled(true)
    setLoadingNav(true)
    const response = await addRoom(setid, roomtype.value)
    if (response.success === true) {
      updateAlert(AlertData(response.message, AlertType.success))
      callback(response.data.room)
      setModalVisible(false)

    } else {
      updateAlert(AlertData(response.message))
    }
    setdisabled(false)
    setLoadingNav(false)
  }

  if (modalVisible) {
    return (
      <div className='modal-shadow'>
        <div className='modal-card'>
          <div className='modal-header'>
            <span>Add Room</span>
            <IconAnimate className="modal-close" src={close} onClick={(e) => { setModalVisible(false) }} />
          </div>
          <form onSubmit={(e) => handleCallBack(e, setid, roomtype.current)}>

            <DropDown reference={roomtype} top={0} optionsList={roomTypeList} placeholder="-- Select room type --"></DropDown>

            <SubmitButton disabled={disabled} text="Add Room" top={5} />
          </form>

        </div>
      </div>
    )
  } else {
    return (null)
  }
}
