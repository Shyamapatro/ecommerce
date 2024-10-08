const jwt = require("jsonwebtoken");
const {secret} = require("../config/auth.config.js");
const redisClient = require('../utills/redisUtil');

exports.verifyToken = async(req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }
    let decoded;
    try {
        decoded = jwt.verify(token,secret );
    } catch (err) {
        // console.error("Token verification failed:", err);
        return res.status(401).send({ message: "Unauthorized!" });
    }

    const userId = decoded.id; 
    const key = `x-access-token:${userId}`;
    // console.log(key,userId)
    const redisToken = await redisClient.get(key);
    if (!redisToken) {
        console.log("Auth failed: Token is invalid or has been logged out.");
        return res.status(401).send({ message: "Unauthorized!" });
    }

    
    req.userId = userId; 
    next();

};


