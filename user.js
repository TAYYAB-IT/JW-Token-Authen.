const mongoose=require('mongoose');
const user=new mongoose.Schema({
    name:String,
    email:{type:String,unique:true,required:true},
    role:String
})
module.exports=mongoose.model('users',user)