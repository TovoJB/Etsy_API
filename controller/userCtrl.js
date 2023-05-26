const User = require("../models/userModel")
const asyncHandler = require("express-async-handler")
const generateTkon = require("../config/jwtToken")

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

// get all user

const getallUser = asyncHandler(async(req , res )=>{
   try{
    const getUser = await  User.find()
    res.json(getUser)
   }catch(erro){
    throw new Error(erro)
   }
});

// get a single user 
const getaUser = asyncHandler( async (req , res )=>{
    const id = req.params.id
   try{
    const getauser = await User.findById(id)
    res.json(getauser)
   }catch(error){
    throw new Error(error)
   }
})
//update  a user
const udateauser = asyncHandler( async (req , res )=>{
    const id = req.params.id
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




//deleate a user
const delateaUser = asyncHandler( async (req , res )=>{
    const id = req.params.id
   try{
    const delategetauser = await User.findByIdAndDelete(id)
    res.json(delategetauser)
   }catch(error){
    throw new Error(error)
   }
})


module.exports = {
     createUser ,
     loginUserCtrl ,
     getallUser , 
     getaUser , 
     delateaUser , 
     udateauser
    } ; 