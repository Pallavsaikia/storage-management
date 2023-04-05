import React, { useRef } from 'react'
import { EditText } from '../form/input_fields/EditText'
import './ConfirmDialog.css'

export const ConfirmDeleteDialog = ({ open, label, callback }) => {

    const pw = useRef()

    function getUI(open, pw) {
        if (open) {
            return (<div className='parent-confirm-dialog'>


                <div className="confirm-dialog shadow-sm">
                    {label ? label : "Are You sure You Want to Delete?"}
                    <EditText reference={pw} type='password' placeholder='Enter Password To Continue'></EditText>
                    <div className="confirm-dialog-footer">
                        <div className="confirm-dialog-cancel" onClick={(e) => { callback(true) }}>
                            Cancel
                        </div>
                        <div className="confirm-dialog-proceed" onClick={(e) => { callback(false, pw.current.value) }}>
                            Yes
                        </div>

                    </div>

                </div>
            </div>)
        }else{
            return(<></>)
        }


    }
    return (

        <>
            {getUI(open, pw)}
        </>

    )
}
