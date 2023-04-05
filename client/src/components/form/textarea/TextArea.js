import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './TextArea.css'
export const TextArea = ({top,bottom,x,y,label,reference,placeholder,value}) => {
  return (
    <div className={`mt-${top?top:0} mb-${bottom?bottom:0} my-${y?y:0} mx-${x?x:0} label-text`}>
        <label  className="form-label">{label?label:""} </label>
        <textarea defaultValue={value} ref={reference}  className="form-control editText"  placeholder={placeholder?placeholder:"Enter text"}
            />
    </div>
)
}
