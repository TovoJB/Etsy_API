const prodcategory = require('../models/prodcategoryModel');
const asyncHandler = require("express-async-handler");
const validateMongoDbid = require("../utils/vlidateMongobdId");

const createCategory = asyncHandler(async(req , res)=>{
    
    try{
        const newcategory = await prodcategory.create(req.body);
        res.json(newcategory,);
       }catch (error){
           throw new Error(error)
       }
})


const updateCategory = asyncHandler(async(req , res)=>{
    const {id} = req.params
    validateMongoDbid(id)
    try{
        const updatecategory = await prodcategory.findByIdAndUpdate(id , req.body ,{
            new:true,
        });
        res.json(updatecategory,);
       }catch (error){
           throw new Error(error)
        }
})      

const daleteCategory = asyncHandler(async(req , res)=>{
    const {id} = req.params
    validateMongoDbid(id)
    try{
        const daletecategory = await prodcategory.findByIdAndDelete(id)
        res.json({
            message :"suprimer",
            daletecategory
        });
       }catch (error){
           throw new Error(error)
        }
})  

const getAllCategory = asyncHandler(async(req , res)=>{
    try{
        const Allcategory = await prodcategory.find()
        res.json(Allcategory);
       }catch (error){
           throw new Error(error)
        }
})  

const getCategory = asyncHandler(async(req , res)=>{
    const {id} = req.params ;
    validateMongoDbid(id)
    try{
        const getcategory = await prodcategory.findById(id)
        res.json(getcategory);
       }catch (error){
           throw new Error(error)
        }
})  


module.exports ={createCategory , updateCategory , daleteCategory ,getAllCategory,getCategory}