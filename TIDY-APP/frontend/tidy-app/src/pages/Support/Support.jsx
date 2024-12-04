import React from 'react'
import MachineImg from '../../assets/images/washingmachine.png'
import './Support.css'
import { useNavigate } from 'react-router-dom'

const Support = () => {
    const navigate=useNavigate();
    const goToHome  = ()=>{
        navigate("/home")
    }
    return (
        <div className='container'>
        <div className='left-container'>
            <img src={MachineImg} alt='Washing Machine' width="100" height="100"/>   
            <h4>We Makes Everything Clean</h4>
        </div>
        <div className='right-container'>
            <div className='logout-button'>
                <button onClick={goToHome} >Go To Home</button>
            </div>
            <div className='contact-info'>
                <h3>Contact Support</h3>
                    <p>Phone Number: +1 234 567 890</p>
                    <p>Email: support@example.com</p>
                    <p>WhatsApp No: +1 987 654 3210</p>
                    <p>Office Address: 123 Clean St, Laundry City, LA 90210</p> 
                    <h4>Operating Hours</h4>
                        <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                        <p>Saturday: 10:00 AM - 4:00 PM</p>
                        <p>Sunday: Closed</p>
                    <h4>Emergency Contact</h4>
                    <p>If you have an urgent issue, please call: +1 800 123 4567</p>
            </div>
        </div>
    </div>
    )
}

export default Support