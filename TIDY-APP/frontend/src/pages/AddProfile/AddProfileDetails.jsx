import React, { useRef, useState } from 'react'
import ProfileImg from '../../assets/images/profileimg.png'
import MachineImg from '../../assets/images/washingmachine.png'
import { useNavigate } from 'react-router-dom'
import { validateEmail, validateMobile, validateZipCode } from '../../utils/helper'
import {userAxiosInstance} from '../../utils/axiosinstance'
import  './AddProfileDetails.css'
import { FaCamera } from 'react-icons/fa6'

const AddProfileDetails = () => {
  const [image, setImage] = useState();
  const inputRef = useRef();
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [mobileNumber, setMobileNumber] = useState("")
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [error,setError]=useState(null);
  const navigate=useNavigate();
  
  const handleImageClick = () =>{
    inputRef.current.click();
  }
  const handleImageUpload = (event)=>{
    const file=event.target.files[0];
    if (file) {
        setImage(file); // Store the actual file for FormData
    }
  }
  
  const handleSubmit = async(e) =>{
    e.preventDefault();
    if(!name || !email || !mobileNumber || !address || !zipCode || !image){
        setError("All fields are mandatory");
        return;
    }
    if(!validateEmail(email)){
        setError("Please enter a valid email");
        return;
    }
    if(!validateMobile(mobileNumber)){
        setError("Please enter a valid mobile number");
        return;
    }
    if(!validateZipCode(zipCode)){
        setError("Please enter a valid PIN code");
        return;
    }
   
    setError("");
    // Add profile API Call
    const formData= new FormData();
    formData.append('name',name)
    formData.append('email',email)
    formData.append('mobileNumber',mobileNumber)
    formData.append('address',address)
    formData.append('zipCode',zipCode)
    formData.append('profileImage',image)

    // Sending the FormData to the server
    try {
        // Send form data as multipart form-data to the server
        const response = await userAxiosInstance.post('/addprofile', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
    // try{
    //     const response = await userAxiosInstance.post("/addprofile",formData);        
        if(response.data && response.data.user){
            console.log(response,"response");
            localStorage.setItem("userName",response.data.user.name)
            navigate('/home')
        }
    }catch(error){
        console.log(error,"error");
        if(error.response && error.response.data && error.response.data.message){
            setError(error.response.data.message)
        }
        else{
            setError("An unexpected error occurred.Please try again")
        }
    }
  }
 
  return (
    <div className='container'>
            <div className='sidebar-container'>             
                <div className='profile-img-container'>
                    <img src={image ? URL.createObjectURL(image) : ProfileImg}  alt='Profile Image' width="100" height="100" />
                    <input 
                        type='file' 
                        name="profileImage"
                        accept='image/*'
                        ref={inputRef}
                        onChange={handleImageUpload}
                    />
                    <button className='image-upload-button'  onClick={handleImageClick} ><FaCamera/></button>
                </div>
                <div className='logo-container'>
                    <img src={MachineImg} alt='Washing Machine' width="100" height="100"/>   
                    <h4>We Makes Everything Clean</h4>
                </div>
            </div>
            <div className='right-container'>
           
                <div className='form-container'>
              
                    <form onSubmit={handleSubmit}>
                  
                        <input
                            type='text' 
                            placeholder='Name' 
                            className='input-box'
                            value={name}
                            onChange={(e)=>setName(e.target.value)}/>
                        <input 
                            type='email' 
                            placeholder='Email'
                            className='input-box'
                            value={email}
                            onChange={(e)=>setEmail(e.target.value)}/>
                        <input 
                            type='tel' 
                            placeholder='Mobile Number'
                            className='input-box'
                            value={mobileNumber}
                            onChange={(e)=>setMobileNumber(e.target.value)}/>
                        <textarea 
                            placeholder='Address'
                            className='textarea-box'
                            value={address}
                            onChange={(e)=>setAddress(e.target.value)}/>
                        <input 
                            type='text' 
                            placeholder='ZipCode'
                            className='input-box'
                            value={zipCode}
                            onChange={(e)=>setZipCode(e.target.value)}/>
                        {error && <p className='error-text'>{error}</p>}
                        <button type='submit' className='save-button'>SAVE</button>
                    </form>
                </div>
            </div>         
      </div>
  )
}

export default AddProfileDetails