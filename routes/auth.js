const express=require('express');
const User=require('../models/User')
const router=express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const jwt_sec="Hellothisism$e"
const fetchuser=require('../middleware/fetch')
router.post('/createuser',[
    body('name').isLength({min: 3}),
    body('email',"Enter a valid email.").isEmail(),
    body('password', "password must be at least 8 characters.").isLength({min: 8}),
], async (req, res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
     }
     try {
        let user= await User.findOne({email: req.body.email})
        if(user){
           return res.status(400).json({error:"A user with this email already exists."});
        }
        const salt=await bcrypt.genSalt(10)
        secPass=await bcrypt.hash(req.body.password, salt);
        user=await User.create({
           name: req.body.name,
           email: req.body.email,
           password: secPass
        });
        const data={
         user: {
            id: user.id
         }
        }
        const authdata=jwt.sign(data, jwt_sec);
       res.json({authdata});  
     } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occured.")

     }
})
router.post('/login',[
   body('email',"Enter a valid email.").isEmail(),
   body('password', "password must be at least 8 characters.").exists(),
], async (req, res)=>{
   const errors=validationResult(req);
      if(!errors.isEmpty()){
         return res.status(400).json({errors: errors.array()})
      }
      const {email, password}=req.body;
      try{
      let user= await User.findOne({email});
           if(!user){
              return res.status(400).json({error:"Please enter valid credentials"});
           }
           let pass=await bcrypt.compare(password, user.password);
           if(!pass){
            return res.status(400).json({error:"Please enter valid credentials"});
           }
           const data={
            user: {
               id: user.id
            }
           }
           const authdata=jwt.sign(data, jwt_sec);
           console.log(authdata)
          res.json({authdata});
   } catch (error) {
      console.error(error.message);
        res.status(500).send("Some error occured.")

   }
})
router.post('/fetch', fetchuser, async (req, res)=>{
   try{
   userId=req.user.id;
   const user=await User.findById(userId).select("-password");
   res.send(user)
   }
   catch(error){
      console.error(error.message);
        res.status(500).send("Some error occured.")
   }
})
module.exports=router;