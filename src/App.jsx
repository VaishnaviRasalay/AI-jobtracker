import React from 'react'
import Dashboard from './components/Dashboard'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import Protectedroutes from './components/Protectedroutes'
const App = () => {
  return (
    <div>
      <BrowserRouter>
     <Routes>
        <Route path="/" element={<Login/>}></Route>
        <Route path="/Dashboard" element={<Protectedroutes/>}></Route>
       </Routes>
      </BrowserRouter>
  
    </div>
  )
}

export default App
