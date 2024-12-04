import React, { useState } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import './Order.css'
import { MdAdd } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { orderAxiosInstance } from '../../utils/axiosinstance';
const Order = () => {
    const [rows, setRows] = useState([{
      clothType:'',
      quantity:'1',
      washType:'normalwash',
      subtotal:'00.00'
    }]);
    const [selectedRow,setSelectedRow] = useState(0);
    const navigate = useNavigate();
    const clothPrices = {
      pants: 60,
      shirt: 50,
      tshirt:30,
      suit:90,
      jacket: 80,
      bathtowel: 10,
      bedsheet: 70
    };
    const washTypeMultiplier = {
      'normalwash': 1, 
      'drywash': 1.5
    };
    const calculateSubtotal=(row)=>{
      const clothPrice = clothPrices[row.clothType];
      const multiplier = washTypeMultiplier[row.washType];
      const quantity = parseInt(row.quantity);
      return clothPrice * multiplier * quantity;
    }
    const calculateGrandTotal = () =>{
        let total=0;
        for(let i=0;i<rows.length;i++){
           total=total+parseFloat(rows[i].subtotal)
        }
        return total.toFixed(2);
    }
    const handleChange = (index,field,value)=>{
          const updatedRows=rows.map((row,i)=>
              i===index?{...row,[field]:value,subtotal:calculateSubtotal({...row,[field]:value})}:row);
          setRows(updatedRows);
    };
    const handleAddRow = (index) => {
      setRows([...rows, { clothType: '', quantity: '1', washType: 'normalwash', subtotal: '00.00' }]);
      setSelectedRow(index+1);
    };
    
    const handlePlaceOrder = async() =>{
      const grandTotal = calculateGrandTotal();
      if (parseFloat(grandTotal) > 0){
        console.log("Proceed to Checkout with GrandTotal");
      try{
        const response= await orderAxiosInstance.post("/neworder",{
           items:rows,
           totalAmount:grandTotal,
        })
        if(response){
         alert("Order Saved Successfully");
         console.log(response.data,"orderid");
         navigate(`/makepayment/${response.data.orderId}`, { state: { grandTotal } })
        }
        }catch(error){
              console.log(error,"Order not saved");
        }
      }else {
        alert("Cannot place order with total amount 0.");
    }};

  return (
    <div className='container'>
    <Sidebar/>
    <div className='right-container'>
        <table className='order-table'>
            <thead>
                <tr>
                    <th>Type of Cloth</th>
                    <th>Quantity</th>
                    <th>Wash Type</th>
                    <th>Subtotal</th>
                </tr>
            </thead>
            <tbody>
                {rows.map((row,index)=>(
                      <tr key={index} className="table-row">
                          <td className="table-cell">
                            <select value={row.clothType} onChange={(e)=>handleChange(index,'clothType',e.target.value)}>
                                <option value="">Select Type</option>
                                <option value="pants">Pants</option>
                                <option value="shirt">Shirt</option>
                                <option value="tshirt">T-shirt</option>
                                <option value="suit">Suit</option>
                                <option value="jacket">Jacket</option>
                                <option value="bathtowel">Bath-Towel</option>
                                <option value="bedsheet">Bed Sheet</option>
                            </select>
                          </td>
                          <td className="table-cell">
                            <select value={row.quantity} onChange={(e)=>handleChange(index,'quantity',e.target.value)}>
                                <option value="">Select Quantity</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>
                          </td>
                          <td className="table-cell">
                            <select value={row.washType} onChange={(e)=>handleChange(index,'washType',e.target.value)}>
                                <option value="">Select Wash Type</option>
                                <option value="normalwash">Wet Wash</option>
                                <option value="drywash">Dry Wash</option>
                            </select>
                          </td>
                          <td className="table-cell">{row.subtotal}</td>
                          {selectedRow === index && (
                            <td className='button-cell'>
                                <button className='add-button'  onClick={()=>handleAddRow(index)}><MdAdd/></button>
                            </td>                          
                          )}
                      </tr>
                ))}
                <tr className="grand-total-row">
                      <td colSpan="3" className="grand-total-label">Grand Total</td>
                      <td className="grand-total-value">{calculateGrandTotal()}</td>
                </tr>
            </tbody>
        </table>
        <div className='buttons'>
            <button className="save-button" onClick={handlePlaceOrder}>Place Order</button>
        </div>
    </div>         
    </div>
  )
}

export default Order;