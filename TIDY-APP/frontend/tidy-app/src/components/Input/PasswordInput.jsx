import React, { useState } from 'react'
import {FaRegEye, FaRegEyeSlash} from "react-icons/fa6"
import "./PasswordInput.css"

const PasswordInput = ({value,onChange,placeholder,disabled}) => {
    const[isShowPassword,setIsShowPassword]=useState(false);
    const toggleShowPassword = () =>{
        setIsShowPassword(!isShowPassword);
    }
    return (
        <div className='password-input-container'>
            <input 
                type={isShowPassword?'text':'password'} 
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}/>
            <div>
                {isShowPassword?(
                    <FaRegEye onClick={toggleShowPassword}/>):(
                    <FaRegEyeSlash onClick={toggleShowPassword}/>)
                }
            </div>
        </div>
    )
}

export default PasswordInput