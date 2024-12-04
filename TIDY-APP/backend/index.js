const express=require('express')
const app = express();

const cors = require("cors");
// env
require('dotenv').config();
// mongodb connection
const config = require("./config.json");
const mongoose = require("mongoose");
mongoose.connect(config.connectionString)
        .then(()=>console.log("connected"))
        .catch((err)=>console.log("Mongo DB connection error:",err));

// import router
const userRoutes=require("./routes/userRoutes");
const orderRoutes=require("./routes/orderRoutes");
const adminRoutes=require("./routes/adminRoutes");
// Configure CORS middleware to allow all origins
app.use(
        cors({
                origin: 'http://localhost:5173' 
        })
);
// inbuild middleware
app.use(express.json())
// Serve uploaded files
app.use('/uploads', express.static('uploads'));
// Middlewares for routes;
app.use("/app",userRoutes);
app.use("/orders",orderRoutes);                       
app.use("/admin",adminRoutes);
// port
app.listen(3000);
