import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import './MyOrder.css'
import EmptyCard from '../../components/EmptyCard/EmptyCard';
import { NavLink } from 'react-router-dom';
import { orderAxiosInstance } from '../../utils/axiosinstance';

const MyOrder = () => {
  const [myOrders,setMyOrders]=useState([]);

  // API for FetchOrders
  const fetchMyOrders = async() =>{
        try{
            const response = await orderAxiosInstance.get('/get-all-orders')
            if(response.data && response.data.orders){
                setMyOrders(response.data.orders)
                console.log(response,"response")
            }
        }catch(error){
            console.log(error,"error");
        }
  }
  useEffect(()=>{
    fetchMyOrders();
  },[])

  const sortedOrders = [...myOrders].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

  return (
    <div className='container'>
        <Sidebar/>
        <div className='right-container'>
            {sortedOrders.length>0?(
                <table className='myorder-table'>
                  <thead>
                       <tr>
                           <th>0rder ID</th>
                           <th>Order Date</th>
                           <th>Order Total</th>
                           <th>Track Order</th>
                       </tr>
                  </thead>
                  <tbody>
                      {sortedOrders.map((order,index)=>(
                          <tr key={index}>
                              <td className="table-cell">{order._id}</td>
                              <td className="table-cell">
                                    {new Date(order.orderDate).toLocaleDateString()}
                                </td>
                              <td className="table-cell">{order.totalAmount}</td>
                              <td className="table-cell">
                                  <NavLink to={`/trackorder/${order.trackingId}`}>{order.trackingId}</NavLink>
                              </td>
                          </tr>
                      )
                      )}
                  </tbody>
                </table>
            ):(
              <EmptyCard
                  message={`HURRY UP!!! Make Your First Order`}
                  />
            )}
        </div>
    </div>
  )
}

export default MyOrder