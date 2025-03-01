const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    status:{
        type:String,
        enum:{
            values:["ignored","interested","accepted","rejected"],
            message:"{VALUE} is not supported"
        },
        default:"pending",
        required:true
    }
    
},{timestamps:true}) 

connectionRequestSchema.pre("save",function(next){
    const connectionRequest=this;
    //check fromUser equal to toUserId or not
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("fromUserId and toUserId cannot be equal");
    }
    next();

})
//compound index to make query faster
connectionRequestSchema.index({fromUserId:1,toUserId:1}, {unique:true});
const ConnectionRequestModel = mongoose.model("ConnectionRequest", connectionRequestSchema);
module.exports = ConnectionRequestModel