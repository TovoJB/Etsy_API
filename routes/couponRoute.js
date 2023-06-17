const express = require('express');
const { createCoupon, getAllCoupon, updateCoupon , deleteCoupon } = require('../controller/couponCtrl');
const { authMidlleware, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post("/",authMidlleware,isAdmin,createCoupon)
router.get("/",authMidlleware,isAdmin,getAllCoupon)
router.put("/:id",authMidlleware,isAdmin,updateCoupon)
router.delete("/:id",authMidlleware,isAdmin,deleteCoupon)

module.exports = router