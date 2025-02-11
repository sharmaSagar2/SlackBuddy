const { JsonWebTokenError } = require("jsonwebtoken");
const mongoose = require("mongoose");
const validator = require("validator")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema =  new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:3,
        maxLength:50
    },
    lastName:{
        type:String,
        required:true
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        validate:function(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email");
            }
        }
    },
    password:{
        type:String,
        required:true,
        validate:function(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Password is not strong");
            }
        }
    },
    age:{
        type:Number,
        min:15,
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female","other"].includes(value)){
                throw new Error("Invalid gender");
            }
        }
    },
    photoUrl:{
        type:String,
        validate:function(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid URL");
            }
        }
    },
    about:{
        type:String
    },
    skills:{
        type:[String]
    }
},{timestamps :true});

userSchema.methods.getJWT = async function(){
    const token = jwt.sign({_id:this._id},"JWT_SECRET_KEY")
    return token;

}
userSchema.methods.validatePassword=async function(passwordInputByUser){
    const user=this;
    const passwordHash = user.password;
    const isPasswordMatch = await bcrypt.compare(passwordInputByUser,passwordHash);
    return isPasswordMatch

}
const User = mongoose.model("User",userSchema);
module.exports = User