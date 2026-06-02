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


async function userLoginController(req,res){
      const {email,password} = req.body;
      const user = await userModel.findOne({email}).select("+password");
      if(!user){
        return res.status(401).json({
            success:false,
            message:"user email or password is Invalid",
        })
      }

      const isvalidPassword = await user.comparepassword(password);

      if(!isvalidPassword){
        return res.staus(401).json({
            success:false,
            message:"Password is InValid",
        })
      }

      const token = jwt.sign({userid:user._id},process.env.JWT_SECRET,{
        expiresIn:'3d'
    })

    res.cookie("token",token);

    res.status(200).json({
        success:true,
        message:"LoggedIn Successfully",
    })
}

module.exports ={
    userRegisterController,
    userLoginController,
}