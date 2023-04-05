import React from 'react'
import './IconAnimate.css'
export const IconAnimate = ({src,onClick}) => {
  return (
    <img className='icon' onClick={e=>{onClick()}} src={src} />
  )
}
