const jwt = require('jsonwebtoken')
const Reporter = require('../modles/Reporter')


const auth = async(req,res,next)=>{
try{
    const token =req.header('Authorization').replace('Bearer ','')
     
    const decode= jwt.verify(token,'node.course')
       console.log(decode)

     const reporter =await Reporter.findOne({_id:decode._id,'tokens.token':token})
     console.log(reporter)

     if(!reporter){
         throw new Error()
     }
       req.reporter=reporter
       req.token=token
    next()
}  
catch(e){
res.status(401).send({error:'please authenticate'})

}
}
module.exports=auth