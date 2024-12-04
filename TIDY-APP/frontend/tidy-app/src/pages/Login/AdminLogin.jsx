import React, { useState } from 'react'
import MachineImg from '../../assets/images/washingmachine.png'
import PasswordInput from '../../components/Input/PasswordInput'
import { Link, useNavigate } from 'react-router-dom';
import { adminAxiosInstance } from '../../utils/axiosinstance';
import { validateEmail } from '../../utils/helper';


const AdminLogin = () => {
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [error,setError]=useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) =>{
        e.preventDefault();
        if(!validateEmail(email)){
            setError("Please enter email");
            return;
          }
        if(!password){
            setError("Please enter the password");
            return;
        }
        setError(""); 
        // Login API Call
        try{
            const response = await adminAxiosInstance.post("/login",{
                email,
                password,
            });
            if(response.data && response.data.token){
                localStorage.setItem("token",response.data.token)
                // localStorage.setItem("userId",response.data)
                console.log(response.data,"response");
                navigate("/admin/dashboard")
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
        <div className='login-container'>
            <div className='login-sub-container'>
              <img src={MachineImg} alt='Washing Machine' width="100" height="100"/>
              <p className='styled-tag'>We Makes Everything Clean</p>
              <form onSubmit={handleLogin}>
                  <h4 className='heading'>Admin Login</h4>
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
                  {error &&<p className='error-text'>{error}</p>}
                  <button type='submit' className='btn-primary'>Login</button>
                  <p className='styled-paragraph'>
                        <Link to="/forgot-password" className='styled-link'>Forget Password?</Link>
                  </p>                  
                   <p className='styled-paragraph'>
                        Not registered yet?
                        <Link to="/admin/signup" className='styled-link'>Create an Account</Link>
                  </p>
              </form>
            </div>
        </div>
      )
}

export default AdminLogin