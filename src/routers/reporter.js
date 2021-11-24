const express = require('express')
const router = new express.Router()
const Reporter = require('../modles/Reporter')
const auth = require('../middelware/auth')
const multer = require('multer')



router.post('/reporter',async(req,res)=>{
    // console.log(req.body)
    try{
    const reporter= new Reporter(req.body)
    const token = await reporter.generatToken()
    await reporter.save()
        res.status(200).send({reporter,token})
    }
    catch(e){
        res.status(400).send('error'+e)
    }
})
///////////////////////////////////
router.post('/reporter/login',async(req,res)=>{
  try{
    const reporter = await Reporter.findByCredentials(req.body.email,req.body.password)
    const token = await reporter.generatToken()
res.status(200).send({reporter,token})
  }
  catch(e){
    res.status(400).send('error'+e)
}
})
//////////////////////////////////////////
router.get('/profile',auth,async(req,res)=>{
    res.send(req.reporter)
})



////////////////////

router.get('/reporters',auth,async(req,res)=>{
    try{
  const reporters= await Reporter.find({})
        res.status(200).send(reporters)
    }
    catch(e){
        res.status(500).send(e)
    }
    

})

//get by id

router.get('/reporters/:id',auth,async(req,res)=>{
    try{
    const id = req.params.id
     const reporter= await Reporter.findById(id)
        if(!reporter){
            return res .status(404).send('unable to find id')
        }
        res.status(200).send(reporter)    
    } catch(e){
        res.status(500).send(e)
    }
    /////update


    router.patch('/reporter/:id',auth,async(req,res)=>{
        try{
        const updates = Object.keys(req.body) //["name","password","age"]
        console.log(updates)
        const allowedUpdates = ["name","password"]
        // ["name","password","age"]            ["name","password"]
        var isValid = updates.every((update)=> allowedUpdates.includes(update))
        if(!isValid){
            return res.status(400).send('Cannot update')
        }
        const _id = req.params.id
        const reporter = await Reporter.findById(_id)
        
        if(!reporter){
            return res.status(404).send('No user is found')
        }
        updates.forEach((update)=>reporter[update]=req.body[update])
        await reporter.save()
        res.status(200).send(reporter)
    }
    catch(e){
        res.status(400).send('error'+e)
    }
    })

/////////////////////delete
router.delete('/reporters/:id',async(req,res)=>{
    try{
    const _id=req.params.id
    const reporter=await Reporter.findByIdAndDelete(_id)
if(!reporter){
    return res.status(404).send('unable to find id')
}
res.status(200).send(reporter)
    }catch(e){
        res.status(500).send(e)
    }
})


router.delete('/logout',auth,async(req,res)=>{
    try{
        req.reporter.tokens=req.reporter.tokens.filter((el)=>{
            return el.token!==req.token
        })
        await req.reporter.save()
        res.send('logout success')
    }
    catch(e){
        res.status(500).send(e)
    }
})

router.delete('/logoutAll',auth,async(req,res)=>{
    try{
        req.reporter.tokens=[]
           
        await req.reporter.save()
        res.send('logout success')
    }
    catch(e){
        res.status(500).send(e)
    }
})

//////////////////////////////////////////
const uploads = multer({
    
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)){
            cb(new Error('you must upload image'))

        }
        cb(null,true)

    }

})
router.post('/profile/avatar',uploads.single('avatar'),async(req,res)=>{
    try{
        req.reporter.avatar= req.file.buffer
        await req.reporter.save()
        res.send()
    }
    catch(e){
        res.status(500).send(e)
    }
    })
    












})



module.exports = router