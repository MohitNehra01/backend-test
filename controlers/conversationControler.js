const Conversation = require('../models/conversationSchema')
const AppError = require('../utils/error.util')

const newConversation = async(req,res,next)=>{
    const {senderId , receiverId} = req.body

    if(!senderId || !receiverId){
        return next(new AppError('All field is required',400));
    }

    try {
        
        const exist = await Conversation.findOne({
            members:{$all : [senderId , receiverId]}
        })

        if(exist){
            return res.status(200).json('conversation already exists');
        }

        const newConversation = await Conversation.create({
            members:[senderId , receiverId]
        })

        return res.status(200).json('conversation saved successfully')
    } catch (error) {
        return next(new AppError(error.message , 500))
    }
}

const getConversation = async(req,res,next)=>{
    const {senderId , receiverId} = req.body
    if(!senderId || !receiverId){
        return next(new AppError('All field is required',400));
    }
    try {
        const data =  await Conversation.findOne({members:{$all: [receiverId , senderId]}})
       
        if(!data){
            return next(new AppError('this conversation does not exist',400));
        }

        return res.status(200).json({
            success: true,
            data : data
        })

    } catch (error) {
        return next(new AppError(error.message,500));
    }
    
}

module.exports = {newConversation , getConversation}