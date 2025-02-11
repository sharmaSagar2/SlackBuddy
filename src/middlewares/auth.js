const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
  try {
    //Read the token from the req cookies
    const { token } = req.cookies;
    
    if (!token) {
        return res.status(401).json({ message: "You are not authenticated" }); 
    }
    //validate the token
    const decodedObj =  jwt.verify(token, "JWT_SECRET_KEY");

    //find the user
    const { _id } = decodedObj;
    const user = await User.findById(_id);
    if (!user) return res.status(401).send({ error: "Please authenticate" });
    //attach the user to the req
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate" });
  }
};
module.exports = {
  userAuth,
}
