const jwt=require('jsonwebtoken');
const jwt_sec="Hellothisism$e";
fetchuser=(req,res,next)=>{
    const token=req.header('auth-token');
    if(!token){
        res.status(401).send({error: "Please authenticate with valid data."})
    }
    try{
    const data=jwt.verify(token,jwt_sec);
    req.user=data.user;
next()
    }
    catch(error){
        res.status(401).send({error: "Please authenticate with valid data."})
    }
}
module.exports=fetchuser;