const userModel = require("../models/userModel");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerController = async (req,res) => {
    try{
        const existingUser = await userModel.findOne({email:req.body.email})
        if(existingUser){
            return res.status(400).json({
                status:false,
                message:"Email already exists",
                user:existingUser
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password,salt);
        req.body.password = hashPassword;
        const user = new userModel(req.body);
        await user.save();
        return res.status(201).json({
            status:true,
            message:"User created successfully",
            data:user,
        });
    }catch(error){
        console.log(error);
        res.status(500).json({
            status:false,
            message: "Error in register api",
            error
        });
    }
}

const loginController = async (req,res) => {
    try{
        if(!req.body.email) {
            return res.status(422).json({
                status: false,
                message: "Email field is required",
            });
        }else if(!req.body.password) {
            return res.status(422).json({
                status: false,
                message: "Password field is required",
            });
        }

        const user = await userModel.findOne({email:req.body.email});
        if(!user) {
            return res.status(404).json({"status":false,"message":"Invalid crenditials"});
        }
        if(user.role !==req.body.role) {
            return res.status(500).json({"status":false,"message":"Role does not match"});
        }

        const hashedPassword = await bcrypt.compare(req.body.password,user.password);
        if(!hashedPassword) {
            return res.status(422).json({"status":false,"message":"Password does not match"});
        }
        const token = await jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:'1d'});
        return res.status(200).json({
            status: true,
            message: "Logged In Successfully!",
            token,
            user,
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            status : false,
            message : "Error in login api",
            error
        });
    }
}

const currentUserController = async (req,res) => {
    try{
        const user = await userModel.findOne({_id:req.body.userId});
        return res.status(200).send({
            status:true,
            message:"User fetched successfully",
            user
        });
    }catch(error){
        console.log(error);
        return res.status(500).send({
            status:false,
            message:error,
            error
        });
    }
}

module.exports = {registerController,loginController,currentUserController}