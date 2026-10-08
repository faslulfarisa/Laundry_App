import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import './Payment.css'
import DropIn from "braintree-web-drop-in-react";
import { orderAxiosInstance } from '../../utils/axiosinstance';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const Payment = () => {
    const {orderId} = useParams();
    console.log(orderId,"orderId");

    const [clientToken,setClientToken] = useState("");
    const [loading, setLoading] = useState(false);
    const [instance,setInstance] = useState("");
    const navigate=useNavigate();

    const location = useLocation();
    const { grandTotal } = location.state || { grandTotal: 0 };
    // get payment gateway token
    const getToken = async ()=>{
        try{
            const {data}=await orderAxiosInstance.get("/braintree/token");
            console.log(data,"Fetched token data:")
            setClientToken(data?.token);
        }catch(error){
        if (error.response) {
            console.error("Error fetching Braintree token:", error.response.data);
        }
        }
    };
    useEffect(()=>{
        getToken();
    },[]);
    const handlePayment = async() =>{
        try{
            setLoading(true);
            const {nonce}=await instance.requestPaymentMethod();
            if (!grandTotal) {
                alert("Please provide a valid amount for the payment.");
                return;
            }
            const response=await orderAxiosInstance.post("/braintree/payment",{
                paymentMethodNonce:nonce, 
                amount:grandTotal,
                orderId: orderId,
            });
            if(response){
                console.log(response,"response");  
                alert("Payment processed successfully!");
                navigate('/myorder')
            }else{
                console.log(response,"response");  
                alert(`Transaction failed: ${response.error}`);
            }
        }catch(error){
            console.error("Error during payment processing:", error);
            alert("An error occurred while processing your payment. Please try again.");
        }finally {
            setLoading(false); 
        }
    }
   
    return (
        <div className='container'>
            <Sidebar/>
            <div className='right-container'>
                <div className='payment-section'>
                    <h2>Make Payment</h2>
                    {/* <div className='payment-option'>
                        <label>
                            <input type = 'radio'
                                value = 'UPI Payment'
                                checked = {selectedOption === 'UPI Payment'}
                                onChange={handleOptionChange} />
                            UPI Payment
                        </label>    
                    </div>
                    <div className='payment-option'>
                        <label>
                            <input type='radio'
                                value='Cash on Delivery' 
                                checked={selectedOption === 'Cash on Delivery'}
                                onChange={handleOptionChange}/>
                            Cash on Delivery
                        </label>
                    </div> */}
                    <div>
                        {clientToken?(
                            <>
                                <DropIn
                                    options={{
                                        authorization:clientToken,
                                        paypal:{
                                            flow:"vault",
                                        },
                                    }}
                                onInstance={(instance) => setInstance(instance)} // Store the drop-in instance
                            />
                            <button className='payment-button' onClick={handlePayment}>
                                {loading ? "Processing..." : "Make Payment"}
                            </button>
                            </>):(
                                <p>Loading payment options...</p>
                            )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Payment