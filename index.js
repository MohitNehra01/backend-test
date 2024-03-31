require('dotenv').config()
const cloudinary = require('cloudinary')

const port = process.env.PORT || 5000
const app = require('./app')
const dbConnect = require('./db')


// cludinary configartion

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

app.listen(port , ()=>{
     dbConnect();
    console.log(`Server is listen at http://localhost:${port}`)
})