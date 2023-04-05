import React from 'react'
import './ConfirmDialog.css'

export const ConfirmDialog = ({ label, onClick }) => {
    return (

        <div className='parent-confirm-dialog'>


            <div className="confirm-dialog shadow-sm">
                {label ? label : "Are You sure?"}
                <div className="confirm-dialog-footer">
                    <div className="confirm-dialog-cancel" onClick={(e) => { onClick(false) }}>
                        Cancel
                    </div>
                    <div className="confirm-dialog-proceed" onClick={(e) => { onClick(true) }}>
                        Yes
                    </div>

                </div>

            </div>
        </div>


    )
}
