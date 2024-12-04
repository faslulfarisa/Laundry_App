import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import './TrackOrder.css'
import { orderAxiosInstance } from '../../utils/axiosinstance';
import { useParams } from 'react-router-dom';
// import { IoWashingMachine } from 'react-icons/fa'; 
import { MdLocalLaundryService } from 'react-icons/md'; 

const TrackOrder = () => {
    const {trackingId} = useParams();
    console.log(trackingId,"trackingid");
    const [orderDetails,setOrderDetails]=useState(null);    

    // API for FetchOrders
    const fetchMyOrders = async() =>{        
        try{
            const response = await orderAxiosInstance.get(`/get-order/${trackingId}`)
            console.log(response.data, "API Response");
            if(response.data && response.data.order){
                setOrderDetails(response.data.order)
                console.log(response,"response")
            }
        }catch(error){
            console.log("Error fetching order details:",error);
        }
    }
    useEffect(()=>{
        fetchMyOrders();
    },[trackingId]);
    
    // Define steps with icons and labels
    const Steps = {
        'pending':{ icon: '🧺', label: 'Pending' },
        'pickup':{ icon: '📦', label: 'Pickup' },
        'inservice':{ icon: <MdLocalLaundryService/>, label: 'In Service' },
        'ready':{ icon: '✅', label: 'Ready' },
        'delivered':{ icon: '🚚', label: 'Delivered' },
        // 'cancelled':{ icon: '❌', label: 'Cancelled' },
    }    

    // List of statuses in order of progression
    const  statusOrder = ['pending','pickup', 'inservice', 'ready','delivered','cancelled'];

    // Function to render steps up to the current status
    const renderStatusSteps = (currentStatus) =>{
        console.log(currentStatus,"status");
        const currentStatusIndex = statusOrder.indexOf(currentStatus)
        console.log(currentStatusIndex,"index");
        if(currentStatusIndex === -1){
            return <p>Status not found</p>;
        }
        return statusOrder.slice(0,currentStatusIndex+1).map((status)=>(
            <div key={status} className='step'>
                <div className='step-icon'>{Steps[status].icon}</div>
                <div className='step-label'>{Steps[status].label}</div>
            </div>
        ))  
    }
    console.log(orderDetails,"order-details");
    
    const calculateDeliveryDate = (orderDate) =>{
        if (!orderDate) return null;
        console.log(orderDate,"orderdate");
        const date = new Date(orderDate)
        date.setDate(date.getDate()+5)
        return date.toLocaleDateString();
    }
    return (
        <div className='container'>
        <Sidebar/>
        <div className='right-container'>
            {orderDetails?(
                <>
                    <h5>Tracking ID:{trackingId}</h5>
                    <div className='steps-container '>
                        {renderStatusSteps(orderDetails.status)}
                    </div>
                    {orderDetails.status!== "delivered" && (
                        <p className='estimated-delivery'>Estimated Time of Delivery:{calculateDeliveryDate(orderDetails.orderDate)||'N/A'}</p>
                    )}
                </>     
            ):(
                <p>Loading order details...</p>
            )}
            
        </div>
    </div>
    )
}

export default TrackOrder