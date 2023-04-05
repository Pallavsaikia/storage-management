import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

export const RegularText = (props) => {
  return (
    <h4 className={`mt-${props.top?props.top:0} mb-${props.bottom?props.bottom:0} my-${props.y?props.y:0} mx-${props.x?props.x:0} regular-text`}>{props.text}</h4>
  )
}
