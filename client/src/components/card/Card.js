import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';


export const Card = (props) => {
  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        {props.children}
      </div>
    </div>
  )
}
