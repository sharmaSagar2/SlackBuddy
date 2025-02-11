const mongoose = require('mongoose');
const connectDB= async ()=>{
    await mongoose.connect("mongodb+srv://sagarsharma12003:cBJdJQOdf1zHtNM4@cluster0.tnw8s.mongodb.net/devTinder")
}

module.exports=connectDB;

