// model access
const User = require("../models/users")
// token
const jwt =require("jsonwebtoken")

const twilio =require("twilio")


// create Account
const createAccount = async(req,res)=>{
    const{name,email,mobileNumber,password}=req.body;
    if(!name){
        return res.status(400).json({
            error:true,
            message:"Name is required"
        })
    }
    if(!email){
        return res.status(400).json({
            error:true,
            message:"Email is required"
        })
    }
    if(!mobileNumber){
        return res.status(400).json({
            error:true,
            message:"MobileNumber is required"
        })
    }
    if(!password){
        return res.status(400).json({
            error:true,
            message:"Password is required"
        })
    }
    const existingUser = await User.findOne({
        $or:[
            {email:email},
            {mobileNumber:mobileNumber}
        ]
    });
    if(existingUser){
        return res.status(409).json({
            error:true,
            message:"User already exist"
        });

    }
    const user =new User({
        name,
        email,
        mobileNumber,
        password
    });
    await user.save(); 
    
    const accesstoken = jwt.sign({ id: user._id.toString() },process.env.ACCESS_TOKEN_SECRET, {expiresIn: "36000m"});
    return res.status(201).json({
        error:false,
        user: {
            id: user._id.toString(), // Use id here for MongoDB-generated _id
            name: user.name,
            email: user.email,
            mobileNumber: user.mobileNumber
        },
        accesstoken,
        message:"Registration Successfull"
    });
}
// Login
const createLogin = async(req,res)=>{
    const{mobileNumber,password}=req.body;
    if(!mobileNumber){
        return res.status(400).json({
            error:true,
            message:"MobileNumber is required"
        })
    }
    if(!password){
        return res.status(400).json({
            error:true,
            message:"Password is required"
        })
    }
    // Check if the user already exists
    const existingUser = await User.findOne({mobileNumber})
    if(!existingUser){
        return res.status(400).json({
            message:"User not found"
        })
    }
    // verify
    if(existingUser.mobileNumber==mobileNumber && existingUser.password==password){
        // Generate JWT token
        const payload={
            id:existingUser._id.toString(),
            mobileNumber:existingUser.mobileNumber
        }
        const accesstoken=jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'2h'})
        return res.status(200).json({
            error:false,
            payload,
            accesstoken,
            message:"Login Successfull"
        });
    }else{
        return res.status(500).json({
            error:true,
            message:'Invalid Credentials'
        })
    }
}

const forgetPassword = async(req,res)=>{
    const {mobileNumber}=req.body;
    if(!mobileNumber){
        return res.status(400).json({
            error:true,
            msg:"Mobile Number is required",
        })
    }
    const user =await User.findOne({mobileNumber:mobileNumber});
    if(!user){
        return res.status(404).json({
            error:true,
            msg:"Mobile number not found"
        })
    }
    return res.status(200).json({
        success: true,
        msg: "Mobile number exists, proceed with OTP generation",
    });

}
const resetPassword=async(req,res)=>{
    console.log(req.body,"body");
    try{
        const { mobileNumber, newPassword} = req.body;
        const user = await User.findOne({mobileNumber:mobileNumber});
        if(!user){
            return res.status(404).json({
                error:true,
                msg:"User not Found"
            })
        }
        console.log(user,"user");
        
        user.password=newPassword,
        await user.save();
        return res.status(200).json({
            success:true,
            msg:"Updated successfully"
        })
    }catch(error){
        console.error('Error resetting password:', error);
        return res.status(500).json({
            success:false,
            msg: "Internal server error",
          });
    }
}
  
// Create new user
const createUser = async(req,res)=>{
    const {name,email,mobileNumber,address,zipCode}=req.body;
    const profileImage=req.file.path;
    console.log(req.user,"User from registration");
    console.log(req.file, "Uploaded file");
    console.log(req.body, "Body data");  

    const {id:userId}=req.user;
    if(!name || !email || !mobileNumber ||!address ||!zipCode){
        return res.status(400).json({
            error:true,
            message:"All Fields are required"
        });
    }
    if(!userId){
        return res.status(400).json({
            error:true,
            message:"User ID is missing"
        })
    }
    try{
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                error: true,
                message: "User not found"
            });
        }
        // Check if email or mobileNumber already exists for another user
        const emailExists =await User.findOne({email:email,_id:{$ne:userId}});
        const mobileExists=await User.findOne({mobileNumber:mobileNumber,_id:{$ne:userId}})
        if(emailExists){
            return res.status(400).json({
                error:true,
                message:"Email already in use"
            });
        }
        if(mobileExists){
            return res.status(400).json({
                error:true,
                message:"mobileNumber already in use"
            });
        }
        // Update user's profile details
        user.name=name;
        user.email=email;
        user.mobileNumber=mobileNumber;
        user.address=address;
        user.zipCode=zipCode;
        user.profileImage = profileImage; // Store the path in the database
        
        await user.save();
        const userResponse = {
            id: user._id.toString(),  // convert _id to id
            name: user.name,
            email: user.email,
            mobileNumber: user.mobileNumber,
            address: user.address,
            zipCode: user.zipCode,
            profileImage: user.profileImage,
        };
        return res.status(200).json({
                error:false,
                user:userResponse,
                message:"User profile created successfully" 
        })
    }catch(error){
        console.error("Error creating user:", error);
        res.status(500).json({
            error:true,
            message:'Server error'
        })
    }
}
// Get User
const getUser = async(req,res)=>{
    const {id}=req.user;    
    const isUser = await User.findOne({_id:id})
    if(!isUser){
        return res.status(401).send("User Not Found")}

    return res.json({
        user: {
            id: isUser._id.toString(),  // Convert ObjectId to string for id
            name: isUser.name,
            email: isUser.email,
            mobileNumber: isUser.mobileNumber,
            address: isUser.address,
            zipCode: isUser.zipCode,
            profileImage: isUser.profileImage
            ? `http://localhost:3000/${isUser.profileImage.replace(/\\/g, "/")}`
            : "http://localhost:3000/default-profile.png",

        },

        message:"User Found"
    })
    
}
// Edit User
const editUserProfile = async(req,res)=>{
    const {id}=req.params;
    const {name,email,mobileNumber,address,zipCode,currentPassword,newPassword}=req.body;
    console.log(id,"userid");
    
    console.log(req.file, "Uploaded file-edit1");
    console.log(req.body, "Body data-edit");      
    try{
        const user = await User.findById(id);
        if(!user){
            res.status(404).json({
                error:true,
                message:"User not Found"
            })
        }

        
        // Check if email or mobileNumber already exists for another user
        const emailExists = await User.findOne({email,_id:{$ne:id}});
        const mobileNumberExists = await User.findOne({mobileNumber,_id:{$ne:id}});
        if(emailExists){
            res.status(400).json({
                error:true,
                message:"Email already in use"
            })
        }
        if(mobileNumberExists){
            res.status(400).json({
                error:true,
                message:"mobileNumber already in use"
            })
        }
        // If current password is provided, check if it matches the stored password
        console.log("Reached the profile update section");

        if(currentPassword && newPassword){
      
            if (currentPassword !== user.password) {
                return res.status(400).json({
                    error:true,
                    message:"Current password is incorrect."
                })
            }
            user.password = newPassword;
        }
        // Update user's profile details
        user.name=name||user.name;
        user.email=email||user.email;
        user.mobileNumber=mobileNumber||user.mobileNumber;
        user.address=address||user.address;
        user.zipCode=zipCode||user.zipCode;
        console.log(req.file, "Uploaded file-edit2");
        if (req.file) {
            const profileImagePath = `/uploads/${req.file.filename}`; 
            user.profileImage = profileImagePath;  
        }       
        await user.save();
        console.log(user,"user--edit");
        
        return res.status(200).json({
            error:false,
            message:"Profile updated Succesfully",
            user: {
                id: user._id.toString(),  // Ensure id is a string
                name: user.name,
                email: user.email,
                mobileNumber: user.mobileNumber,
                address: user.address,
                zipCode: user.zipCode,
                profileImage: user.profileImage,
            },
        });
    }catch(error){
        console.log("Error Updating user:",error);  
        return res.status(500).json({
            error:true,
            message:"An error occurred while updating the profile"
        })   
    }
}

module.exports = {
    createAccount,
    createLogin,
    forgetPassword,
    resetPassword,
    getUser,
    createUser,
    editUserProfile,
}