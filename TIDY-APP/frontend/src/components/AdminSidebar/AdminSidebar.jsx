import React, { useState } from 'react'
import ProfileImg from '../../assets/images/profileimg.png'
import {MdCreate} from "react-icons/md"
import { NavLink} from 'react-router-dom'

const AdminSidebar = () => {
    const [selectedImage,setSelectedImage]=useState(ProfileImg);
    const handleImageChange = (event)=>{
        const file=event.target.files[0];
        if(file){
            setSelectedImage(URL.createObjectURL(file))
        }
    }
    const handleLogout = () =>{
        localStorage.removeItem('token')
    }
    return (
        <div className='sidebar-container'>
            <div className='profile-img-container'>
                    <img src={selectedImage?selectedImage:ProfileImg} alt='Profile Img' width="100" height="100"/>
                    <input type='file' onChange={handleImageChange} />
                    <MdCreate/>
            </div>
            <div className='menu'>
                <div className='menu-item'>
                    <NavLink to="/admin/dashboard" 
                        className={({isActive})=>isActive?'active-link':'page-link'}
                        >Home</NavLink>
                </div>
                <div className='menu-item'>
                    <NavLink to="/admin/profile" 
                        className={({isActive})=>isActive?'active-link':'page-link'}
                        >Admin Profile</NavLink>
                </div>
                <div className='menu-item'>
                    <NavLink to="/admin/orders" 
                        className={({isActive})=>isActive ||location.pathname === '/makepayment'?'active-link':'page-link'}
                        >Order Details</NavLink>
                </div>
                <div className='menu-item'>
                    <NavLink to="/admin/payments" 
                        className={({isActive})=>isActive?'active-link':'page-link'}
                        >Payments</NavLink>
                </div>
                <div className='menu-item'>
                    <NavLink to="/admin/login" 
                        className={({isActive})=>isActive?'active-link':'page-link'}
                        onClick={handleLogout}
                        > Logout</NavLink>
                    </div>
            </div>
        </div>
    )
}

export default AdminSidebar