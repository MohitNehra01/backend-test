const Conversation = require("../models/conversationSchema");
const Message = require('../models/messageSchema');
const AppError = require("../utils/error.util");

const newMessage = async(req,res , next)=>{
    const {conversationId , senderId ,receiverId , text , type }  = req.body;

    if(!conversationId || !senderId || !receiverId || !text || !type){
        return next(new AppError("all field is required",400))
    }
    try {
          const newMessage = new Message(req.body);
          await newMessage.save();

          await Conversation.findByIdAndUpdate(req.body.conversationId , {
            message: req.body.text
          })

          return res.status(200).json({
            success: true , 
            msg: 'Message has been sent successfully'
          })
    } catch (error) {
        return next(new AppError(error.message , 500))
    }
}

const getMessage = async(req,res,next)=>{
     const conversationId = req.params.id;
     if(!conversationId){
        return next(new AppError('need conversation id' , 400));
     }
     try{const message = await Message.find({
        conversationId
     })

     return res.status(200).json({success: true,
  msg: message})}
  catch(error){
    return next(new AppError(error.message , 500))
  }
}
module.exports = {newMessage , getMessage}