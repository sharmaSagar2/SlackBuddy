const express = require("express");
const { userAuth } = require("../middlewares/auth");
const requestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid status type " + status,
        });
      }
      const toUserExisting = await User.findById(toUserId);
      if (!toUserExisting) {
        return res.status(400).json({
          message: "User not found",
        });
      }
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        return res.status(400).json({
          message: "Connection request already exists",
        });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      let message = "";
      if (status === "interested") {
        message = `${req.user.firstName} has sent a connection request to ${toUserExisting.firstName}.`;
      } else if (status === "ignored") {
        message = `${req.user.firstName}'s connection request was ignored by ${toUserExisting.firstName}.`;
      }
      const data = await connectionRequest.save();
      res.json({
        message,
        data,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

requestRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{
  try {

    const loggedInUser=req.user;
    const allowedStatus = ["accepted", "rejected"];
    const{ status,requestId} = req.params;
    console.log("requestId",requestId);
    if(!allowedStatus.includes(status)){
        return res.status(400).json({
            message: "Invalid status type " + status,
          });
    }
    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status:"interested"
    })
    if(!connectionRequest){
      return res.status(400).json({
        message: "Connection request not found",
      });
    }
    connectionRequest.status=status;
    const data = await connectionRequest.save();
    res.json({
        message:`${loggedInUser.firstName} has ${status} the connection request from ${connectionRequest.fromUserId.firstName}`,
        data
    });
    
  } catch (error) {
    res.status(400).json({ message: error.message });
    
  }
})

module.exports = {
  requestRouter,
};
