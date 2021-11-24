const mongoose = require('mongoose')

const newsSchema = new mongoose.Schema({
    descraption:{
    type:String,
    required:true,
   
},

title:{
    type:String,
    required:true,

},
owner:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'Reporter'
}
},
{
timestamps:true
,

img:{
    type:Buffer
      }

})



const News = mongoose.model('News',newsSchema)
module.exports=News
