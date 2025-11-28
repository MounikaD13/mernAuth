import React, { useState, useContext } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'
import { AuthContext } from './context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  function handleChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }
  function handleSubmit(e) {
    e.preventDefault()
    console.log(formData)
    axios.post('http://localhost:2000/api/login', formData,
      { withCredentials: true })

      .then((res) => {
        console.log(res.data.message)
        Swal.fire({
          title: "login completed!",
          icon: "success"
        });
        //store the token in frontend
        // localStorage.setItem("token",res.data.token)
        loginUser(res.data)
      })
      .catch((err) => {
        console.log(err.response.data.message)
        Swal.fire({
          icon: "error",
          title: "Invalid user or password not match!",
          text: err.response?.data?.message || err.message || "Something went wrong!",
          footer: '<a href="#">Your not registered yet?</a>'
        });
        navigate("/register");
      })

  }
  return (
    <div>
      <form action="" onSubmit={handleSubmit} className='m-4'>
        <input type="email" name="email" value={formData.email} placeholder='email@gmail.com' onChange={handleChange} />
        <input type="password" name='password' value={formData.password} placeholder='enter your password' onChange={handleChange} />
        <br />
        <button className='mt-1'>Submit</button>
      </form>
    </div>
  )
}
