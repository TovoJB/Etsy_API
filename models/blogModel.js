const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    numViews:{
        type:Number,
        default:0,
    },
    isLiKed : {
        type:Boolean,
        default: false,
    },
    isDisliked : {
        type:Boolean,
        default:false,
    },
    likes : [
        {
            type :mongoose.Schema.Types.ObjectId,
            ref:"User",
        }
    ],
    dislikes : [
        {
            type :mongoose.Schema.Types.ObjectId,
            ref:"User",
        }
    ],
    image :{
        type: String,
        default:"https://img.freepik.com/vecteurs-libre/bloguer-amusant-creation-contenu-streaming-ligne-blog-video-jeune-fille-faisant-selfie-pour-reseau-social-partage-commentaires-strategie-auto-promotion-illustration-metaphore-concept-isole-vecteur_335657-855.jpg?w=2000",
    },
    author: {
        type: String,
        default:"Admin",
    },
    images:[],
},
{
    toJSON:{
        virtuals:true,
    },
    toObject:{
        virtuals:true,
    },
    timestamps:true,
}
 );

//Export the model
module.exports = mongoose.model('Blog', blogSchema);