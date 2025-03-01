const express=require('express');
const { userAuth } = require('../middlewares/auth');
const mongoose = require('mongoose');

const userRouter=express.Router();
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

//Get all the pending request for a logged in user
userRouter.get('/user/requests/received',userAuth ,async (req,res)=>{

    const loggedInUser = req.user;
    try {
        const connectionRequests = await ConnectionRequest.find({
           toUserId:loggedInUser._id,
           status: 'interested'
          
        }).populate('fromUserId','firstName lastName photoUrl age gender about skills')
        res.json({
            message:"It's your connection requests",
            data:connectionRequests
        })


        
    } catch (error) {
       res.status(400).json({message:error.message})  
    }
})

userRouter.get('/user/connections',userAuth ,async (req,res)=>{
    // a->b->accepted
   // b->c->accepted
   //if i want to find the connection of 'b' then we have to check both fromUser,toUser in connectionRequest db and status is accetped


    try {
        const loggedInUser = req.user;
        const connections = await ConnectionRequest.find({
            $or:[{fromUserId:loggedInUser._id},{toUserId:loggedInUser._id}],
            status:'accepted'
        })
        .populate('fromUserId','firstName lastName photoUrl age gender about skills').populate('toUserId','firstName lastName photoUrl age gender about skills')
        const data=connections.map((row)=>{
            if(row.fromUserId._id.toString()==loggedInUser._id.toString()){
                return row.toUserId
            }
            return row.fromUserId
            
        })
        res.json({
            message:"It's your connections",
            data
        })

        
    } catch (error) {
        res.status(400).json({message:error.message})
        
    }

})

userRouter.get('/feed',userAuth ,async (req,res)=>{

    try {
        const loggedInUser = req.user;
        //find all connection requests(send+received)
        const connectionRequests=await ConnectionRequest.find({
            $or:[{fromUserId:loggedInUser._id},{toUserId:loggedInUser._id}],

        }).select("fromUserId toUserId")

        const hideUserFromFeed=new Set();
        connectionRequests.forEach((row)=>{
            hideUserFromFeed.add(row.fromUserId.toString());
            hideUserFromFeed.add(row.toUserId.toString());
        })
       
        const users=await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUserFromFeed).map(id => new mongoose.Types.ObjectId(id)) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        }).select("firstName lastName photoUrl age gender about skills")
        res.json({
            message:"It's your feed",
            data:users
        })

        
    } catch (error) {
        res.status(400).json({message:error.message})
        
    }
})



   

module.exports={userRouter};