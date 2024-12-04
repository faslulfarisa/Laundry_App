import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PasswordInput from '../../components/Input/PasswordInput'
import './Login.css'
import { validateMobile } from '../../utils/helper'
import MachineImg from '../../assets/images/washingmachine.png'
import {userAxiosInstance} from '../../utils/axiosinstance'

const Login = () => {
    const [mobileNumber, setMobileNumber] = useState("");
    const [password,setPassword]=useState("");
    const [error,setError]=useState(null);
    const navigate = useNavigate();
  
    const handleLogin = async (e) =>{
      e.preventDefault();
      if (!validateMobile(mobileNumber)){
          setError("Please enter valid mobile number");
          return;
      }
      if(!password){
          setError("Please enter the password");
          return;
      }
      setError("");
      // Login API Call
      try{
        const response = await userAxiosInstance.post("/login",{
            mobileNumber:mobileNumber,
            password:password
        })
        if(response.data && response.data.accesstoken){
            localStorage.setItem("token",response.data.accesstoken)
            localStorage.setItem("userId",response.data.payload.id)
            console.log(response.data.accesstoken,"loginpage")
            console.log(response.data.payload.id,"userid")
            navigate("/home");
        }
      }catch(error){        
            if(error.response && error.response.data && error.response.data.message){
                setError(error.response.data.message)
            }else{
                console.log(error); 
                setError("An unexpected error ocurred.Please try again")
            }
      }      
    }
    return (
      <div className='login-container'>
          <div className='login-sub-container'>
            <img src={MachineImg} alt='Washing Machine' width="100" height="100"/>
            <p className='styled-tag'>We Makes Everything Clean</p>
                <form onSubmit={handleLogin}>
                    <h4 className='heading'>Login</h4>
                    <input 
                        type='text'
                        placeholder='Mobile Number'
                        className='input-box'
                        value={mobileNumber}
                        onChange={(e)=>{setMobileNumber(e.target.value)}}
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
                        <Link to="/signup" className='styled-link'>Create an Account</Link>
                    </p>
                </form>
          </div>
      </div>
    )
}

export default Login