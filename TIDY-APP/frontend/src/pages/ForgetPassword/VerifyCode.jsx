import React, { useState } from 'react'
import MachineImg from '../../assets/images/washingmachine.png'
import { useNavigate } from 'react-router-dom';

const VerifyCode = () => {
  const [code,setCode]=useState("");
  const navigate=useNavigate();

  const handleCodeVerification = (e) =>{
      e.preventDefault();
      const generatedOTP = sessionStorage.getItem('generatedOTP')
      console.log('Verification code:', generatedOTP);
      if(code === generatedOTP){
          navigate('/reset-password');
          console.log("verification successful",code);
      }else{
          console.error('Verification failed: Invalid code');
          alert('Invalid OTP! Please try again.');
      }
  }
  return (
    <div className='forgot-password-container'>
        <div className='forgot-password-sub-container'>
          <img src={MachineImg} alt="Washing Machine" width="100" height="100"/>
          <p className='styled-tag'>We Makes Everything Clean</p>
          <form onSubmit={handleCodeVerification}>
              <input 
                  type='text'
                  placeholder='Enter verification code'
                  value={code}
                  onChange={(e)=>{setCode(e.target.value)}}
                  className='input-box'
                  />
              <button type='submit' className='btn-primary'>Verify</button>
          </form>
        </div>
    </div>
  )
}

export default VerifyCode