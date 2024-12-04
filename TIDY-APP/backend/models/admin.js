const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    mobileNumber: {type:String},
    role:{type:String},
    password:{type:String,required:true},
    createdOn: { type: Date, default: Date.now },
    });
module.exports = mongoose.model("Admin",adminSchema)
