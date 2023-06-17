const User = require("../models/userModel")
const asyncHandler = require("express-async-handler")
const generateTkon = require("../config/jwtToken")
const validateMongoDbid = require("../utils/vlidateMongobdId")
const generateRefreshTkone = require("../config/refreshtoken")
const jwt = require("jsonwebtoken")
const sendEmail = require("./emailCtrl")
const crypto = require('crypto')
//create new user
/* ---------------------------------------------------------- */
const createUser = asyncHandler(
    async (req , res)=>{
        const email = req.body.email ;
        const findUser = await User.findOne({email : email});
        if(!findUser){
            //creation ana user
            const newUser = await User.create(req.body)
            res.json(newUser)
        }else{
            // user existe deja
            throw new Error(" user deja exite ")
        }
    }
)
/* ---------------------------------------------------------- */

/* ---------------------------------------------------------- */
// login
const loginUserCtrl = asyncHandler(async(req , res )=>{
    const {email , password } =  req.body; 

    // check si le user existe
    // console.log(email , password);
    const findeUser = await  User.findOne( {email })
    if(findeUser && await findeUser.isPasswordMatched(password)){
        const refreshToken = await generateRefreshTkone(findeUser?._id);
        const updateuser = await User.findByIdAndUpdate(
            findeUser.id ,{
            refreshToken : refreshToken  
        },{
            new:true 
        } );
        res.cookie('refreshToken' , refreshToken,{
            httpOnly:true,
            maxAge:72 * 24*60*60*1000,
        })
        res.json({
            _id: findeUser?._id ,
            firstname: findeUser?.firstname ,
            lastname: findeUser?.lastname ,
            email: findeUser?.email ,
            mobile: findeUser?.mobile ,
            token: generateTkon(findeUser?._id)
        });
    }else{
        throw new Error('invalide email ou mot de passe')
    }
   
});
/* ---------------------------------------------------------- */

/* ---------------------------------------------------------- */
//handle refresh token

const handleRefreshToken = asyncHandler(async ( req , res)=>{
 const cookie = req.cookies ;
 console.log(cookie)
 if(!cookie?.refreshToken) throw new Error('No Refresh token in cookies')
 const refreshToken = cookie.refreshToken ;
 console.log(refreshToken) ;
 const user = await User.findOne({refreshToken});
 if(!user) throw new Error('No Refresh token present in db or no matched')
 jwt.verify(refreshToken , process.env.JWT_SECRET_KEY , (err , decoded) =>{
   if(err || decoded.id !== user.id) {
    throw new Error('there is something wrong with refresh token')
   }else{
    const accesstoken =generateTkon(user?.id);
    res.json(accesstoken);
   }
});
})
/* ---------------------------------------------------------- */

/* ---------------------------------------------------------- */
// logout functionality
const logout = asyncHandler(async ( req , res )=>{
const cookie = req.cookies ;
if(!cookie?.refreshToken) throw new Error('no refresh tokone in cookies');
const refreshToken = cookie.refreshToken ;
const user = await User.findOne({refreshToken});
if(!user){
    res.clearCookie("refreshToken",{
        httpOnly:true,
        secure:true,
    });
    return res.sendStatus(204);//forbidden
}
await User.findOneAndUpdate( {refreshToken} , {
    refreshToken:"",
});
res.clearCookie("refreshToken",{
    httpOnly:true ,
    secure:true,
});
res.sendStatus(204);//forbidden
});
/* ---------------------------------------------------------- */

/* ---------------------------------------------------------- */
// get all user

const getallUser = asyncHandler(async(req , res )=>{
   try{
    const getUser = await  User.find()
    res.json(getUser )
   }catch(erro){
    throw new Error(erro)
   }
});
/* ---------------------------------------------------------- */

/* ---------------------------------------------------------- */
// get a single user 
const getaUser = asyncHandler( async (req , res )=>{
    const id = req.params.id ;
    validateMongoDbid(id);
   try{
    const getauser = await User.findById(id);
    res.json(getauser);
   }catch(error){
    throw new Error(error);
   }
})
/* ---------------------------------------------------------- */

/* ---------------------------------------------------------- */
//update  a user
const updateauser = asyncHandler( async (req , res )=>{
    const id = req.user._id; 
    validateMongoDbid(id);
   try{
    const udateaUser = await User.findByIdAndUpdate(
        id , {
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname ,
        email: req?.body?.email ,
        mobile: req?.body?.mobile ,
    },
    {
        new:true ,
    }
    );
   res.json(udateaUser)
   }catch(error){
    throw new Error(error)
   }
})
/* ---------------------------------------------------------- */

/* ---------------------------------------------------------- */
//deleate a user
const delateaUser = asyncHandler( async (req , res )=>{
    const id = req.params.id ;
    validateMongoDbid(id) ;
   try{
    const delategetauser = await User.findByIdAndDelete(id)
    res.json(delategetauser)
   }catch(error){
    throw new Error(error)
   }

})

/* ---------------------------------------------------------- */
const blockUser = asyncHandler(async(req , res )=>{
    const {id} = req.params ;
    validateMongoDbid(id) ;
    try{
        const blockuser = await User.findByIdAndUpdate(
            id , {
                isBlock:true
            },{
                new:true
            }
        )
        res.json(blockuser)
    }catch(error){
        throw new Error (error);
    }
})
/* ---------------------------------------------------------- */

/* ---------------------------------------------------------- */
const unblockUser = asyncHandler(async(req , res )=>{
    const {id} = req.params ;
    validateMongoDbid(id) ;
    try{
        const unblockuser = await User.findByIdAndUpdate(
            id , {
                isBlock:false
            },{
                new:true
            }
        )
        res.json(unblockuser)
    }catch(error){
        throw new Error (error);
    }
})
/* ---------------------------------------------------------- */

const updatePassword = asyncHandler(async(req,res)=>{
    const {_id} = req.user;
    const {password}=req.body;
    validateMongoDbid(_id);
    const user = await User.findById(_id);
    if(password){
        user.password = password;
        const updatePassword = await user.save();
        res.json(updatePassword);
    }else{
        res.json(user);
    }
})

//FORGOT PASSWORD TKEN 
const forgetPasswordToken = asyncHandler (async ( req , res)=>{
    const {email}= req.body ;
    const user = await User.findOne({email});
    if(!user) throw new Error("user not fond with this email");
    try{
        const token = await user.createPasswordResetToken()
        await user.save();
        const resetURL = `Hi, please follow this link to reset your password. This link is valid for the next 10 minutes: <a href="http://localhost:5000/api/user/reset-password/${token}">link Here</a>`;
        const data ={
        to:email,
        text:"hey User",
        subject:"Forget password Link ",
        html: resetURL,
    }
    sendEmail(data);
    res.json(token)
    }catch(error){
        throw new Error(error);
    }
})

const resetPassword =  asyncHandler(async(req , res) => {
   const { password }= req.body; 
   const { token } = req.params;
   const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
   const user = await User.findOne({
    passwordResetToken : hashedToken ,
    passwordResetExpires : {$gt : Date.now()},
   });
   if(!user) throw new Error("Token Expired, please try again later");
   user.password = password ;
   user.passwordResetToken = undefined ;
   user.passwordResetExpires = undefined;
   await user.save();
   res.json(user);
})

module.exports = {
     createUser ,
     loginUserCtrl ,
     getallUser , 
     getaUser , 
     delateaUser , 
     updateauser,
     unblockUser,
     blockUser ,
     handleRefreshToken,
     logout,
     updatePassword,
    forgetPasswordToken,
    resetPassword
    } ; 