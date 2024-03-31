const mongoose = require('mongoose');

const db_uri = process.env.MONGODB_URI || "mongodb://localhost:27017/messenger";
       console.log(db_uri)
const dbConnect = async ()=>{
    try{
          const {connection} = await mongoose.connect(db_uri);

          if(connection){
            console.log(`connected to MongoDb: ${connection.host}`)
          }
    }catch(e){
            console.log(e);
            process.exit(1);
    }
}

module.exports = dbConnect