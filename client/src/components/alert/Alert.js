import { React, useContext, useState } from 'react'
import { AlertContext } from '../../context/AlertContext';
import { ALERT_DURATION } from '../../metadata/APP_META';

export const AlertType= {
    success: "success",
    error: "error"
}

export const AlertData = (message,type) => {
    return {
        message:message,
        type:type?type:AlertType.error
    }
}

export const Alert = (props) => {
    const [alert, setAlert] = useState(null);

    function updateAlert(alertObj) {
        setAlert(alertObj)
        setTimeout(()=>{
            setAlert(null)
        },ALERT_DURATION)

    }

    function alertUI() {
        if (alert==null) {
            return (null)
        } else {
            return (
                <div className={`shadow ${(alert.type===AlertType.success)? 'alertNotification-primary':'alertNotification-danger'}`} role="alert">
                    <div className="alert-header" >
                        <div className="alert-header-div">
                            <strong className="alert-header-text">Server Response</strong>
                        </div>
                        <button type="button" className="alert-button-close" onClick={e => updateAlert(null)}></button>
                    </div>
                    <div className="alert-message">
                        {alert.message}
                    </div>
                </div>
            )
        }
    }
    
    return (
        <AlertContext.Provider value={{ alert, updateAlert }}>
            {props.children}
            {alertUI()}

        </AlertContext.Provider>
    )
}




