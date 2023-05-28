const mongoose = require('mongoose')
const validateMongoDbid = (id)=>{
    const isValide = mongoose.Types.ObjectId.isValid(id);
    if(!isValide) throw new Error('this id is not valide ou not fpund');
};
module.exports = validateMongoDbid ;