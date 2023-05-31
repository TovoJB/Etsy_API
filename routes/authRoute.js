const express = require('express');
const { createUser ,
    loginUserCtrl ,
    getallUser ,
    getaUser ,
    delateaUser ,
    updateauser ,
    blockUser ,
    unblockUser,
    handleRefreshToken ,
    logout,
    updatePassword,
    
} = require('../controller/userCtrl');
const {authMidlleware , isAdmin}  = require("../middlewares/authMiddleware")
const router = express.Router();
router.post("/register" , createUser);
router.put('/password',authMidlleware,updatePassword)

router.post("/login" , loginUserCtrl);
router.get("/all-user" ,getallUser);
router.get("/refresh" , handleRefreshToken);
router.get("/logout" , logout);

router.get("/:id" , authMidlleware , isAdmin ,getaUser);
router.delete("/:id" ,authMidlleware,isAdmin,delateaUser);
router.put("/edit_user" , authMidlleware ,updateauser);
router.put("/block_user/:id" , authMidlleware ,isAdmin,blockUser);
router.put("/unblock_user/:id" , authMidlleware ,isAdmin,unblockUser);

//router.get("/getuserByFirtname",trieUser)

module.exports = router