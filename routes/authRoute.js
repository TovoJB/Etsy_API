const express = require('express');
const { createUser ,loginUserCtrl , getallUser ,getaUser , delateaUser , updateauser , blockUser , unblockUser,handleRefreshToken , logout} = require('../controller/userCtrl');
const {authMidlleware , isAdmin}  = require("../middlewares/authMiddleware")
const router = express.Router();
router.post("/register" , createUser);
router.post("/login" , loginUserCtrl);
router.get("/all-user" ,getallUser);
router.get("/refresh" , handleRefreshToken);
router.get("/logout" , logout);

router.get("/:id" , authMidlleware , isAdmin ,getaUser);
router.delete("/:id" ,delateaUser);
router.put("/edit_user" , authMidlleware ,updateauser);
router.put("/block_user/:id" , authMidlleware ,isAdmin,blockUser);
router.put("/unblock_user/:id" , authMidlleware ,isAdmin,unblockUser);


module.exports = router