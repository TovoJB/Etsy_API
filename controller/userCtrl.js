const User = require("../models/userModel")
const asyncHandler = require("express-async-handler")
const generateTkon = require("../config/jwtToken")
const validateMongoDbid = require("../utils/vlidateMongobdId")
const generateRefreshTkone = require("../config/refreshtoken")
const jwt = require("jsonwebtoken")
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
    } ; 