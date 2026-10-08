import React, { useState } from 'react'
import PasswordInput from '../../components/Input/PasswordInput'
import { Link, useNavigate } from 'react-router-dom'
import './SignUp.css'
import { validateEmail, validateMobile } from '../../utils/helper'
import {userAxiosInstance} from '../../utils/axiosinstance'
import MachineImg from '../../assets/images/washingmachine.png'

const SignUp = () => {
    const [name,setName]=useState("");
    const [email,setEmail]=useState("");
    const [mobileNumber, setMobileNumber] = useState("");
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
        if (!validateMobile(mobileNumber)){
          setError("Please enter valid mobile number");
          return;
        }
        if(!password){
          setError("Please enter the password");
          return;
        }
        setError("");
      // signUp API Call
      try{
          const response = await userAxiosInstance.post("/signup",{
            name:name,
            email:email,
            mobileNumber:mobileNumber,
            password:password
          })          
          if(response.data && response.data.accesstoken){
            localStorage.setItem("token",response.data.accesstoken)
            navigate("/addprofile");
          }          
      }catch(error){
          console.log(error);
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
                <h4 className='heading'>SignUp</h4>
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
                {error && <p className='error-text'>{error}</p>}
                <button type='submit' className='btn-primary'>Create Account</button>
                <p className='styled-paragraph'>
                    Already have an account?
                    <Link to="/login" className='styled-link'>Login</Link></p>
            </form>
          </div>
      </div>
    )
}

export default SignUp