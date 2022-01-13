const express = require('express')
const app = express()
const mongoose = require('mongoose')
const monogo=require('./DB_connection')
const users=require('./user.js')
monogo('mongodb+srv://tybtest90:testing1122@cluster0.hqfbo.mongodb.net/test')
.then(()=>{
const jwt=require('jsonwebtoken')
const secret_key="pak"
app.use(express.json())
app.post('/signup',(req, res)=>{
    const user=new users({name:req.body.name,role:req.body.role,email:req.body.email})
    user.save().then(data=>{
        console.log(data)
    })
    res.send("Your Account is Registered")
    res.redirect('/signin')
})
app.post('/signin',async(req,res)=>{
const data= await users.findOne({email:req.body.email})
if(data){
    const token =await jwt.sign({data},secret_key,{expiresIn:'50000s'}) //Genrate Token
    res.json({Status:"Logged in",Token:token})
}
else{
    res.send("Wrong Email")
}
})

app.get('/users',varify_token,(req,res)=>{
    users.find({}).then(data=>{
        res.json(data)
    })
    .catch(err=>{
           res.send(err)
    })
})
//varify token
 function  varify_token(req,res,next){
    const bearer_token=req.headers['authorization'] //Extract from request headers
    if(bearer_token){
    const token=bearer_token.split(" ")[1]
    req.token=token
     jwt.verify(req.token,secret_key,(err)=>{ //Varify the token
         if(!err){
          let data= jwt.decode(req.token)
          console.log(data.data.role)
        next()
         }
        else{
         res.send(err)
        }
     })
}
else{
res.send("Signin Again. Token Not found!")
}
}
})
app.listen(3000,()=>{
    console.log("Server is Active.")
})