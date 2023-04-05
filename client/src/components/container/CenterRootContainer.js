import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../App.css';


export const CenterRootContainer = (props) => {
  return (
    <div className="container-xxl">
      <div className="row center-div">
        <div className="d-flex justify-content-center">
          <div className="align-items-stretch">
            {props.children}
          </div>
        </div>
      </div>

    </div>
  )
}

