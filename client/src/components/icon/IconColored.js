import React from 'react'
import './Icon.css'
export const Icon = ({src}) => {
  return (
    <img className='icon' src={src} />
  )
}

export const IconColored = ({src}) => {
  return (
    <img className='icon-colored' src={src} />
  )
}