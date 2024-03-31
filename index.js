const express = require('express');
require('dotenv').config()
const app = express();

const port = process.env.PORT || 5000

app.use("/" , (req,res)=>{
    return res.json({message: "Hello From Express App"})
 })

 app.listen(port , ()=>{

   console.log(`Server is listen at http://localhost:${port}`)
})
