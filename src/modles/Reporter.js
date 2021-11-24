const mongoose = require('mongoose')
const validator= require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const reporterSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error()
            }
        }
    },
    age:{
        type:Number,
        default:20,
        validate(value){
            if(value<0){
                throw new Error('age must be positive')
            }
        }
    
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minLength:6
    },
    tokens:[
        {
          token:  {
        type:String,
        required:true
          }
    }
],

    avatar:{
    type:Buffer
      },
      phone:{
          type:Number,
          minLength:11,
          validate(value){
          validator.isMobilephone(value,'ar-EG')}
      }
      
    
    
        })



   reporterSchema.virtual('tasks',{
       ref:'Task',
       localField:'_id',
       foreignField:'owner'

    
    
    })



////////////////////////////////////////////////////////
reporterSchema.pre('save',async function(next){
        const reporter=this
console.log(reporter)
           if(reporter.isModified('password')){
            reporter.password =await bcrypt .hash(reporter.password,8)
           }
        next()
    })
/////////////////////////////////
reporterSchema.statics.findByCredentials= async(email,password)=>{
    const reporter = await Reporter.findOne({email:email})
    if(!reporter){
        throw new Error('please sign up')
    }
    const isMatch = await bcrypt.compare(password,reporter.password)
    if(!isMatch){
        throw new Error('unable')
    }
    return reporter
}
//////////////////////////////////
reporterSchema.methods.generatToken= async function(){
    const reporter =this
    const token = jwt.sign({_id:reporter._id.toString()},'node.course')
    reporter.tokens=reporter.tokens.concat({token})
      await reporter.save(token)
    return token
}

/////////////////////////////
reporterSchema.methods.toJSON= function(){
    const reporter=this

const reporterObject= reporter.toObject()
delete reporterObject.password
delete reporterObject.tokens

return reporterObject


}






const Reporter = mongoose.model('Reporter',userSchema)

module.exports= Reporter
