
const express = require("express");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Auth = require("../middleware/Auth")
const Poems = require('../models/Poems')
const {check, validationResult} = require('express-validator');


const router = express.Router();


//create a poem:PRIVATE

router.post(
    '/',
    [
      Auth,
      [
        check('body', 'body is required and should be 7 min characters')
          .not()
          .isEmpty().isLength({min:7}),
          check('title', 'title is required and should be 7 min characters')
          .not()
          .isEmpty().isLength({min:7}),
      ],
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
      }
  
      const {body, title, category,user} = req.body;
  
      try {
  let poem = await Poems.findOne({body})

        if(poem){
            return res.status(400).json({msg:"Poem body already exists"})
        }
        poem = new Poems({
          body,
          title,
          category,
    
        user: req.user.id,
        });
  
         await poem.save();
  
        res.json(poem);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    },
  );

  //get poems as per user:PRIVATE
  router.get("/",Auth,async(req,res)=>{
      
        try {
            let poem = await Poems.find({user:req.user.id}).sort({date:-1})
            res.json(poem)
        } catch (error) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
  })

  //view all poems in the system
  router.get('/allPoems',async(req,res)=>{
      try {
        let allPoems = await Poems.find().sort({date:-1})
        res.json(allPoems)
      } catch (error) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
  })

  //update poem:private
  router.put('/:id',Auth,async(req,res)=>{
   try {
    let poem = await Poems.findByIdAndUpdate(req.params.id,req.body,{
      new:true,
      runValidators:true
    })
    if(!poem){
      return res.status(400).json({msg:"No such Poem to be edited"})

    }
    return res.status(200).json({poem})
   } catch (error) {
    res.status(500).json({ msg: 'Server Error' });
    console.log(error.message);
   }

  })


  //delete poem
  router.delete('/:id',Auth,async(req,res)=>{
try {
  let poem = await Poems.findOneAndDelete(req.params.id)
  if(!poem){
    return res.status(400).json({msg:"Po such Poem to be edited"})

  }
  return res.status(200).json({})

} catch (error) {
  res.status(500).json({ msg: 'Server Error' });
  console.log(error.message); 
}
  })

module.exports = router