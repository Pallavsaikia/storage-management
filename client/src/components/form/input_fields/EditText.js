import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './EditText.css'
export const EditText = ({top,bottom,x,y,label,reference,type,placeholder,value}) => {
    return (
        <div className={`mt-${top?top:0} mb-${bottom?bottom:0} my-${y?y:0} mx-${x?x:0} label-text`}>
            <label  className="form-label">{label?label:""} </label>
            <input defaultValue={value} ref={reference}  type={type?type:'text'} className="form-control editText"  placeholder={placeholder?placeholder:"Enter"}
                autoFocus />
        </div>
    )
}
