const express = require('express');
const { authMidlleware, isAdmin } = require('../middlewares/authMiddleware');
const { createCategory ,updateCategory,daleteCategory , getAllCategory,getCategory} = require('../controller/blogcatCtrl');
const router = express.Router();

router.post("/",authMidlleware,isAdmin,createCategory) ;
router.put("/:id",authMidlleware,isAdmin,updateCategory);
router.delete("/:id",authMidlleware,isAdmin,daleteCategory);
router.get("/",getAllCategory);
router.get("/:id",getCategory);


module.exports = router