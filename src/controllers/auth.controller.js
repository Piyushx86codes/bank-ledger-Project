const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");


async function userRegisterController(req,res){
    const {email,name,password} = req.body;
    const isExists = await userModel.findOne({
        email:email
    })

    if(isExists){
       return res.status(422).json({
        message:"User Already exist with email",
        status:"failed"
       })
    }

    //user creation//
    const user = await userModel.create({
        email,name,password
    })

    //token creation//
    const token = jwt.sign({userid:user._id},process.env.JWT_SECRET,{
        expiresIn:'3d'
    })

    res.cookie("token",token);

    res.status(201).json({
        success:true,
        message:"User Created Successfully",
        token:token,
        user:{
            id:user._id,
            email:user.email,
            name:user.name
        }
    })
}


module.exports ={
    userRegisterController,
}