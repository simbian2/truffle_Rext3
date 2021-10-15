const express = require('express')
const router = express.Router()
const rpc = require('./rpc')

router.use('/rpc',rpc)

module.exports = router