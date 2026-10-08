import React from 'react'
import { getName } from '../../utils/helper'

const ProfileInfo = ({name}) => {
  return (
    <div>
        <h2>Welcome  {getName(name)}</h2>
    </div>
  )
}

export default ProfileInfo