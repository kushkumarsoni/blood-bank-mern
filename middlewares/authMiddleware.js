const JWT = require('jsonwebtoken')

module.exports =  async (req,res,next) => {
    try{
        const token = await req.headers["authorization"].split(" ")[1];
        JWT.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
            if(err){
                return res.status(401).send({
                    status:false,
                    message: 'Invalid Token'
                });
            }else{
                req.body.userId = decoded.userId;
                next();
            }
        });
    }catch(error){
        console.log(error);
        return res.status(500).send({
            status:false,
            message:"Authentication failed"
        });
    }
}