const User = require("../models/userModel")
const asyncHandler = require("express-async-handler")


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

const loginUserCtrl = asyncHandler(async(req , res )=>{
    const {email , password } =  req.body; 

    // check si le user existe
    // console.log(email , password);
    const findeUser = await  User.findOne( {email })
    if(findeUser && await findeUser.isPasswordMatched(password)){
        res.json(findeUser)
    }else{
        throw new Error('invalide email ou mot de passe')
    }
   
});




module.exports = { createUser ,loginUserCtrl  } ; 