const express =require('express')
const app= express()
const port = 3000
const reporterRouter = require('./routers/reporter') 
const newsRouter = require('./routers/news') 
const News= require('./modles/News')
require('./db/mongoose')

app.use(express.json())
app.use(reporterRouter)
app.use(newsRouter)

app.listen(port,()=>{
console.log('server is running')
})