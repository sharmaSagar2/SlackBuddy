


const validator = require("validator")

const validateSignUpData = (req)=>{
    const {firstName,lastName,emailId,password} = req.body;
    if(!firstName || !lastName || !emailId || !password){
        return {error:"Please fill all the fields"};
    }
    else if(firstName.lenght<3 && firstName.lenght>50){
        return {error:"First name should be between 4 and 50 characters"};
    }
    else if(!validator.isEmail(emailId)){
        return {error:"Invalid email address"};
    }
    else if(!validator.isStrongPassword(password)){
        return {error:"Password should be at least 8 characters long, strong and contain at least one lowercase letter, one uppercase letter, one number and one special character."};  
    }
}

const validateEditProfileData = (req)=>{
    const allowedEditFields = [
        "firstName",
        "lastName",
        "emailId",
        "photoUrl",
        "gender",
        "age",
        "about",
        "skills"
    ]
    const isEditAllowed=Object.keys(req.body).every((fields)=>allowedEditFields.includes(fields));
    return isEditAllowed;
}
module.exports={
    validateSignUpData,
    validateEditProfileData
}