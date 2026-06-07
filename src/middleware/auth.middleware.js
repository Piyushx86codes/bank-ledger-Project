const userModel = require("../models/user.model");
const jwt = require('jsonwebtoken');


async function authMiddleware(req,res,next){
    const token = req.cookies.token || req.headers.authorization.split("")[1];
    if(!token){
        return res.status(401).json({
            success:false,
            message:"unAuthorized Access, Token is Missing",
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.userId);
        req.user = user;
        return next();
    } catch (error) {
         return res.status(401).json({
            success:false,
            message:"unAuthorized Access, Token is invalid",
        })
    }
}

async function authSystemUserMiddleware(req,res,next){
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if(!token){
        return res.status(401).json({
            success:false,
            message:"UnAuthorized Access, Token is Missing"
        })
    }

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.userId).select("+systemUser");
        if(!user.systemUser){
            return res.status(403).json({
                message:"Forbidden Access, User is Not a System user"
            })
        }
        req.user = user;
    } catch (error) {
         return res.status(401).json({
            success:false,
            message:"Invalid Access, token is invalid",
         })
    }
}

module.exports ={
    authMiddleware,
    authSystemUserMiddleware
}