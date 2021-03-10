const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { check, validationResult } = require("express-validator");
const config = require("config")
const router = express.Router();

//register users:public
router.post(
  "/",
  [
    check("fname", "First name should be unique").not().isEmpty(),
    check("lname", "Last name should be unique").not().isEmpty(),
    check("email", "email should be valid").isEmail(),
    check("password", "Password should be atleast 6 characters").isLength({
      min: 4,
    }),
    check("gender","gennder must be either male or female").not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { fname, lname, email, password, occupation, bio, gender } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: "User Already Exists" });
      }
      user = new User({fname, lname, email, password, occupation, bio, gender })
      let salt = await bcrypt.genSalt(12)
      user.password = await bcrypt.hash(password,salt)
      await user.save()
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

  
  }
);

module.exports = router;
