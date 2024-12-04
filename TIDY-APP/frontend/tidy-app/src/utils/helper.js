export const validateEmail = (input) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input)
};
export const validateMobile = (input) => {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(input);
};
export const validateZipCode = (input) =>{
    const zipCodeRegex = /^\d{6}$/; 
    return zipCodeRegex.test(input)
}
export const getName = (name) =>{
    // console.log(name,"getname");
    if(!name) return "";
    return name;
}
