const multer = require('multer');
const path = require('path')


const upload = multer({
    dest: "uploads/",
    limits: {fileSize: 50 * 1024*1024} , // 50 mb in size max limit
    storage: multer.diskStorage({
        filename: (_req,file,cb) =>{
            cb(null , file.originalname);
        },
    }),
    fileFilter: (_req , file , cb)=>{
        let ext = path.extname(file.originalname);

        if(
            ext !== ".jpg" &&
            ext !== ".jpeg" &&
            ext !== ".png" 
        ){
            cb(new Error(`Unsupported file type! ${ext}`) , false);
            return;
        }

        return cb(null , true);
    }
})

module.exports = upload