const userModel = require('../models/userModel');
module.exports = async (req,res,next) => {
    try{
        const user = await userModel.findById(req.body.userId);
        if(user?.role !== 'admin') {
            return res.status(401).json({
                status:false,
                message: "You are not authorized"
            })
        }else{
            next();
        }
    }catch(error){
        console.log('Error in admin middleware',error);
        res.status(500).json({
            status:false,
            message: 'Internal Server Error in admin middleware',
            error
        });
    }
}