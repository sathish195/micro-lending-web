


import React from 'react'
import Userdashbord from './Userdashbord'
import authService from '../../services/authService'
import Admindashbord from './Admindashbord'

function Dashbord() {
  return (
    <div>
      {!authService.IsAdmin() &&
        <Userdashbord></Userdashbord>}

      {authService.IsAdmin() &&
        <Admindashbord></Admindashbord>}


    </div>
  )
}

export default Dashbord