const mongoose = require("mongoose");



if(!process.env.MONGODB_URI){
    console.log("MONGO DB url is not defined in the envirenmonet variables");
}


const connectToDb = async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("DataBase Connection Successfull");
    } catch (error) {
        console.log('Something Went Worng',error.message);
        process.exit(1);
    }
}

module.exports = connectToDb;