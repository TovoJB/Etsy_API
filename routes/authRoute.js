const express = require('express');
const { createUser ,loginUserCtrl , getallUser ,getaUser , delateaUser , udateauser } = require('../controller/userCtrl');
const authMidlleware  = require("../middlewares/authMiddleware")
const router = express.Router();
router.post("/register" , createUser);
router.post("/login" , loginUserCtrl);
router.get("/all-user" ,getallUser);
router.get("/:id" , authMidlleware ,getaUser);
router.delete("/:id" ,delateaUser);
router.put("/:id" ,udateauser);

module.exports = router