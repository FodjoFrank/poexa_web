const mongoose = require('mongoose')
const config = require('config')

const database = async ()=>{
   try {
    await mongoose.connect(config.get('mongoURI'),{
        useCreateIndex:true,
        useNewUrlParser:true,
        useFindAndModify:false
    })
    console.log("Succesfully connected to mongoDB");
   } catch (err) {
       console.log(err.message);
   }

}

module.exports = database