import React, { useState } from 'react'
import MachineImg from '../../assets/images/washingmachine.png'
import './ForgetPassword.css'
import { validateMobile } from '../../utils/helper';
import { userAxiosInstance } from '../../utils/axiosinstance';
import { useNavigate } from 'react-router-dom';
// import {toast} from 'react-toastify';

const ForgetPassword = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [error,setError]=useState(null);
  const[message,setMessage]=useState(null);
  const navigate=useNavigate();
  
  const handleGenerateOTP=async(e)=>{
    e.preventDefault();
    if (!validateMobile(mobileNumber)){
      setError("Please enter valid mobile number");
      return;
    }
    try{
        const response= await userAxiosInstance.post("/forgot-password",{
          mobileNumber: mobileNumber
        })
        if(response  && response.data.success){
          console.log(response,"response-forgotpassword");
          
          const otp = Math.floor(100000 + Math.random() * 900000); 
          console.log(otp, "Generated OTP");

          sessionStorage.setItem('generatedOTP', otp);
          sessionStorage.setItem('mobileNumber',mobileNumber);
          navigate('/verify-otp')   
        }
        else{
          setError(response.data.msg);
          console.log(response.data.msg,"error");  
        }
    }catch(error){
      console.error("Error during OTP generation:", error);
      setError(error.response.data.msg,"An error occurred. Please try again later.");
    } 
  }

  return (
    <div className='forgot-password-container'>
        <div className='forgot-password-sub-container'>
            <img src={MachineImg} alt="Washing Machine" width="100" height="100"/>
            <p className='styled-tag'>We Makes Everything Clean</p>
            <form onSubmit={handleGenerateOTP}>
              <h4 className=''>Reset Password </h4>
              <input
                  type='text'
                  placeholder='MobileNumber'
                  value={mobileNumber}
                  onChange={(e)=>{setMobileNumber(e.target.value)}}
                  className='input-box'
                  />
              {error &&<p className='error-text'>{error}</p>}
              {message &&<p className='success-text'>{message}</p>}
              <button type='submit' className='btn-primary'>Submit</button>
            </form>
        </div>
    </div>
  )
}

export default ForgetPassword