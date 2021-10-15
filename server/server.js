const express = require('express')
const app = express()
const router = require('./routes')
const bodyParser = require('body-parser')
const cors = require('cors')

app.use(cors())
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.use(`/`,router)

app.listen(3001,()=>{
    console.log(`server port : 3001`)
})