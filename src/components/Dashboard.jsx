import React, { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import "./Dashboard.css"
const Dashboard = () => {
  const[search,setSearch]=useState("")
  const[addinput,setAddinput]=useState("")
  const[role,setRole]=useState("")
  const[date,setDate]=useState("")
  const[status,setStatus]=useState("")
  const[edit,setEdit]=useState("")
  const[error,setError]=useState("")
  const[statusfilter,setStatusfilter]=useState("All")
  const[currentpage,setCurrentpage]=useState(0)
  const companiesperpage=3;
  const startIndex=currentpage*companiesperpage
  const endIndex=startIndex+companiesperpage
    const [application,setApplication]=useState([
        {id:1,
        companyname:"JPMorgan", 
        Role:"Frontend Developer", 
         AppliedDate:"10-Aug-2026" , 
        status:"Applied"},
        {id:2,
        companyname:"Infosys",
        Role:"React Developer", 
         AppliedDate:"5-sep-2026" , 
        status:"Interview"},
        {
            id:3,
            companyname:"TCS",
            Role:"web Developer",
             AppliedDate:"20-jan-2026",
            status:"Rejected"
        },
        {
            id:4,
            companyname:'cognizant',
            Role:"JavaSCript Developer",
            AppliedDate:"14-mar-2026",
            status:"Offer"
        },
        {
          id:5,
          companyname:"wipro",
          Role:"Software Engineer",
          AppliedDate:"12-apr-2026",
          status:"Interview"
        }

    ])
    const totalapplied=application.filter((ele)=>ele.status==="Applied")
    const totalinterview=application.filter((ele)=>ele.status==="Interview")
    const totalRejected=application.filter((ele)=>ele.status==="Rejected")
    const totalOffer=application.filter((ele)=>ele.status==="Offer")
    const filterusers=application.filter((ele)=>{
      return(
      ele.companyname.toLowerCase().includes(search.toLowerCase()) ||
      ele.Role.toLowerCase().includes(search.toLowerCase()))
    })
    const handleSearch=(e)=>{
      let value=e.target.value
      setSearch(value)
    }
    let newcompany={
      id:Date.now(),
      companyname:addinput,
      Role:role,
      AppliedDate:date,
      status:status}
    const handleAdd=()=>{
      if(addinput===""||role===""||date===""||status==="")
      {
       let errormessage="Please fill all fields"
        setError(errormessage)
        return
      }
      else{
      setApplication([...application,newcompany])
      setAddinput("")
      setRole("")
      setDate("")
      setStatus("")
      setError("")
      }
    }
    const handleDelete=(id)=>{
     let deleteditem= application.filter((ele)=>ele.id!==id)
     setApplication(deleteditem)
    }
    const handleEdit=(id)=>{
      let editedid=application.find((ele)=>ele.id===id)
      if(editedid){
        setAddinput(editedid.companyname)
        setRole(editedid.Role)
        setDate(editedid.AppliedDate)
        setStatus(editedid.status)
        setEdit(id)
      }
    }
    const handleUpdate=()=>{
      const updateddata=application.map((ele)=>{
        if(ele.id===edit){
          return{...ele,companyname:addinput,Role:role,AppliedDate:date,status:status}
        }
        else{
          return ele
        }
      })
      setApplication(updateddata)
      setAddinput("")
      setRole("")
      setStatus("")
      setDate("")
      setEdit("")
    }
    const handleprev=()=>{
        setCurrentpage(currentpage-1)
    }
    const handlenext=()=>{
      setCurrentpage(currentpage+1)
    }
useEffect(()=>{
let str=JSON.stringify(application)
localStorage.setItem('application',str)

},[application])

useEffect(()=>{
  let data=localStorage.getItem('application')
  let obj=JSON.parse(data)

  if(obj){
    setApplication(obj)
  }
},[])
const navigate=useNavigate()
const handleLogout=()=>{
  navigate('/')
  localStorage.removeItem("isLoggedin")
}
const filtersearchandstatus=application.filter((ele)=>{
const matchesSearch =
  ele.companyname.toLowerCase().includes(search.toLowerCase()) ||
  ele.Role.toLowerCase().includes(search.toLowerCase())

const matchesStatus =
  statusfilter === "All" ||
  ele.status === statusfilter

  return matchesSearch && matchesStatus
})
const datatodisplay=filtersearchandstatus

const displaylist=datatodisplay.slice(startIndex,endIndex)

  return (
    <div className='container'>
      <h1 className="heading">🚀AI Job Application Tracker</h1>
      <div>
      <input type='text' value={search} onChange={handleSearch} placeholder='search' className="search"></input>
      </div>
      <input type="text" value={addinput} placeholder="Enter Companyname..."onChange={(e)=>setAddinput(e.target.value)}></input>
      <input type="text" value={role} placeholder="Enter Role..."onChange={(e)=>setRole(e.target.value)}></input>
      <input type="date"value={date} onChange={(e)=>setDate(e.target.value)}></input>
     
     <select value={statusfilter} onChange={(e)=>setStatusfilter(e.target.value)}>
        <option value="All">All</option>
        <option value="Applied">Applied</option>
        <option value="Interview">Interview</option>
        <option value="Rejected">Rejected</option>
        <option value="Offer">Offer</option>
      </select>
{error && <p style={{color:"red"}}>{error}</p>}
    {edit===""?<button onClick={handleAdd}>Add</button>:<button onClick={handleUpdate}>Update</button>}  
      
      {/* {filterusers.map((ele)=><p>{ele.company} {ele.role} {ele.AppliedDate} {ele.status}</p>)} */}
    <div className='cards'>
      <diV className='card' id="total"><h3>Total:</h3><p>{application.length}</p></diV>
      <div className='card' id="applied"><h3>Applied:</h3><p>{totalapplied.length}</p></div>
      <div className='card' id="interview"><h3>Interview:</h3><p>{totalinterview.length}</p></div>
      <div className='card' id="rejected"><h3>Rejected:</h3><p>{totalRejected.length}</p></div>
      <div className='card' id="offer"><h3>Offer:</h3><p>{totalOffer.length}</p></div>
     </div>

    {search!="" && filterusers.length===0 && <p style={{color:"red"}}>Not found</p>}
       {datatodisplay.length === 0 && (
  <p>No applications found</p>
)}
      <table className='table'>
        <tr>
        <th>companyname</th>
        <th>Role</th>
        <th>AppliedDate</th>
        <th>status</th>
        <th colSpan="2">Action</th>
       
       </tr>
   

        {displaylist.map((ele)=>(
       <tr key={ele.id}>
       <td>{ele.companyname}</td>
        <td>{ele.Role}</td>
        <td>{ele.AppliedDate}</td>
        <td>{ele.status}</td>
        <td>
         <button onClick={()=>handleDelete(ele.id)} className='delete-btn'>Delete</button></td>
         <td><button onClick={()=>handleEdit(ele.id)} className='edit-btn'>Edit</button></td>
       </tr>
        
        )
        )}
      
      </table>

      <div className='pagination'>
      <button onClick={handleprev} disabled={currentpage===0}>Prev</button>
      <span>{currentpage+1}</span>
      <button onClick={handlenext} disabled={endIndex>=datatodisplay.length}>Next</button>
      </div>

     <div className='logout-btn'>
    <button onClick={handleLogout}>Logout</button>
    </div>
    
    </div>
  )
}


export default Dashboard
