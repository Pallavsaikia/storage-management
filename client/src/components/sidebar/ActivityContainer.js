import React from 'react'
import { ActivityList } from '../list/ActivityList'
import './ActivityContainer.css'
export const ActivityContainer = ({ activitylist }) => {

  function renderActivity(activitylist) {
    var actvityUI = []
    for (let i = 0; i < activitylist.length; i++) {
      actvityUI.push(<ActivityList key={i} activitydata={activitylist[i]}></ActivityList>)
    }
    return actvityUI
  }

  return (
    <div className='activity-div'>
      {renderActivity(activitylist)}
    </div>

  )
}
