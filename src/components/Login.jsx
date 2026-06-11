import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'
const Login = () => {
    const[email,setEmail]=useState("")
    const[password,setPassword]=useState("")
    const[error,setError]=useState("")
  const navigate=useNavigate()
    const handleSubmit=(e)=>{
      e.preventDefault()
      if(email.trim()===""){
        let emailerror= "email is empty"
        setError(emailerror)
        return
      }
     else if(password.trim()===""|| password.length<6){
        let passerror="password should contains morethan 6 characters"
        setError(passerror)
        return
      }
    setError("")
    localStorage.setItem("isLoggedin","true")
    navigate("/Dashboard")
    }
  return (
    <div  className='login'>
      <h1>Login </h1>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input type="email"  value={email} onChange={(e)=>setEmail(e.target.value)}></input>
        <label>Password</label>
        <input type="password" value={password}onChange={(e)=>setPassword(e.target.value)}></input>
       {error && <p style={{color:"red"}}>{error}</p>}
        <button type="submit" className="sigin">Sigin</button>
      </form>
    </div>
  )
}

export default Login
