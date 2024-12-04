// model access
const Order = require("../models/order");
const braintree = require("braintree");
const response = require("express");

// payment gateway
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_Merchant_ID,
    publicKey: process.env.BRAINTREE_Public_Key,
    privateKey: process.env.BRAINTREE_Private_Key,
    http: {
        timeout: 120000 // Set the timeout to 120 seconds
    }
});

// create new Order
const createOrder = async(req,res)=>{
    try{
        const{items,totalAmount}=req.body;
        const userId=req.user.id;
        if(!userId){
            return res.status(400).json({
                error:true,
                message:"User ID is missing"
            });
        }
        // Validate required fields
        if(!items){
            return res.status(422).json({
                error:true,
                message:"All fields are required"
            })
        }
        const order= new Order({
            items,
            totalAmount,
            userId
        })
        
        await order.save();
        console.log(order,"order");

        // Generate the trackingId 
        const trackingId=`TR-${order._id}`;       
        // Update the order with the trackingId
        order.trackingId = trackingId;
        const updatedOrder = await order.save();   
        console.log(updatedOrder._id,"orderid");
     
        return res.status(201).json({
            error:false,
            orderId:updatedOrder._id,
            message:"Order Created Successfully"
        })
        
    }catch(error){
        console.log("Error creating order:",error);
        res.status(500).json({
            error:true,
            message:'Server Error'
        })
    }   
}

const getAllOrders = async(req,res)=>{
    const {id}=req.user;
    try{
        const orders = await Order.find({userId:id})
        return res.json({
            error:false,
            orders,
            message:"All Orders retrived successfully"
        })
    }catch(error){
        console.log(error,"error-fetch orders");
    }
}

const getOrderByTrackingId = async(req,res)=>{
    console.log(req.params,"params")
    const {trackingId} = req.params;
    try{
        const order = await Order.findOne({trackingId});
        return res.json({
            error:false,
            order,
            message:"Order retrived successfully"
        });
    }catch(error){
        console.log(error,"fetch error - order by trackingId");
        return res.status(500).json({
            error:true,
            message:"Error Fetching Order"
        })
    }
}

// payment gateway api

const  braintreeTokenController = async(req,res)=>{
    try{
        // Generate a client token
        console.log('Request Headers:', req.headers.authorization);
        console.log("Generating Braintree token...");
        gateway.clientToken.generate({},(err,response)=>{
            if(err){
                console.error('Error generating Braintree token:', err);
                return res.status(500).send({
                    message: 'Failed to generate Braintree token',
                    error: err,
                });
            }
            if(response){
                // Send the generated token to the frontend
                console.log(response,"response--token");
                res.send({
                    token: response.clientToken,
                });
            }else {
                console.error('Invalid response received:', response);
                return res.status(500).send({
                    message: 'Invalid response received from Braintree',
                    error: response,
                });
            }
        });
    }catch(error){
        console.error('Error generating Braintree token:', error);
        res.status(500).send({
            message: 'Server error',
            error,
        });  
    }
}

// const retryTokenGeneration = (attempts = 3, delay = 2000) => {
//     return new Promise((resolve, reject) => {
//         gateway.clientToken.generate({}, (err, response) => {
//             if (err) {
//                 if (attempts > 0) {
//                     console.log(`Retrying... (${attempts} attempts left)`);
//                     return setTimeout(() => resolve(retryTokenGeneration(attempts - 1)), delay);
//                 }
//                 reject(err);
//             } else {
//                 resolve(response);
//             }
//         });
//     });
// };

// const braintreeTokenController = async (req, res) => {
//     try {
//         const response = await retryTokenGeneration();
//         res.send({
//             token: response.clientToken,
//         });
//     } catch (error) {
//         console.error('Error generating Braintree token:', error);
//         res.status(500).send({
//             message: 'Failed to generate Braintree token',
//             error: error,
//         });
//     }
// };

const  braintreePaymentController = async(req,res)=>{
    try {
        const { paymentMethodNonce, amount,orderId} = req.body; // Get nonce and amount from client
        console.log("Received paymentMethodNonce:", paymentMethodNonce);
        console.log("Received amount:", amount);
        console.log(req.body,"body")
        if (!paymentMethodNonce || !amount || !orderId) {
            return res.status(400).json({ success: false, error: 'Missing required fields.' });
        }
        // Check if order exists before transaction
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found.' });
        }

        // Make transaction with Braintree
        const result = await gateway.transaction.sale({
            amount: amount,
            paymentMethodNonce: paymentMethodNonce,
            options: {
                submitForSettlement: true, // Automatically submit for settlement
            },
            orderId: orderId 
        });
        console.log('Order ID:', orderId);
        console.log('Braintree Transaction Result:', result);

        if (result.success) {
            // Extracting the mode of payment
            const modeofPayment=result.transaction.paymentInstrumentType;
          
            await Order.findByIdAndUpdate(orderId, {
                paymentStatus: 'Success',
                modeofPayment: modeofPayment
            });
               
            res.status(200).json({ 
                success: true, 
                transaction: {
                    ...result.transaction ,
                    modeofPayment:modeofPayment,
                }
            });
        }else{
            console.log("Braintree transaction result:", result);
            await Order.findByIdAndUpdate(orderId, {
                paymentStatus: 'Error',
            });
            res.status(500).json({ success: false, error: result.message });
        }
    } catch (error) {
        console.error("Error during payment processing:", error);
        res.status(500).json({ success: false, error: 'An error occurred during the transaction.' });
    }
}

module.exports = {
    createOrder,
    getAllOrders,
    getOrderByTrackingId,
    braintreeTokenController,
    braintreePaymentController,
}