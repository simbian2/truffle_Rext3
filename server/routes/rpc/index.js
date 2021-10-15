const express = require('express')
const router = express.Router()
const controller = require('./rpc.controller')

router.post('/set',controller.set)
router.post('/setTx',controller.setTx)

module.exports = router