const express = require('express');
const {creatproduct, getaproduct , getAllproducts ,updateProduit,deleteProduit} = require('../controller/productCtrl')
const router = express.Router();
const {isAdmin,authMidlleware} = require('../middlewares/authMiddleware')

router.post('/' ,authMidlleware,isAdmin,creatproduct );
router.get('/:id' ,getaproduct );
router.put('/:id' ,authMidlleware,isAdmin,updateProduit );
router.delete("/:id" ,authMidlleware,isAdmin,deleteProduit);
router.get('/',getAllproducts );



module.exports = router ;