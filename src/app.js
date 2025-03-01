const express = require("express");
const app = express();
const connectDB=require("./config/database");
const cookieParser = require("cookie-parser");
const {authRouter }= require("./routes/auth");
const {requestRouter} = require("./routes/request");
const {profileRouter} = require("./routes/profile");
const {userRouter}=require("./routes/user");


app.use(cookieParser());
app.use(express.json())
app.use("/",authRouter);
app.use("/",requestRouter);
app.use("/",profileRouter);
app.use("/",userRouter);


connectDB().then(()=>{
    console.log('connected to database')
    app.listen(3000,()=>{
        console.log("Server started on port 3000");
    })
}).catch((err)=>{
    console.log(err)
})



