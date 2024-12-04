import React, { useEffect, useRef, useState } from 'react'
import ProfileImg from '../../assets/images/profileimg.png'
import {MdCreate} from "react-icons/md"
import './Sidebar.css'
import { NavLink, useLocation } from 'react-router-dom'
import { userAxiosInstance } from '../../utils/axiosinstance'

const Sidebar = () => {
    const location = useLocation();
    //   console.log(location.pathname);
    const inputRef = useRef();
    const [imageChange,setImageChanged] = useState(false);
    const [selectedImage,setSelectedImage]=useState(ProfileImg);
    const handleImageChange = (event)=>{
        const file=event.target.files[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file));
            setImageChanged(true);
        }
        console.log(event.target.files[0],"file");
    }
    const handleLogout = () =>{
        localStorage.clear();
    }
   // API for FetchUserData
   const fetchUserData = async()=>{
    try{
        const response = await userAxiosInstance.get('/get-user')
        if(response.data && response.data.user){
            const user = response.data.user;
            // console.log(response.data.user.profileImage, "profile image in response");
            // console.log("Fetched User Data:", user);
            // console.log("Profile Image:", user.profileImage || "No profile image provided");
            const profileImageURL = user.profileImage
            ? user.profileImage.replace(/^http:\/\/localhost:3000\/\//, 'http://localhost:3000/')
            : ProfileImg; 
            setSelectedImage(profileImageURL);

        }       
    }catch(error){
        console.error("Error fetching user data:", error);
    }
   }
   const handleImageClick = () =>{
    inputRef.current.click();
   }
   
   const handleImageSubmit = async(e) =>{
        e.preventDefault();
        const userId = localStorage.getItem('userId');       
        console.log(inputRef.current.files[0],"files");

        const formData = new FormData();
        formData.append("profileImage",inputRef.current.files[0])
        try{
            const response = await userAxiosInstance.put("/editprofile/" + userId,formData,{
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            if(response.data){
                console.log(response.data, "Profile image updated successfully");  
            }
        }catch(error){
            console.error("Error uploading profile image:", error);
        }
   }
   useEffect(()=>{
        fetchUserData();
   },[])
   const isEditProfilePage = location.pathname === '/editprofile';

   return (
        <div className='sidebar-container'>
            <div className='profile-img-container'>
                    <img src={selectedImage ? selectedImage: ProfileImg}  alt='Profile Image' width="100" height="100" />
                        <input 
                            type='file' 
                            name="profileImage"
                            accept='image/*'
                            onChange={handleImageChange}
                            ref={inputRef}
                        />
                    {imageChange?(
                        <button className='image-save-button' onClick={handleImageSubmit}>Save Image</button>
                    ):(
                        isEditProfilePage && <MdCreate onClick={handleImageClick}/>
                    )}
            </div>
            <div className='menu'>
                <div className='menu-item'>
                    <NavLink to="/home" 
                        className={({isActive})=>isActive?'active-link':'page-link'}
                        >Home</NavLink>
                </div>
                <div className='menu-item'>
                    <NavLink to="/editprofile" 
                        className={({isActive})=>isActive?'active-link':'page-link'}
                        >My Profile</NavLink>
                </div>
                <div className='menu-item'>
                    <NavLink to="/order" 
                        className={({isActive})=>isActive ||location.pathname === '/makepayment'?'active-link':'page-link'}
                        >Place NewOrder</NavLink>
                </div>
                <div className='menu-item'>
                    <NavLink to="/myorder" 
                        className={({isActive})=>isActive?'active-link':'page-link'}
                        > My Orders</NavLink>
                </div>
                <div className='menu-item'>
                    <NavLink to="/login" 
                        className={({isActive})=>isActive?'active-link':'page-link'}
                        onClick={handleLogout}
                        > Logout</NavLink>
                    </div>
            </div>
        </div>
   )
}
export default Sidebar