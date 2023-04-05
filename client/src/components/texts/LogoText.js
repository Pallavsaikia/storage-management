import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

export const LogoText = (props) => {
  return (
    <span className={`app-brand-text`} >{props.header.toLowerCase()}</span>
  )
}
