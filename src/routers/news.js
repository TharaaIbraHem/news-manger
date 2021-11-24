const express = require('express')
const router = new express.Router()
const  News = require('../modles/News')
const auth = require('../middelware/auth')




router.post('/news',auth,async(req,res)=>{
    try{
    const news= new News({...req.body,owner:req.reporter._id})
      await news.save()
        res.status(200).send(news)
    }
    catch(e){
           res.status(400).send(e)
    }
})





 
router.get('/news/:id',auth,async(req,res)=>{
    try{
    const _id =req.params.id
      const news= await News.findOne({_id,owner:req.user._id})
        if(!news){
            return res .status(404).send('unable to find id')
        }
        res.status(200).send(news)    
    }catch(e){
        res.status(500).send(e)
    }
})


router.patch('/news/:id',auth,async(req,res)=>{
        try{
            const updates=Object.keys.send(req.body)
           
        const _id = req.params.id
        const news = await News.findOne({_id,owner:req.reporter._id})
            

        console.log(updates)
        if(!news){
            return res.status(404).send('No task is found')
        }
        updates.forEach((el)=>news[el]=req.body[el])
        await task.save()
        res.status(200).send(news)
    }
    catch(e){
        res.status(400).send(e)
    }
    })


 
 router.delete('/news/:id',auth,async(req,res)=>{
    try{
    const _id=req.params.id
    const news=await News.findOneAndDelete({_id,owner:req.reporter._id})
if(!news){
    return res.status(404).send('unable to find id')
}
      res.status(200).send(news)
    }catch(e){
        res.status(500).send(e)
    }
})


router.get('/news/:id',auth,async(req,res)=>{
    try{
    const _id =req.params.id
      const news= await News.findOne({_id,owner:req.reporter._id})
        if(!news){
            return res .status(404).send('unable to find id')
        }
        await news.populate('owner')
        res.status(200).send(news.owner)    
    }
    catch(e){
        res.status(500).send(e)
    }
})

/////////////////////////////////////
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
router.post('/news/img',uploads.single('img'),async(req,res)=>{
    try{
        req.news.img= req.file.buffer
        await req.news.save()
        res.send()
    }
    catch(e){
        res.status(500).send(e)
    }
    })










module.exports = router