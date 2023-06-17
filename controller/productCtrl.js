const product = require("../models/produitModule");
const  asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const User = require("../models/userModel");
const { findById } = require("../models/blogModel");
const validateMongoDbid = require("../utils/vlidateMongobdId");
const cloudinaryUploadImg = require("../utils/cloudinary")

// CREATE PRODUIT
const creatproduct = asyncHandler(async(req , res )=>{
try{
    if(req.body.title){
        req.body.slug = slugify(req.body.title);
    }
const newProduit = await product.create(req.body);
res.json(newProduit);
}catch(error){
 throw new Error(error);
}
});
// UPDATE PRODUIT
const updateProduit = asyncHandler(async (req, res) => {
    const id = req.params.id; // Accéder à la propriété id de req.params
    try {
      if (req.body.title) {
        req.body.stug = slugify(req.body.title);
      }
      const updateproduct = await product.findByIdAndUpdate(
        id, // Utiliser directement l'ID
        req.body,
        { new: true }
      );
      res.json(updateproduct);
    } catch (error) {
      throw new Error(error);
    }
  });

  // DELETE PRODUCT
  const deleteProduit = asyncHandler(async (req, res) => {
    const id = req.params.id; // Accéder à la propriété id de req.params
    try{
        const deleteproduit = await product.findByIdAndDelete(id);
        res.json(deleteproduit);
    }catch(error){
        throw new Error(error);
    }
  });

//GET a produit
const getaproduct = asyncHandler( async(req , res)=>{
    try{
        const {id} = req.params
        const findprodut = await product.findById(id);
        res.json(findprodut)
    } catch(eror){ 
        throw new Error(eror);
    }

})

// GET all produits

const getAllproducts = asyncHandler(async (req , res )=>{//http://localhost:5000/api/product?price[lte]=1500
    //filtering
   try{
    const queryObj = {... req.query}
    const excludeFiles = ["page","sort","limit","fields"];
    excludeFiles.forEach((el) => delete queryObj[el]);
    console.log(queryObj)
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)/g, match => `$${match}`);
    console.log(queryStr);

    let query = product.find(JSON.parse(queryStr));
    
    //sorting 
    //http://localhost:5000/api/product?sort=category,brand
    //http://localhost:5000/api/product?sort= -category contraire
    if(req.query.sort){
        const sortBy = req.query.sort.split(",").join(" ");//triage alphabetique
        query = query.sort(sortBy);
    }   else{
        query = query.sort("-createdAt");//si non par date de creation
    }

    // limiting the fields
    // filtrer les chose qu on veut voire
    //http://localhost:5000/api/product?fields=title,price,category
    /*
    	{
		"_id": "64748a13c2aab435648baced",
		"title": "Apple watch",
		"price": 3500,
		"category": "watch"
	},
    */
    if(req.query.fields){
        const fields = req.query.fields.split(",").join(" ");
        query = query.select(fields);
    }else{
        query = query.select('-__v');
    }

    // padination
    //http://localhost:5000/api/product?page=1&limit=3
    //page 1 et 3 produit maxsss
    // c est pour cree les page @le apk , genre page 1 , 2 , 3 ana  produit
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page -1)*limit;
    query = query.skip(skip).limit(limit)

    if(req.query.page){
        const produitcount = await product.countDocuments(); // c est poure pendre le nombre des produit
        if(skip >= produitcount) throw new Error("this page does not exiats")
    }

    console.log(page,limit,skip);

    const Product =await query
    res.json(Product);
   } catch(error){
    throw new Error(error);
   }
})


const addToWishlist = asyncHandler(async(req,res)=>{
    const {_id} = req.user ; 
    const {prodId} = req.body ;
    try{
       
        const user  = await User.findById(_id);
        const alreadyadded = user.wishlist.find((id)=> id.toString()===prodId);
        if(alreadyadded){
            let  user = await User.findByIdAndUpdate( _id, {
                $pull:{ wishlist : prodId},
            },{
                new : true ,
        },) 
    res.json(user)
    } else{
            let  user = await User.findByIdAndUpdate( _id, {
                  $push:{ wishlist : prodId},
            },{
                 new : true ,
        },)
        res.json(user)
}
    }catch(error){
        throw new Error(error);
    }
})


const rating = asyncHandler( async(req , res)=>{
const {_id} = req.user ;
const {star , prodId , comment} = req.body ;
try{
    const Product = await  product.findById(prodId);
    let alreadyRater = Product.ratings.find((userId)=> userId.postedby.toString() === _id.toString());
    if(alreadyRater){
       const updateRating = await product.updateOne(
        {
            ratings: {$elemMatch: alreadyRater},
       },
       {
        $set: {"ratings.$.start": star , "ratings.$.comment": comment},
       },
       {
        new:true ,
       }
       );
    }else{
       const rateProduct = await product.findByIdAndUpdate(prodId , {
        $push: {
            ratings : {
            start:star,
            comment:comment,
            postedby:_id,
        },
    }
    },{
        new:true,
    });
    }

    const getallrating = await product.findById(prodId);
    const totalRating = await getallrating.ratings.length;
    const ratingsum = await getallrating.ratings
        .map((item)=> item.start)
        .reduce((prev , curr)=> prev+curr ,0) ;
    let actualRating = Math.round(ratingsum/totalRating)   ;
    let finalproduct = await product.findByIdAndUpdate(prodId , {
        totalrating :actualRating,
        
    },{new:true,})
                                                
res.json(finalproduct)
}catch(error){
    throw new Error(error)
}
})


const uploadImages = asyncHandler( async(req , res)=>{
    const { id } = req.params ;
    validateMongoDbid(id)
    try{
        const upload = (path) => cloudinaryUploadImg(path , "images");
        const urls = [];
        const files = req.files;
        for(const file of files){
            const {path} = file ;
            const newpath = await upload(path);
            urls.push(newpath);
        }
        const findProduct =await product.findByIdAndUpdate( id , 
            {
               images: urls.map((file)=>{ return file}),
            },{
                new:true,
            }
           )
        res.json(findProduct)
    }catch(error){
        throw new Error(error);
    }
})


module.exports = {
    creatproduct,
    getaproduct,
    getAllproducts ,
    updateProduit,
    deleteProduit,
    addToWishlist,
    rating,
    uploadImages
};