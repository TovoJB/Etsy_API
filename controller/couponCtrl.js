const Coupon = require("../models/couponModel");
const  asyncHandler = require("express-async-handler");
const validateMongoDbid = require("../utils/vlidateMongobdId")

const createCoupon = asyncHandler( async(req , res)=>{
    try{
        const newCoupon = await Coupon.create(req.body);
        res.json(newCoupon)
    }catch(error){
        throw new Error(error)
    }
})

const getAllCoupon = asyncHandler( async(req , res)=>{
    try{
        const AllCoupons = await Coupon.find();
        res.json(AllCoupons)
    }catch(error){
        throw new Error(error)
    }
})

const updateCoupon = asyncHandler( async(req , res)=>{
    const {id} = await req.params ;
    try{
        const updatecoupon = await Coupon.findByIdAndUpdate(id ,
         req.body,   
        {
            new:true,
        });
        res.json(updatecoupon)
    }catch(error){
        throw new Error(error)
    }
})

const deleteCoupon = asyncHandler( async(req , res)=>{
    const {id} = await req.params ;
    try{
        const updatecoupon = await Coupon.findByIdAndDelete(id ,
       );
        res.json(updatecoupon)
    }catch(error){
        throw new Error(error)
    }
})

module.exports = {createCoupon , getAllCoupon ,  updateCoupon , deleteCoupon} ;