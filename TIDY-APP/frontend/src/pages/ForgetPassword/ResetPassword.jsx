import React, { useState } from 'react'
import MachineImg from '../../assets/images/washingmachine.png'
import PasswordInput from '../../components/Input/PasswordInput'
import { userAxiosInstance } from '../../utils/axiosinstance';

const ResetPassword = () => {
    const [newPassword,setNewPassword]=useState("");
    const [confirmpassword,setConfirmPassword]=useState("");
    const [error,setError]=useState(null);

    const mobileNumber= sessionStorage.getItem('mobileNumber')
    const handlePasswordReset = async(e) =>{
        e.preventDefault();
        if(!newPassword || !confirmpassword){
            console.error('Please fill in all fields.');
            alert('Please fill in all fields.');
            return;
        }
        if(newPassword !== confirmpassword){
            console.error('Passwords do not match.');
            alert('Passwords do not match. Please try again.');
            return;
        }
        try{
            const response = await userAxiosInstance.post("/reset-password",{
                mobileNumber: mobileNumber, 
                newPassword: newPassword,
            })
            if(response){
              console.log('New password saved:', newPassword);
              alert('Password reset successfully!');
            }
        }catch(error){
            console.log('Error during password reset:', error);
            alert('An error occurred while resetting the password.');
        }
          
    }
    return (
      <div className='forgot-password-container'>
          <div className='forgot-password-sub-container'>
            <img src={MachineImg} alt="Washing Machine" width="100" height="100"/>
            <p className='styled-tag'>We Makes Everything Clean</p>
            <form onSubmit={handlePasswordReset}>
                <PasswordInput
                    value={newPassword}
                    placeholder='New Password'
                    onChange={(e)=>{setNewPassword(e.target.value)}}
                    />
                <PasswordInput
                    value={confirmpassword}
                    placeholder='Renter Password'
                    onChange={(e)=>{setConfirmPassword(e.target.value)}}
                    />
                {error && <p className="error-message">{error}</p>}
                <button type='submit' className='btn-primary'>Reset</button>
            </form>
          </div>
      </div>
    )
  }

export default ResetPassword