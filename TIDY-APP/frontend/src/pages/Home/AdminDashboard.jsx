import React from 'react'
import MachineImg from '../../assets/images/washingmachine.png'
import { FaUserCircle,FaShoppingBag, FaMoneyCheckAlt, FaCog } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate=useNavigate();

    const handleLogout = ()=>{
        localStorage.clear();
        navigate("/admin/login")
    }
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
                <h2>ADMIN DASHBOARD</h2>
                <div className='home-container'>
                    <div className='top-section'>
                        <div className='profile-section'>
                            <FaUserCircle  className="icon-padding"/>
                            <NavLink to="/admin/profile" className="section-link">My Profile</NavLink>
                        </div>
                        <div className='create-order-section'>
                            <FaShoppingBag  className="icon-padding"/>
                            <NavLink to="/admin/orders" className="section-link">Orders</NavLink>
                        </div>
                    </div>
                    <div className='bottom-section'>
                        <div className='support-section'>
                            <FaMoneyCheckAlt className="icon-padding"/>
                            <NavLink to="/admin/payments" className="section-link">Payments</NavLink>
                        </div>
                        <div className='my-orders-section'>
                            <FaCog className='icon-padding'/>
                            <NavLink to="/admin/settings" className="section-link">Settings</NavLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )
}

export default AdminDashboard