import React, { useEffect, useState } from 'react'
import './Home.css'
import { NavLink, useNavigate } from 'react-router-dom'
import MachineImg from '../../assets/images/washingmachine.png'
import ProfileInfo from '../../components/Cards/ProfileInfo'
import { FaUserCircle,FaShoppingCart, FaListAlt, FaCommentDots } from 'react-icons/fa';
import {userAxiosInstance} from '../../utils/axiosinstance'


const Home = () => {
  const [name,setName]=useState(null);
  const navigate=useNavigate();

  //  API for GetUserName
  const getUser = async()=>{
    try{
        const response = await userAxiosInstance.get("/get-user");        
        if(response.data && response.data.user){
            setName(response.data.user.name)
        }
    }
    catch(error){
        if(error.response && error.response.status === 401){
            localStorage.clear();
            navigate("/login");
        }else {
            console.error("Error response:", error.response.data);
        }
    }       
  };
  const handleLogout = ()=>{
    localStorage.clear();
    navigate("/login")
  }
  useEffect(()=>{
    getUser();
  },[]);
  
  return (
    <div className='container'>
        <div className='left-container'>
            <img src={MachineImg} alt='Washing Machine' width="100" height="100"/>   
            <h4>We Makes Everything Clean</h4>
        </div>
        <div className='right-container'>
            <div className='logout-button'>
                <button onClick={handleLogout} >Logout</button>
            </div>
            <ProfileInfo name={name}/>
            <div className='home-container'>
                <div className='top-section'>
                    <div className='profile-section'>
                        <FaUserCircle  className="icon-padding"/>
                        <NavLink to="/editprofile" className="section-link">My Profile</NavLink>
                    </div>
                    <div className='create-order-section'>
                        <FaShoppingCart  className="icon-padding"/>
                        <NavLink to="/order" className="section-link">Create Order</NavLink>
                    </div>
                </div>
                <div className='bottom-section'>
                    <div className='my-orders-section'>
                        <FaListAlt  className="icon-padding"/>
                        <NavLink to="/myorder" className="section-link">My Orders</NavLink>
                    </div>
                    <div className='support-section'>
                        <FaCommentDots className="icon-padding"/>
                        <NavLink to="/support" className="section-link">Support</NavLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Home