const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const itemSchema =new Schema({
    clothType:{
        type:String,
        required:true,
        enum:['pants','shirt','tshirt','suit','jacket','bathtowel','bedsheet']
    },
    quantity:{
        type:Number,
        required:true,
        min:1,
    }, 
    washType:{
        type:String,
        required:true,
        enum:['drywash','normalwash']
    },
    subtotal:{
        type:Number,
        required:true,
        min:0
    },
});

const orderSchema = new Schema({
    userId:{type:String,required:true},
    items:[itemSchema],
    totalAmount:{type:Number,required:true,min:0},
    orderDate:{type:Date,default: Date.now},
    deliveryDate:{type:Date,default:Date.now},
    trackingId:{type:String,unique: true},
    status:{
        type:String,
        enum:['Pending','Confirmed', 'In Service', 'Ready', 'Delivered','Cancelled'],
        default: 'Pending'
    },
    createdAt:{type:Date,default: Date.now},
    updatedAt:{type:Date,default: Date.now},
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Success', 'Error'],
        default: 'Pending'
    },
    modeofPayment:{
        type: String,
        enum: ['GPay', 'Cash on Delivery', 'Card'], 
    }
})
module.exports=mongoose.model("Order",orderSchema)