const express = require('express');
const {creatproduct, getaproduct , getAllproducts ,updateProduit,deleteProduit,addToWishlist,rating,uploadImages} = require('../controller/productCtrl')
const router = express.Router();
const {isAdmin,authMidlleware} = require('../middlewares/authMiddleware');
const { uploadPhoto, blogImgResize } = require('../middlewares/uploadimg');

router.post('/' ,authMidlleware,isAdmin,creatproduct );
router.put('/upload/:id', authMidlleware, isAdmin, uploadPhoto.array('images', 2), blogImgResize, uploadImages);
router.get('/:id' ,getaproduct );
router.put('/wishlist',authMidlleware,addToWishlist)
router.put('/rating',authMidlleware,rating)
router.put('/:id' ,authMidlleware,isAdmin,updateProduit );
router.delete("/:id" ,authMidlleware,isAdmin,deleteProduit);
router.get('/',getAllproducts );



module.exports = router ;