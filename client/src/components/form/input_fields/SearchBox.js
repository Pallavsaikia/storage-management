import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './SearchBox.css'
import { debounce } from '../../../util/debounce';
import { isStringEmpty } from '../../../util/string_ops';
export const SearchBox = ({ name, placeholder, bottom, top, x, y, reference, callback,clear }) => {

    const handleOnchange = debounce((e) => {
        if (e.target.value.length > 3 ) {
            console.log(e.target.value)
            if (!isStringEmpty(e.target.value)) {
                callback(e.target.value)
            }
        }
        if(e.target.value.length ===0){
            clear()
        }
    }, 1000)
    return (
        <div className={`searchbox`}>
            <input ref={reference} name={name} type='string' className="form-control" placeholder={placeholder ? placeholder : "Enter"}
                onChange={e => handleOnchange(e)} />
        </div>
    )
}
