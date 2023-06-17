const express = require('express');
const { authMidlleware, isAdmin } = require('../middlewares/authMiddleware');
const { uploadPhoto, productImgResize } = require('../middlewares/uploadimg');
const {uploadImages} = require('../controller/blogCtrl')
const { creatBlog ,
    updateBlog,
    getBlog,
    getAllBlog ,
    deleteBlog,
    likeBlog,
    dislikeBlog
     } = require('../controller/blogCtrl');
const router = express.Router();


router.post('/',authMidlleware , isAdmin , creatBlog );
router.put('/upload/:id', authMidlleware, isAdmin, uploadPhoto.array('images', 10), productImgResize, uploadImages);
router.put('/likes',authMidlleware , likeBlog)
router.put('/dislikes',authMidlleware  , dislikeBlog)
router.put('/:id',authMidlleware , isAdmin , updateBlog )
router.get('/:id' , getBlog);
router.get('/',getAllBlog);
router.delete('/:id',authMidlleware , deleteBlog)



module.exports = router