import React from 'react'
import './Icon.css'
export const ICON_LARGE = 'large'
export const ICON_VERY_LARGE = 'very-large'

export const Icon = ({ src, size }) => {
  return (
    <img className={`icon${size ? '-' + size : ''}`} src={src} />
  )
}

