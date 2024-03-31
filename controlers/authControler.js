
const AppError = require('../utils/error.util')
const emailValidator = require('email-validator')
const User = require('../models/user')
const cloudinry = require('cloudinary')
const fs = require('fs/promises')


const cookieOption = {
    maxAge : 4*24*50*60*1000, // 4days
    httpOnly : true,
    // secure: true
}
const register = async (req, res, next) => {
    
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
        return next(new AppError('All fields are required', 400))
    }
    
    const validEmail = emailValidator.validate(email);
    if (!validEmail) {

        return next(new AppError('Please provide a valid email id'), 400)
    }

    if (password != confirmPassword) {
        return next(new AppError('Password and confirmPassword must be same'), 401)
    }

    try {


        let user = await User.findOne({ email });

        if (user) {
            return next(new AppError('this user is already exist with this email so try again with new email', 400))
        }
        
        // create user
        user = await User.create({
            name,
            email,
            password,
            avatar: {
                public_id: email,
                secure_url: 'https://www.gla.ac.in/Uploads/image/662imguf_dommy.jpg'
            }
        })

        // user regstration failed
        if (!user) {
            return next(new AppError('User registration failed , Please try again', 400))
        }
         
        const token = await user.jwtToken();

        res.cookie('auth_token',token , cookieOption)
        
        // file upload

        console.log('File ', req.file);

        // file exist karti to 
        if (req.file) {
            try {

                const result = await cloudinry.v2.uploader.upload(req.file.path, {
                    folder: 'messenger/dp',
                    width: 250,
                    height: 250,
                    gravity: 'faces',
                    crop: 'fill'
                })
                // console.log(result)
                // console.log(user)
                if (result) {
                    user.avatar.public_id = result.public_id;
                    user.avatar.secure_url = result.secure_url;


                    // remove from server

                    fs.rm(`uploads/${req.file.filename}`)
                }

            } catch (error) {
                console.log("in file upload catch")
                console.log(error.message)

                return next(new AppError(`File not upload , please try again ${error.message}`, 500))
            }
        }

        await user.save();

        user.password = undefined;

     


        return res.status(200).json({ success: true,msg:'Successfuly created new account', user: user  , token})

    } catch (error) {
        console.log("in file catch")
        return res.status(500).json({
            success: false,
            msg: error.message
        })
    }


}

const login = async (req,res,next)=>{

    const {email , password} = req.body;
    
    if(!email || !password){
        return next(new AppError('Every field is mandatory', 400))
    }
    const validEmail = emailValidator.validate(email);
    if (!validEmail) {

        return next(new AppError('Please provide a valid email id'), 400)
    }

    try {
        
        let user = await User.findOne({email}).select('+password');

        // check for email
        if(!user){
            return next(new AppError('invalid credentials' , 401))
        }
        // check for password
        if(! await user.passwordCompare(password)){
            return next(new AppError('invalid credentials' , 401))
        }
         
        user.password = undefined
        const token = await user.jwtToken();

       return res.status(200).cookie('auth_token',token , cookieOption).json({success: true ,
            msg: 'User loggedin successfuly',
            user, 
        token})

       
        
    } catch (error) {
           
         return next(new AppError(error.message , 500))
    }
}

const getUserDetail = async (req,res,next)=>{
      const userId = req.user.id;
      console.log(req.user.id)

      try {
          let user = await User.findById(userId)
          console.log(user)
          return res.status(200).json({
            success: true,
            msg: 'User details',
            user: user
        })
      } catch (error) {
        return next(new AppError('Failed to fetch profile details') , 500)
      }
}

const getAllUser = async (req, res,next)=>{
    try {

        let user = await User.find();

         return res.status(200).json({success: true , users: user})
        
    } catch (error) {
        return next(new AppError('Failed to fetch  Users') , 500)
    }

}
const logout = async (req, res, next) => {
    try {
        res.cookie("auth_token" , null ,{
            expries: new Date(),
            httpOnly: true,
            maxAge : 0,
            secure: false
        })

        // res.clearCookie("token")

        res.status(200).json({
            success: true,
            msg: "Logged Out"
        })
    } catch (e) {
       return next(AppError('Failed to logout , try again' , 500));
    }
}

module.exports = { register ,login , getUserDetail , logout ,getAllUser}