import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { FaSearch, FaTrash, FaEdit, FaSignOutAlt, FaPlus, FaInbox } from 'react-icons/fa';
import "./Dashboard.css";

import { db } from '../firebase'; 
import { collection, addDoc, deleteDoc, updateDoc, doc, onSnapshot } from "firebase/firestore";

// Default placeholder jobs defined outside the component
const DEFAULT_JOBS = [
  { id: "sample1", companyname: "JPMorgan", Role: "Frontend Developer", AppliedDate: "2026-08-10", status: "Applied" },
  { id: "sample2", companyname: "Infosys", Role: "React Developer", AppliedDate: "2026-09-05", status: "Interview" },
  { id: "sample3", companyname: "TCS", Role: "web Developer", AppliedDate: "2026-01-20", status: "Rejected" }
];

const Dashboard = () => {
  const [darktheme, setDarktheme] = useState(true);
  const [search, setSearch] = useState("");
  const [addinput, setAddinput] = useState("");
  const [role, setRole] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");
  const [edit, setEdit] = useState("");
  const [error, setError] = useState("");
  const [statusfilter, setStatusfilter] = useState("All");
  const [currentpage, setCurrentpage] = useState(0);
  
  const [application, setApplication] = useState([]);
  // Tracks locally deleted sample IDs so they don't reappear via snapshot loops
  const [deletedSampleIds, setDeletedSampleIds] = useState([]);

  const companiesperpage = 3;
  const startIndex = currentpage * companiesperpage;
  const endIndex = startIndex + companiesperpage;
  
  // Real-time synchronization with Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "jobs"), (snapshot) => {
      const firebaseJobs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      // Exclude hardcoded samples that the user deleted in this session
      const activeDefaults = DEFAULT_JOBS.filter(job => !deletedSampleIds.includes(job.id));

      setApplication([...activeDefaults, ...firebaseJobs]);
    });

    return () => unsubscribe();
  }, [deletedSampleIds]);

  const totalapplied = application.filter((ele) => (ele.status || "") === "Applied");
  const totalinterview = application.filter((ele) => (ele.status || "") === "Interview");
  const totalRejected = application.filter((ele) => (ele.status || "") === "Rejected");
  const totalOffer = application.filter((ele) => (ele.status || "") === "Offer");

  // Safe filtering logic using fallbacks to empty strings to avoid 'undefined' errors
  const filterusers = application.filter((ele) => {
    const company = ele.companyname || "";
    const jobRole = ele.Role || "";
    
    return (
      company.toLowerCase().includes(search.toLowerCase()) ||
      jobRole.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentpage(0); // Reset page on new search
  };

  const handleAdd = async () => {
    if (addinput === "" || role === "" || date === "" || status === "") {
      setError("Please fill all fields");
      return;
    }
    try {
      let newcompany = {
        companyname: addinput,
        Role: role,
        AppliedDate: date,
        status: status
      };
      
      await addDoc(collection(db, "jobs"), newcompany);

      setAddinput("");
      setRole("");
      setDate("");
      setStatus("");
      setError("");
      setCurrentpage(0);
    } catch (err) {
      setError("Failed to add entry to Firebase.");
    }
  };

  const handleDelete = async (id) => {
    try {
      if (id.toString().startsWith("sample")) {
        setDeletedSampleIds(prev => [...prev, id]);
      } else {
        await deleteDoc(doc(db, "jobs", id));
      }
    } catch (err) {
      console.error("Error deleting document: ", err);
    }
  };

  const handleEdit = (id) => {
    let editedid = application.find((ele) => ele.id === id);
    if (editedid) {
      setAddinput(editedid.companyname || "");
      setRole(editedid.Role || "");
      setDate(editedid.AppliedDate || "");
      setStatus(editedid.status || "");
      setEdit(id);
    }
  };

  const handleUpdate = async () => {
    if (addinput === "" || role === "" || date === "" || status === "") {
      setError("Please fill all fields");
      return;
    }
    try {
      if (edit.toString().startsWith("sample")) {
        // Turn edited sample jobs into real entries in Firestore
        await addDoc(collection(db, "jobs"), {
          companyname: addinput,
          Role: role,
          AppliedDate: date,
          status: status
        });
        setDeletedSampleIds(prev => [...prev, edit]);
      } else {
        const docRef = doc(db, "jobs", edit);
        await updateDoc(docRef, {
          companyname: addinput,
          Role: role,
          AppliedDate: date,
          status: status
        });
      }

      setAddinput("");
      setRole("");
      setStatus("");
      setDate("");
      setEdit("");
      setError("");
    } catch (err) {
      console.error("Error updating document: ", err);
    }
  };

  const handleprev = () => {
    setCurrentpage(currentpage - 1);
  };
  const handlenext = () => {
    setCurrentpage(currentpage + 1);
  };

  const navigate = useNavigate();
  const handleLogout = () => {
    document.body.classList.remove("dark");
    localStorage.removeItem("isLoggedin");
    navigate("/");
  };

  // Safe search and drop-down filter combination logic
  const filtersearchandstatus = application.filter((ele) => {
    const company = ele.companyname || "";
    const jobRole = ele.Role || "";
    const jobStatus = ele.status || "";

    const matchesSearch =
      company.toLowerCase().includes(search.toLowerCase()) ||
      jobRole.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusfilter === "All" ||
      jobStatus === statusfilter;

    return matchesSearch && matchesStatus;
  });

  const displaylist = filtersearchandstatus.slice(startIndex, endIndex);

  const chartData = [
    { name: "Applied", value: totalapplied.length },
    { name: "Interview", value: totalinterview.length },
    { name: "Rejected", value: totalRejected.length },
    { name: "Offer", value: totalOffer.length }
  ];

  const COLORS = ["#22c55e", "#f59e0b", "#ef4444", "#3b82f6"];

  const toggleTheme = () => {
    setDarktheme(!darktheme);
  };

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
      <button onClick={toggleTheme}>
        {darktheme ? "☀ Light Mode" : "🌙 Dark Mode"}
      </button>
      
      <div>
        <input type='text' value={search} onChange={handleSearch} placeholder='search' className="search" />
        <select value={statusfilter} onChange={(e) => { setStatusfilter(e.target.value); setCurrentpage(0); }} className="filter-select">
          <option value="All">All Statuses</option>
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Rejected">Rejected</option>
          <option value="Offer">Offer</option>
        </select>
      </div>
      
      <div className="form-container">
        <input type="text" value={addinput} placeholder="Enter Companyname..." onChange={(e) => setAddinput(e.target.value)} />
        <input type="text" value={role} placeholder="Enter Role..." onChange={(e) => setRole(e.target.value)} />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
       
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Select Status</option>
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Rejected">Rejected</option>
          <option value="Offer">Offer</option>
        </select>

        {error && <p style={{color: "red"}}>{error}</p>}
        {edit === "" ? <button onClick={handleAdd}><FaPlus />Add</button> : <button onClick={handleUpdate}>Update</button>}  
      </div>
      
      <div className='cards'>
        <div className='card' id="total"><h3>Total</h3><p>{application.length}</p></div>
        <div className='card' id="applied"><h3>Applied</h3><p>{totalapplied.length}</p></div>
        <div className='card' id="interview"><h3>Interview</h3><p>{totalinterview.length}</p></div>
        <div className='card' id="rejected"><h3>Rejected</h3><p>{totalRejected.length}</p></div>
        <div className='card' id="offer"><h3>Offer</h3><p>{totalOffer.length}</p></div>
        <div className="card success"><h3>Success Rate</h3><p>{successRate}%</p></div>
      </div>

      {search !== "" && filterusers.length === 0 && <p style={{color: "red"}}>Not found</p>}
      {filtersearchandstatus.length === 0 && (
        <div className="empty-state">
          <FaInbox size={40} />
          <p>No listings match your search criteria.</p>
        </div>
      )}

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={100} innerRadius={50} paddingAngle={5} label>
              {chartData.map((entry, index) => <Cell key={index} fill={COLORS[index]} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className='table-container'>
        <table className='table'>
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Role</th>
              <th>Applied Date</th>
              <th>Status</th>
              <th colSpan="2">Action</th>
            </tr>
          </thead>
          <tbody>
            {displaylist.map((ele) => (
              <tr key={ele.id}>
                <td>{ele.companyname || "N/A"}</td>
                <td>{ele.Role || "N/A"}</td>
                <td>{ele.AppliedDate || "N/A"}</td>
                <td><span className={`status ${ele.status || "Unknown"}`}>{ele.status || "Unknown"}</span></td>
                <td><button onClick={() => handleDelete(ele.id)} className='delete-btn'><FaTrash />Delete</button></td>
                <td><button onClick={() => handleEdit(ele.id)} className='edit-btn'><FaEdit />Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='pagination'>
        <button onClick={handleprev} disabled={currentpage === 0}>Prev</button>
        <span>{currentpage + 1}</span>
        <button onClick={handlenext} disabled={endIndex >= filtersearchandstatus.length}>Next</button>
      </div>

      <div className='logout-btn'>
        <button onClick={handleLogout}><FaSignOutAlt />Logout</button>
      </div>
    </div>
  );
};

export default Dashboard;