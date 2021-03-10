const express = require('express');
const database = require('./config/database')
const app = express();

//db connection
database()

//json data parsing
app.use(express.json({extended:false}))

//listing to the end points
app.use("/api/user",require("./routes/user"))
app.use("/api/auth",require("./routes/auth"))
app.use("/api/poems",require("./routes/poems"))



const PORT = 6000;

app.listen(PORT, () => {
  console.log(`Server Succesfully Started on Port ${PORT}`);
});
