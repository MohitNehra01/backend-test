
const express = require('express');
const morgan = require('morgan');
const cors  = require('cors');
const app = express();
const cookieParser = require('cookie-parser')
// const errorMiddleware = require('./middleware/error.middleware')

app.use(cookieParser());
app.use(express.json());
app.use(cors())
app.use(morgan('dev'))

app.use("/" , (req,res)=>{
    return res.json({message: "Hellow From Express App"})
 })
// app.use('/api/auth',require('./routes/userRoute'))
// app.use('/api/conversation', require('./routes/conversation'))
// app.use('/api/message' ,require('./routes/messageRoute'))

app.all('*',(req,res)=>{
    res.status(404).send('OOPS!! 404 page not found')
})

// app.use(errorMiddleware)

module.exports = app