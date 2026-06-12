import React, { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from "recharts";
import { ResponsiveContainer } from 'recharts';
import { FaSearch, FaTrash, FaEdit, FaSignOutAlt, FaPlus,FaInbox } from 'react-icons/fa';
import "./Dashboard.css"
const Dashboard = () => {
  const[darktheme,setDarktheme]=useState(true)
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
   const totalOffer = application.filter(
  (ele)=>ele.status==="Offer"
)
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
      setCurrentpage(0)
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
  document.body.classList.remove("dark");
  localStorage.removeItem("isLoggedin");
  navigate("/");
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

const chartData = [
  { name: "Applied", value: totalapplied.length },
  { name: "Interview", value: totalinterview.length },
  { name: "Rejected", value: totalRejected.length },
  { name: "Offer", value: totalOffer.length }
];
const COLORS = [
  "#22c55e", // Applied - Green
  "#f59e0b", // Interview - Orange
  "#ef4444", // Rejected - Red
  "#3b82f6"  // Offer - Blue
];
const toggleTheme=()=>{
  setDarktheme(!darktheme)
}
useEffect(() => {
  if (darktheme) {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
}, [darktheme]);

const successRate =
  application.length === 0
    ? 0
    : ((totalOffer.length / application.length) * 100).toFixed(1);
  return (
    <div className='container'>
      <h1 className="heading">🚀AI Job Application Tracker</h1>
      <div className={darktheme ? "dark" : ""}></div>
      <button onClick={toggleTheme}>
  {darktheme ? "☀ Light Mode" : "🌙 Dark Mode"}
</button>
      <div>
      <input type='text' value={search} onChange={handleSearch} placeholder='search' className="search"></input>

      </div>
      <input type="text" value={addinput} placeholder="Enter Companyname..."onChange={(e)=>setAddinput(e.target.value)} ></input>
      <input type="text" value={role} placeholder="Enter Role..."onChange={(e)=>setRole(e.target.value)}></input>
      <input type="date"value={date} onChange={(e)=>setDate(e.target.value)}></input>
     
     <select value={status} onChange={(e)=>setStatus(e.target.value)}>
  <option value="">Select Status</option>
  <option value="Applied">Applied</option>
  <option value="Interview">Interview</option>
  <option value="Rejected">Rejected</option>
  <option value="Offer">Offer</option>
</select>
{error && <p style={{color:"red"}}>{error}</p>}
    {edit===""?<button onClick={handleAdd} ><FaPlus />Add</button>:<button onClick={handleUpdate}>Update</button>}  
      
      {/* {filterusers.map((ele)=><p>{ele.company} {ele.role} {ele.AppliedDate} {ele.status}</p>)} */}
    <div className='cards'>
      <diV className='card' id="total"><h3>Total</h3>
      <p>{application.length}</p></diV>
      <div className='card' id="applied"><h3>Applied</h3>
      <p>{totalapplied.length}</p></div>
      <div className='card' id="interview"><h3>Interview</h3>
      <p>{totalinterview.length}</p></div>
      <div className='card' id="rejected"><h3>Rejected</h3>
      <p>{totalRejected.length}</p></div>
      <div className='card' id="offer"><h3>Offer</h3>
      <p>{totalOffer.length}</p></div>
      <div className="card success">
  <h3>Success Rate</h3>
  <p>{successRate}%</p>
</div>
     </div>

    {search!="" && filterusers.length===0 && <p style={{color:"red"}}>Not found</p>}
      {datatodisplay.length === 0 && (
  <div className="empty-state">
    <FaInbox size={40} />
    
  </div>
)}

<div className="chart-container">
  <ResponsiveContainer width="100%" height={300}>
<PieChart width={400} height={300}>
  <Pie
    data={chartData}
    dataKey="value"
    nameKey="name"
    outerRadius={100}
    innerRadius={50}
  paddingAngle={5}
    label
  >
  {chartData.map((entry, index) => (
      <Cell
        key={index}
        fill={COLORS[index]}
      />
    ))}
    </Pie>
  <Tooltip />
  <Legend />
</PieChart>
</ResponsiveContainer>
</div>
      <div className='table-container'>
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
       <td>
  <span className={`status ${ele.status}`}>
    {ele.status}
  </span>
</td>
        <td>
         <button onClick={()=>handleDelete(ele.id)} className='delete-btn'><FaTrash />Delete</button></td>
         <td><button onClick={()=>handleEdit(ele.id)} className='edit-btn'><FaEdit />Edit</button></td>
       </tr>
        
        )
        )}
      
      </table>
        </div>
      <div className='pagination'>
      <button onClick={handleprev} disabled={currentpage===0}>Prev</button>
      <span>{currentpage+1}</span>
      <button onClick={handlenext} disabled={endIndex>=datatodisplay.length}>Next</button>
      </div>


        
     <div className='logout-btn'>
    <button onClick={handleLogout}><FaSignOutAlt />Logout</button>
    </div>
    
    </div>
  )
}


export default Dashboard
