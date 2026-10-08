import React, { useEffect, useState } from 'react'
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar'
import {MdCreate} from "react-icons/md"
import { adminAxiosInstance } from '../../utils/axiosinstance';
import { useNavigate } from 'react-router-dom';
import PasswordInput from '../../components/Input/PasswordInput';
import  './AdminProfile.css'
import { validateEmail, validateMobile } from '../../utils/helper';

const AdminProfile = () => {
    const [data, setData] = useState({ name: '', email: '', mobileNumber: '',role:'',});
    const [ currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const[isEditting,setIsEditting]=useState(false);
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [error,setError]=useState(null);
    const navigate = useNavigate();
    console.log(data,"data");
    
    // API for FetchAdminData
    const fetchAdminData = async() =>{
        try{
            const response = await adminAxiosInstance.get('/get-admin-details')
            if(response.data && response.data.admin){
                console.log(response.data.admin,"response");
                setData(response.data.admin)
            }
        }catch(error){
            if (error.response) {
                console.error("Error fetching admin data:", error.response.data);
            } else {
                console.error("Error:", error.message);
            }        
        }
    }   
    useEffect(()=>{
        fetchAdminData();
    },[])

    const handleEditClick = () =>{
        setIsEditting(!isEditting)
    }
    const handlePasswordChangeClick = (e)=>{
        e.preventDefault();
        setShowPasswordFields(true);
        setIsEditting(true);
    }
    const handleInputChange = (e) =>{
        const{name,value}=e.target;
        setData(prevState =>({
            ...prevState,
            [name]:value
        }));
    }
    const handleSubmit = async(e) =>{
        e.preventDefault();
        if(!validateEmail(data.email)){
            setError("Please enter a valid email");
            return;
        }
        if(!validateMobile(data.mobileNumber)){
            setError("Please enter a valid mobile number");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("New Password and Confirm Password do not match.");
            return;
        }
        console.log(data.password,"password");
        setError("");
        // Edit Admin profile API Call
        try{
            const response = await adminAxiosInstance.put('/edit-admin-profile',{
                name:data.name,
                email:data.email,
                mobileNumber:data.mobileNumber,
                role:data.role,
                // Include current and new password only if they're provided
                currentPassword: currentPassword,
                newPassword: newPassword
            });
            if(response){
                console.log("Profile updated successfully:");
                navigate('/admin/orders')
            }
        }catch(error){
            if(error.response && error.response.data && error.response.data.message){
                setError(error.response.data.message)
            }else{
                setError("An unexpected error occurred.Please try again")
            }
        } 
    }
    
    return (
        <div className='container'>
                <AdminSidebar/>
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
                                value={data.name}
                                onChange={handleInputChange}
                                placeholder='Name' 
                                className='input-box'
                                disabled={!isEditting}/>
                            <input 
                                type='text' 
                                name='email'
                                value={data.email}
                                onChange={handleInputChange}
                                placeholder='Email'
                                className='input-box'
                                disabled={!isEditting}/>
                            <input 
                                type='text' 
                                name='mobileNumber'
                                value={data.mobileNumber}
                                onChange={handleInputChange}
                                placeholder='Mobile Number'
                                className='input-box'
                                disabled={!isEditting}/>
                            <select 
                                name='role'
                                value={data.role}
                                onChange={handleInputChange}
                                disabled={!isEditting}
                                className='input-box'
                                >
                                    <option value="">Select Role</option> 
                                    <option value="superAdmin">Super Admin</option>
                                    <option value="orderManager">Order Manager</option>
                                    <option value="supportAdmin">Support Admin</option>
                            </select>
                            {isEditting && showPasswordFields && (
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
                    {!showPasswordFields &&(
                        <button
                            onClick={handlePasswordChangeClick} 
                            className='change-password-button'
                            disabled={!isEditting}>
                            Change Password
                        </button>
                    )}
                </div>    
        </div>
    )
}

export default AdminProfile