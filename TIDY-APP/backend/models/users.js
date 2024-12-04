const  mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema =  new Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    mobileNumber:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    address:{type:String},
    zipCode:{type:String},
    profileImage:{type: String},
    createdOn: { type: Date, default: Date.now },
    });

module.exports = mongoose.model("User",userSchema)