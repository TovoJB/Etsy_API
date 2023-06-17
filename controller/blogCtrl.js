const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbid = require("../utils/vlidateMongobdId");
const cloudinaryUploadImg = require("../utils/cloudinary")
const { model } = require("mongoose");

const creatBlog = asyncHandler(async (req , res ) => {
try{
 const newBlog = await Blog.create(req.body);
 res.json(newBlog,);
}catch (error){
    throw new Error(error)
}
});

const updateBlog = asyncHandler(async(req , res)=>{
    console.log("update")
    const {id}= req.params ;
    validateMongoDbid(id)
    try{
        const updateblog = await Blog.findByIdAndUpdate( id , req.body , {
            new:true ,
        });
        res.json(updateblog);
    }catch(error){
        throw new Error(error)
    }
})

const getBlog = asyncHandler(async(req , res )=>{
    const {id}= req.params ;
    validateMongoDbid(id)
    try{
        const getblog = await Blog.findById(id)
                        .populate("likes")
                        .populate("dislikes") ;
        await Blog.findByIdAndUpdate(id,{
            $inc:{numViews:1},
        },{
            new:true,
        })
        res.json(getblog);
    }catch(error){
        throw new Error(error);
    }
})




const getAllBlog = asyncHandler ( async(req , res )=>{
    try{
        const gettBlogs = await Blog.find()
        res.json(gettBlogs)
    }catch(error){
        throw new Error(error);
    }
   
})

const deleteBlog = asyncHandler(async(req , res)=>{
    const {id}= req.params ;
    validateMongoDbid(id)
 
    try{
        const deleteblog = await Blog.findByIdAndDelete( id , req.body , {
            new:true ,
        });
        res.json(deleteblog);
    }catch(error){
        throw new Error(error)
    }
})

const likeBlog = asyncHandler(async(req , res)=>{
    const {blogId}= req.body ;
    validateMongoDbid(blogId)

    //Find the blog wich you want to be liked
    const blog = await Blog.findById(blogId);
    //console.log(blog)
    //find the login user
    const loginUserId = req?.user?._id ;
    // find if the user has liked blog    
    const isLiKed = blog?.isLiKed;
   
    // find the user if he disliked the blog 
    const alreadyDisliked = blog?.dislikes?.find(((userId) => userId?.toString() === loginUserId?.toString()));
if(alreadyDisliked){
    const blog = await Blog.findByIdAndUpdate(blogId , {
        $pull:{dislikes:loginUserId},
        isDisliked:false,
    },{

        new:true,
    });
    res.json(blog)
}
if(isLiKed){
    const blog = await Blog.findByIdAndUpdate(blogId , {
        $pull:{likes:loginUserId},
        isLiKed:false,
    },{

        new:true,
    });
    res.json(blog);
}else{
    const blog = await Blog.findByIdAndUpdate(blogId , {
        $push:{likes:loginUserId},
        isLiKed:true,
    },{

        new:true,
    });
    res.json(blog);
}
});
/* ******************* */
const dislikeBlog = asyncHandler(async(req , res)=>{
    const {blogId}= req.body ;
    validateMongoDbid(blogId)

    //Find the blog wich you want to be liked
    const blog = await Blog.findById(blogId);
    //console.log(blog)
    //find the login user
    const loginUserId = req?.user?._id ;
    // find if the user has disliked blog    
    const isDisliked = blog?.isDisliked;
   
    // find the user if he liked the blog 
    const alreadyliked = blog?.likes?.find(((userId) => userId?.toString() === loginUserId?.toString()));
if(alreadyliked){
    const blog = await Blog.findByIdAndUpdate(blogId , {
        $pull:{likes:loginUserId},
        isLiKed:false,
    },{

        new:true,
    });
    res.json(blog)
}
if(isDisliked){
    const blog = await Blog.findByIdAndUpdate(blogId , {
        $pull:{dislikes:loginUserId},
        isDisliked:false,
    },{

        new:true,
    });
    res.json(blog);
}else{
    const blog = await Blog.findByIdAndUpdate(blogId , {
        $push:{dislikes:loginUserId},
        isDisliked:true,
    },{

        new:true,
    });
    res.json(blog);
}
});

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
        const findBlog =await Blog.findByIdAndUpdate( id , 
            {
               images: urls.map((file)=>{ return file}),
            },{
                new:true,
            }
           )
        res.json(findBlog)
    }catch(error){
        throw new Error(error);
    }
})

module.exports = { 
    creatBlog ,
    updateBlog,
    getBlog,
    getAllBlog ,
    deleteBlog ,
    likeBlog,
    dislikeBlog,
    uploadImages
};