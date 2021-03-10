const express = require("express");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const config = require('config')
const router = express.Router();
const Auth = require('../middleware/Auth')

//login public
router.post('/',[
    check("email", "email should be valid").isEmail(),
    check("password", "Password should be atleast 6 characters").isLength({
      min: 4,
    }),
],async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
        try {
            let user = await User.findOne({email})
            if(!user){
                return res.status(400).json({msg:"Invalid Credentials"})
            }
            let isMatch = await bcrypt.compare(password,user.password);
            if(!isMatch)
            {
                return res.status(400).json({msg:"Invalid Credentials"})
            }
            const payLoad = {
                user:{
                    id:user.id
                }
            }
            jwt.sign(payLoad,config.get("secret"),{
                expiresIn:360000
            },(err,token)=>{
                if (err){
                    throw err
                }
                res.json({token})
            })
        } catch (error) {
            res.status(500).json({ msg: 'Server Error' });
        console.log(error.message);
        }
})

//get currently logged in user:PRIVATE
router.get('/',Auth,async(req,res)=>{
  try {
    let user = await User.findById(req.user.id).select("-password")
    return res.status(200).json({user})
  } catch (error) {
    res.status(500).json({ msg: 'Server Error' });
    console.log(error.message);
  }
})


//update profile info:PRIVATE
router.put('/:id',Auth,async(req,res)=>{
   try {
    let user = await User.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    }).select("-password")
    if(!user){
    return res.status(400).json({msg:"No such user"});

    }
    return res.status(200).json({user})
   } catch (error) {
    res.status(500).json({ msg: 'Server Error' });
    console.log(error.message);
   }
})


module.exports = router