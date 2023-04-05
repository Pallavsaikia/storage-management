import {React,useState, useRef} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './Switch.css'
export const Switch = ({reference,text,defaultVal}) => {
    function handleChange(e){
        reference.current.value=e.checked
    }
    return (
        <div className="switchdiv form-switch">
            <input ref={reference} defaultChecked={defaultVal} className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" onChange={e=>{handleChange(e)}}/>
                <label className="form-check-label" htmlFor="flexSwitchCheckDefault">{text}</label>
        </div>
    )
}
