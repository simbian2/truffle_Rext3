const Web3 = require('web3')
const web3 = new Web3('http://localhost:7545')
const {abi} = require("../../../client/src/contracts/SimpleStorage.json")
const {address} = require('../../../client/src/contracts/SimpleStorage.json').networks["5777"]
const ethTx = require('ethereumjs-tx').Transaction

const set = async (req,res) => {
    const {from,val} = req.body
    console.log('Hello set')
    const instance = await new web3.eth.Contract(abi,address)
    const data = await instance.methods.set(val).encodeABI()
    console.log(data)
    let txObject = {
        from,
        to:address,
        data,
        gasLimit:web3.utils.toHex(300000),
        gasPrice:web3.utils.toHex(web3.utils.toWei('20','gwei')),
    }
    res.json({
        succees:true,
        rawTx:txObject
    })
}

const setTx = async (req,res) => {
    const {from,val} = req.body
    const privateKey = Buffer.from('14434652b931af99abbbbfdf0b33d0d0088509b0f6a4553f00f33f81f8064368','hex')
    console.log('Hello set')
    const instance = await new web3.eth.Contract(abi,address)
    const data = await instance.methods.set(val).encodeABI()
    const txCount = await web3.eth.getTransactionCount(from)
    console.log(data)
    let txObject = {
        nonce:web3.utils.toHex(txCount),
        from,
        to:address,
        data,
        gasLimit:web3.utils.toHex(300000),
        gasPrice:web3.utils.toHex(web3.utils.toWei('20','gwei'))
    }
    const tx = new ethTx(txObject)
    //개인키와 공개키 일치 시키기!!
    tx.sign(privateKey)
    const serializedTx = tx.serialize()
    const txhash = await web3.eth.sendSignedTransaction(`0x`+serializedTx.toString('hex'))

    res.json({
        succees:true,
        txhash,
    })
}

module.exports = {
    set,
    setTx
}