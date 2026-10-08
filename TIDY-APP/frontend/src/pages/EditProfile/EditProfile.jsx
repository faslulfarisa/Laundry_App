import React, { useEffect, useState } from 'react'
import  './EditProfile.css'
import {MdCreate} from "react-icons/md"
import Sidebar from '../../components/Sidebar/Sidebar'
import { useNavigate } from 'react-router-dom'
import {userAxiosInstance} from '../../utils/axiosinstance'
import { validateEmail, validateMobile, validateZipCode } from '../../utils/helper'
import PasswordInput from '../../components/Input/PasswordInput'

const EditProfile = () => {
    const [userData,setUserData]=useState({
        name:"",
        email:"",
        mobileNumber:"",
        address:"",
        zipCode:"",

    });
    const [isEditting,setIsEditting]=useState(false);
    const [error,setError]=useState(null);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const navigate = useNavigate();


    // API for FetchUserData
    const fetchUserData = async()=>{
        try{
            const response = await userAxiosInstance.get('/get-user')
            if(response.data && response.data.user){
                // console.log(response.data.user,"User data");
                setUserData(response.data.user); 
            }       
        }catch(error){
            console.error("Error fetching user data:", error);
        }
    }
    const handleEditClick = () =>{
        setIsEditting(!isEditting)
    }
    const handleInputChange = (e) =>{
        const{name,value}=e.target;
        setUserData(prevState =>({
            ...prevState,
            [name]:value
        }));
    }
    const handlePasswordChangeClick = (e)=>{
        e.preventDefault();
        setShowPasswordFields(true);
    }
    const handleSubmit = async(e) =>{
        e.preventDefault();
        if(!validateEmail(userData.email)){
            setError("Please enter a valid email");
            return;
        }
        if(!validateMobile(userData.mobileNumber)){
            setError("Please enter a valid mobile number");
            return;
        }
        if(!validateZipCode(userData.zipCode)){
            setError("Please enter a valid PIN code");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("New Password and Confirm Password do not match.");
            return;
        }
        setError("");
        // Edit profile API Call
        const userId=userData.id;
        console.log("userData before creating formData:", userData);
        const formData = new FormData();
        formData.append("name", userData.name);
        formData.append("email", userData.email);
        formData.append("mobileNumber", userData.mobileNumber);
        formData.append("address", userData.address);
        formData.append("zipCode", userData.zipCode);
        formData.append("currentPassword", currentPassword);
        formData.append("newPassword", newPassword);
        if (userData.profileImage) {
            formData.append("profileImage", userData.profileImage);
        }
        console.log("Debugging FormData:");
        try{            
            const response = await userAxiosInstance.put("/editprofile/" + userId , formData,{                
                headers: { 'Content-Type': 'multipart/form-data' },
            })            
            if(response.data){
                navigate('/order')
            }
        }catch(error){
            console.log("Error updating profile",error);  
            if(error.response && error.response.data && error.response.data.message){
                setError(error.response.data.message)
            }else{
                setError("An unexpected error occurred.Please try again")
            }
        }
    }
    useEffect(()=>{
        fetchUserData();
    },[])
    return (
        <div className='container'>
                <Sidebar/>
                <div className='right-container'>
                    <div className='edit-icon-container'>
                        Edit My Profile
                        <MdCreate onClick={handleEditClick}/>
                    </div>
                    <div className='form-container'>
                        <form onSubmit={handleSubmit}>
                            <input 
                                type='text' 
                                name='name'
                                value={userData.name}
                                onChange={handleInputChange}
                                placeholder='Name' 
                                className='input-box'
                                disabled={!isEditting}/>
                            <input 
                                type='text' 
                                name='email'
                                value={userData.email}
                                onChange={handleInputChange}
                                placeholder='Email'
                                className='input-box'
                                disabled={!isEditting}/>
                            <input 
                                type='text' 
                                name='mobileNumber'
                                value={userData.mobileNumber}
                                onChange={handleInputChange}
                                placeholder='Mobile Number'
                                className='input-box'
                                disabled={!isEditting}/>
                             <textarea 
                                name='address'
                                value={userData.address}
                                onChange={handleInputChange}
                                placeholder='Address'
                                className={`textarea-box ${!isEditting?'read-only':''}`}
                                readOnly={!isEditting}  />
                            <input 
                                type='text' 
                                name='zipCode'
                                value={userData.zipCode}
                                onChange={handleInputChange}
                                placeholder='ZipCode'
                                className='input-box'
                                disabled={!isEditting}/>
                            {showPasswordFields && (
                                <div className='password-reset-fields'>
                                <PasswordInput
                                    value={currentPassword}
                                    placeholder="Current Password"
                                    disabled={!isEditting}
                                    onChange={(e)=>{setCurrentPassword(e.target.value)}}/>
                                <PasswordInput
                                    value={newPassword}
                                    placeholder="New Password"
                                    disabled={!isEditting}
                                    onChange={(e)=>{setNewPassword(e.target.value)}}/>
                                <PasswordInput
                                    value={confirmPassword}
                                    placeholder="Confirm Password"
                                    disabled={!isEditting}
                                    onChange={(e)=>{setConfirmPassword(e.target.value)}}/>
                                </div>
                            )}
                            {error && <p className='error-text'>{error}</p>}
                            {isEditting &&
                            <button type='submit' className='save-button'>SAVE</button>}
                        </form>
                    </div>
                </div> 
                {!showPasswordFields &&(
                    <button
                        onClick={handlePasswordChangeClick} 
                        className='change-password-button user-profile'
                        disabled={!isEditting}>
                        Change Password
                    </button> 
                )}       
        </div>
    )
}

export default EditProfile