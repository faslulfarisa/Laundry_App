import React, { useEffect, useState } from 'react'
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar'
import { adminAxiosInstance } from '../../utils/axiosinstance';

const AdminPayments = () => {
  const [orders,setOrders]=useState([]);
  console.log(orders,"orders");
  const fetchAllOrders = async() =>{
    try{
        const response = await adminAxiosInstance.get('/get-all-orders')
        if(response.data.orders){
          console.log(response.data.orders);  
          setOrders(response.data.orders)
        }
    }catch(error){
        console.log(error,"error");  
    }
  }
  useEffect(()=>{
    fetchAllOrders()
  },[])
  return (
    <div className='container'>
        <AdminSidebar/>
        <div className='right-container'>
                <table className='myorder-table'>
                  <thead>
                       <tr>
                           <th>0rder ID</th>
                           <th>Order Total</th>
                           <th>Mode of Payment</th>
                           <th>Payment Status</th>
                       </tr>
                  </thead>
                  <tbody>
                      {orders.map((order,index)=>{
                          console.log(order,"ordersmapping");
                          return(                        
                            <tr key={index}>
                                <td className="table-cell">{order._id}</td>
                                <td className="table-cell">
                                      {order.totalAmount}                                 
                                </td>
                                <td className="table-cell">{order.modeofPayment}</td>
                                <td className="table-cell">
                                      {order.paymentStatus}
                                </td>
                            </tr>
                         )
                      }
                      )}
                  </tbody>
                </table>
           
        </div>
    </div>
  )
}

export default AdminPayments