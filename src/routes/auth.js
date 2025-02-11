const express = require("express");
const authRouter = express.Router();
const {validateSignUpData}= require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");

authRouter.post('/signup',async (req,res)=>{
    try {
        validateSignUpData(req);
        const { firstName, lastName, emailId, password } = req.body;
        const passwordHash = await bcrypt.hash(password,10);
        const existingUser = await User.findOne({emailId})
        if(existingUser){
            throw new Error("User already exist with this email id");
        }
       
        const user = new User({
            firstName,
            lastName,
            emailId,
            password:passwordHash
        });
        await user.save();
        res.status(201).json({message:"User created successfully"})
        
    } catch (error) {
       
        res.status(400).json({message:error.message}) 
    }
    

})

authRouter.post('/login',async(req,res)=>{
    try {
        const {emailId,password} = req.body;
        const user = await User.findOne({emailId})
        if(!user){
            throw new Error("User not found");
        }
        const isPasswordMatch = await user.validatePassword(password);
        if(isPasswordMatch){
            //create a jwt token
            const token = await user.getJWT();
            //add the token to cookie and send the response back to the user
            res.cookie("token",token);
            res.status(200).json({message:"Login successful"});
        }
        else{
            throw new Error("Invalid credentials");    
        }
        
    } catch (error) {
        res.status(400).json({message:error.message}) 
        
    }
})

authRouter.post('/logout',async(req,res)=>{
    try {
        res.clearCookie("token");
        res.status(200).json({message:"Logged out successfully"})
        
    } catch (error) {
        res.status(400).json({message:error.message})
        
    }
})

module.exports={
    authRouter
}