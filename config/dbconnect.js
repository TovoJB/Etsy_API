const { default: mongoose } = require("mongoose")

const dbConnection = ()=>{
    try{
        const  conn = mongoose.connect(process.env.MONGODB_URL)
        console.log('database connection successfully')
    }catch(error){
       console.log('database connection error')
    }
};

module.exports = dbConnection ;