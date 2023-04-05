import React from 'react'
import PropTypes from 'prop-types'
import './DropDown.css'
const DropDown = ({ children,top, bottom, horizontal, label, reference, optionsList, placeholder, selected }) => {

    function optionUI(optionsList) {
        var optionTagList = []
        if (optionsList) {
            for (let i = 0; i < optionsList.length; i++) {
                optionTagList.push(<option key={optionsList[i]._id?optionsList[i]._id:''} value={optionsList[i]._id?optionsList[i]._id:''} >{optionsList[i].name}</option>)   
            }
        }
        return optionTagList
    }

    return (
        <div className={`mt-${top ? top : 0} mb-${bottom ? bottom : 0}  mx-${horizontal ? horizontal : 0} label-text`}>
            <label className="form-label">{label ? label : ""} </label>
            <select  ref={reference} className="form-control optionText" defaultValue={selected ? selected : ''}>

                <option value={''} disabled >{`${placeholder ? placeholder : '-- select --'}`}</option>
                {
                    optionUI(optionsList)
                    
                }
            </select>

        </div>
    )
}



DropDown.propTypes = {
    top: PropTypes.number,
    bottom: PropTypes.number,
    horizontal: PropTypes.number,
    label: PropTypes.string,
    reference: PropTypes.object,
    placeholder: PropTypes.string,
    optionsList: PropTypes.array,
    selected: PropTypes.string
}


export default DropDown