const { default: mongoose } = require("mongoose")
require('dotenv').config()
exports.Dbconnect=async()=>{
    try {
       await mongoose.connect(process.env.MONGODB_URL)
       console.log("mongodb Connection successfull")
    } catch (error) {
       console.log(error)
    }
   } 