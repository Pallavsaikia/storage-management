import React from 'react'
import './Line.css'
export const Line = ({mt,mb,ml,mr,bcolor}) => {
  return (
    <div className='border-line'  style={{ marginTop: `${mt}px`, marginBottom: `${mb}px`, marginLeft: `${ml}px`, marginRight: `${mr}px`,backgroundColor:`${bcolor?bcolor:null}`}} />
  )
}
