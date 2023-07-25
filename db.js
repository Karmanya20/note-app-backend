const mongoose = require("mongoose");
mongoUri="mongodb://0.0.0.0:27017/inotebook";
const connecttoMongo= async ()=>{
    mongoose.connect(mongoUri,await console.log("Connection successful"))
}
module.exports=connecttoMongo;