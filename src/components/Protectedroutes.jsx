import React from 'react'
import { Navigate } from 'react-router-dom'
import Dashboard from "./Dashboard"
const Protectedroutes = () => {
let loggedinresult=localStorage.getItem("isLoggedin")
if(loggedinresult!=="true"){
  return <Navigate to="/" />
}
  return (
    <div>
      <Dashboard/>
    </div>
  )
}

export default Protectedroutes
