const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
    },
    slug:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number ,
        required:true,
    },
    category:{
        type: String , /*mongoose.Schema.Types.ObjectId,*/
        //ref:"Category",
        required: true ,
    },
    brand :{
        type:String,
        //enum:["Apple" , "Samsung" , "lenovo"],  
        required: true ,
    },
    quantity:{
        type:Number ,
        required : true,
    } ,
    sold:{
        type:Number,
        default:0,
    },
    images:{
        type: Array
    },
    color:{
        type:String,
        //enum:["black" , "Brown" , "red"]
        required : true,
    },
    ratings:[{
        start:Number ,
        postedby:{type: mongoose.Schema.Types.ObjectId , ref:"User"}
    }
],
},{timestamps:true});

//Export the model
module.exports = mongoose.model('product', productSchema);