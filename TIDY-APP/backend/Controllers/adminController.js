// model access
const Admin = require("../models/admin")
const Order = require("../models/order");
// token
const jwt =require("jsonwebtoken")

const bcrypt = require('bcrypt'); 

// SignUp
const registerAdmin = async(req,res) => {
    const{name,email,password}=req.body;
     // Check if all fields are present
     if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required.',
        });
    }
    try{
        const existingAdmin = await Admin.findOne({email});
        if(existingAdmin){
            return res.status(400).json({
                success:false,
                message: 'Admin already exists' 
            });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = new Admin({
            name,
            email,
            password:hashedPassword
        });
        await admin.save();
        return res.status(201).json({
            success: true, 
            message: 'Admin registered successfully!'
        })
    }catch(error){
        console.error('Error registering admin:', error);
        return res.status(500).json({
            success: false,
            message: 'Error registering admin.'
        });
    }
}

// Login
const loginAdmin = async(req,res) =>{
    const{email,password}=req.body;
    // Check if all fields are present
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email and password are required.',
        });
    }
    try{
        const existingAdmin = await Admin.findOne({email});
        if(!existingAdmin){
            return res.status(400).json({
                success:false,
                message: 'Invalid email or password.' 
            });
        }
        // Hash the password
        const isMatch = await bcrypt.compare(password,existingAdmin.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.'
            });
        }
        // Generate JWT with admin role
        const payload={
        id:existingAdmin._id,
        email:existingAdmin.email,
        role:'admin'
        }
        
        const token = jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET,{ expiresIn: '1h' });
        return res.status(201).json({
            success: true, 
            message: 'Login successful!',
            token
        })
        }catch(error){
        console.error('Error logging in admin:', error);
        return res.status(500).json({
            success: false,
            message: 'Error logging in admin.'
        });
}}

// get admin details
const getAdminDetails = async(req,res) =>{
    const {id} =req.admin
    
    try{
        const admin = await Admin.findById(id);
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found',
            });
        }
        return res.json({
            success: true,
            admin,
            message: 'Admin Found'
        })
    }catch(error){
        console.error('Error fetching admin:', error);
        return res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
}

// edit admin details
const editAdminProfile = async(req,res) =>{
    const {name,email,mobileNumber,role,currentPassword,newPassword}=req.body;
    const {id} = req.admin;
    try{
        const admin = await Admin.findById(id);
        admin.name=name;
        admin.email=email;
        admin.mobileNumber=mobileNumber;
        admin.role=role
        // If both current and new passwords are provided, handle password update
        if (currentPassword && newPassword) {
            // Verify current password
            const isMatch = await bcrypt.compare(currentPassword,admin.password)
            if(!isMatch){
                return res.status(400).json({
                    error:true,
                    message:"Current password is incorrect.",
                });
            }
            // Hash the new password and update it
            const hashedPassword = await bcrypt.hash(newPassword,10);
            admin.password = hashedPassword;
        }
        await admin.save();
        return res.status(200).json({
            error: false,
            message: "Profile updated successfully",
            data: {
                name: admin.name,
                email: admin.email,
                mobileNumber: admin.mobileNumber,
                role:admin.role,
            },
        })
    }catch(error){
        console.log(error,"error");  
        return res.status(500).json({
            error:true,
            message:"An error occurred while updating the profile"
        }) 
    }
}

// fetch all orders
const getAllOrders = async(req,res)=>{
    try{
        const orders = await Order.find();
        return res.status(200).json({
            success:true,
            orders,
        });
    }catch(error){
        console.error('Error fetching orders:', error);   
        return res.status(500).json({
            success:false,
            message:'Error fetching orders',
        });
    }
};

const updateOrderStatus = async(req,res)=>{
    const { orderId, status } = req.body;
    if (!orderId || !status) {
        return res.status(400).json({
            success: false,
            message: 'Order ID and status are required.'
        });
    }
    try{
        const updatedStatus = await Order.findByIdAndUpdate(
            orderId,
            {status:status},
            { new: true }
        );// Check if the order was found and updated
        if (!updatedStatus) {
            return res.status(404).json({
                success: false,
                message: 'Order not found.'
            });
        }
        return res.status(200).json({
            success:true,
            message: 'Order status updated successfully!',
            order: updatedStatus
        })
    }catch(error){
        console.error('Error updating order status:', error);
        return res.status(500).json({
            success: false,
            message: 'Error updating order status.'
        });
    }
}

module.exports = {
    registerAdmin,
    loginAdmin,
    getAdminDetails,
    editAdminProfile,
    getAllOrders,
    updateOrderStatus
}