import React, { useState } from 'react'
import MachineImg from '../../assets/images/washingmachine.png'
import PasswordInput from '../../components/Input/PasswordInput'
import { Link, useNavigate } from 'react-router-dom';
import { adminAxiosInstance } from '../../utils/axiosinstance';
import { validateEmail } from '../../utils/helper';

const AdminSignUp = () => {
    const [name,setName]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [error,setError]=useState(null);
    const navigate = useNavigate();

    const handleSignUp = async(e) =>{
        e.preventDefault();
        if(!name){
          setError("Please enter name");
          return;
        }
        if(!validateEmail(email)){
          setError("Please enter email");
          return;
        }
        if(!password){
          setError("Please enter the password");
          return;
        }
        setError("");
        // admin-signUp API Call
        try{
          const response = await adminAxiosInstance.post("/signup",{
            name,
            email,
            password,
          })
          if(response.data){
            console.log(response,"response");
            navigate("/admin/login")
          }
        }catch(error){
          console.log(error,"error");
          if(error.response && error.response.data && error.response.data.message){
            setError(error.response.data.message)
          }else{
            setError("An unexpected error occurred.Please try again")
          }  
      }
    }
    return (
        <div className='signup-container'>
            <div className='signup-sub-container'>
              <img src={MachineImg} alt='Washing Machine' width="100" height="100"/>
              <p className='styled-tag'>We Makes Everything Clean</p>
              <form onSubmit={handleSignUp}>
                  <h4 className='heading'>Admin SignUp</h4>
                  <input 
                      type='text'
                      placeholder='Name'
                      className='input-box'
                      value={name}
                      onChange={(e)=>{setName(e.target.value)}}/>
                  <input 
                      type='text'
                      placeholder='Email'
                      className='input-box'
                      value={email}
                      onChange={(e)=>{setEmail(e.target.value)}}
                      />
                  <PasswordInput
                      value={password}
                      placeholder='Password'
                      onChange={(e)=>{setPassword(e.target.value)}}/>
                  {error && <p className='error-text'>{error}</p>}
                  <button type='submit' className='btn-primary'>Create Account</button>
                  <p className='styled-paragraph'>
                      Already have an account?
                      <Link to="/admin/login" className='styled-link'>Login</Link></p>
              </form>
            </div>
        </div>
    )
}

export default AdminSignUp