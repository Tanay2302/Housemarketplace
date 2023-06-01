import React from 'react'
import { Navigate,Outlet } from 'react-router-dom'
import { useAuthStatus } from '../hooks/useAuthStatus'
const PrivateRoute = () => {
    const {loggedin,checkstatus}=useAuthStatus()
    if(checkstatus){
        return <h3>loading</h3>
    }
  return loggedin?<Outlet/>:<Navigate to='/sign-in'/>
}

export default PrivateRoute
