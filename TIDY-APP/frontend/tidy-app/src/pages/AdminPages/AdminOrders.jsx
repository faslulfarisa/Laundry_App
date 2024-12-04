import React, { useEffect, useState } from 'react'
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar'
import EmptyCard from '../../components/EmptyCard/EmptyCard';
import { adminAxiosInstance} from '../../utils/axiosinstance';
import { NavLink } from 'react-router-dom';


const AdminOrders = () => {
  const [orders,setOrders]=useState([]);
  // API TO Fetch all users orders
  const fetchAllOrders = async() =>{
     try{
        const response = await adminAxiosInstance.get('/get-all-orders')
        if(response.data.orders){
            setOrders(response.data.orders)
        }
     }catch(error){
        console.log(error,"error");
     }
  }

  useEffect(()=>{
      fetchAllOrders();
  },[])

  const handleChange = async(currentOrderId,newStatus) =>{
        try{
            setOrders(prevOrders =>{
              // console.log(prevOrders,"prevorders");
              const updatedOrders= prevOrders.map(order=>
                  order._id === currentOrderId?{
                      ...order,
                      status:newStatus
                  }:order
              );
              // console.log(updatedOrders, "updatedOrders");
              return updatedOrders;
            });
            const response = await adminAxiosInstance.put("/update-order-status",{
              orderId:currentOrderId,
              status:newStatus
            })

        }catch(error){
          console.error("Error updating order status:", error);

        }
    
  };


  return (
    <div className='container'>
        <AdminSidebar/>
        <div className='right-container'>
            {orders.length>0?(
                <table className='myorder-table'>
                  <thead>
                       <tr>
                           <th>0rder ID</th>
                           <th>Order Date</th>
                           <th>Total Amount</th>
                           <th>Order Status</th>
                       </tr>
                  </thead>
                  <tbody>
                      {orders.map((order,index)=>{
                          // console.log(order,"ordersmapping");
                          return(                        
                            <tr key={index}>
                                <td className="table-cell">{order._id}</td>
                                <td className="table-cell">
                                      {new Date(order.orderDate).toLocaleDateString()}
                                  </td>
                                <td className="table-cell">{order.totalAmount}</td>
                                <td className="table-cell">
                                  <select value={order.status} onChange={(e)=>handleChange(order._id,e.target.value)}>
                                      <option value="pending">Pending</option>
                                      <option value="pickup">Pickup</option>
                                      <option value="inservice">Inservice</option>
                                      <option value="ready">Ready</option>
                                      <option value="delivered">Delivered</option>
                                  </select>
                                </td>
                            </tr>
                        )
                      }
                      )}
                  </tbody>
                </table>
            ):(
              <EmptyCard
                  message={`No orders available at the moment.`}
                />
            )}
        </div>
    </div>
  )
}

export default AdminOrders