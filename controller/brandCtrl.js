const brand = require('../models/brandModel');
const asyncHandler = require("express-async-handler");
const validateMongoDbid = require("../utils/vlidateMongobdId");

const createCategory = asyncHandler(async(req , res)=>{
    
    try{
        const newcategory = await brand.create(req.body);
        res.json(newcategory,);
       }catch (error){
           throw new Error(error)
       }
})


const updateCategory = asyncHandler(async(req , res)=>{
    const {id} = req.params
    validateMongoDbid(id)
    try{
        const updatecategory = await brand.findByIdAndUpdate(id , req.body ,{
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
        const daletecategory = await brand.findByIdAndDelete(id)
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
        const Allcategory = await brand.find()
        res.json(Allcategory);
       }catch (error){
           throw new Error(error)
        }
})  

const getCategory = asyncHandler(async(req , res)=>{
    const {id} = req.params ;
    validateMongoDbid(id)
    try{
        const getcategory = await brand.findById(id)
        res.json(getcategory);
       }catch (error){
           throw new Error(error)
        }
})  


module.exports ={createCategory , updateCategory , daleteCategory ,getAllCategory,getCategory}