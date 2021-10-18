import React, { Component, useState, useEffect, useReducer } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";
import axios from 'axios'

import "./App.css";

const reducer = (state,action) => {
  switch(action.type){
    case "INIT":
      let {web3, Instance, account} = action
      return {
        ...state,
        web3,
        Instance,
        account
      }
  }
}

const INIT_ACTIONS = (web3,Instance,account) => {
  return {
    type:'INIT',
    web3,
    Instance,
    account
  }
}

const App = () => {
  const initialstate = {
    web3:null,
    Instance:null,
    account:null,
  }
  const [value, setValue] = useState(0)
  const [storage,setStorage] = useState(0)
  const [loadding,setLoadding] = useState(false)
  const [state,dispatch] = useReducer(reducer,initialstate)

  const handleResult = async (log,web3) => {
    const params = [
      {type:'string',name:'message'},
      {type:'uint256',name:'newVal'}
    ]
    const returnValues = web3.eth.abi.decodeLog(params,log.data)
    console.log(returnValues)

    //simplestorage.sol에 저장된 내용을 가지고 온 것
    //msg.sender는 그냥 서버, account는 데몬 서버
      setStorage(returnValues.newVal)
      setLoadding(prev => !prev)

  }
  const send = async () => {
    const {account,Instance} = state
    if(value > 0){
      setLoadding(prev => !prev)
      await Instance.set(value,{from:account})
    }
  }

  const sendAPI = async () => {
    const {web3,account} = state
    if(value > 0){
      setLoadding(prev => !prev)
      let result = await axios.post('http://localhost:3001/rpc/set',{from:account,val:value})
      // && result.data.success == true
      if(result.data !== undefined && result.data.rawTx !== undefined) {
        await web3.eth.sendTransaction(result.data.rawTx)
      }
    }
  }

  const sendTx = async () => {
    const {account} = state
    if(value > 0){
      const result = await axios.post('http://localhost:3001/rpc/setTx',{from:account,val:value})
      console.log(result)
      setLoadding(prev => !prev)
    }
  }

  const handleChange = (e) => {
    const val = e.target.value
    setValue(val)
  }

  const init = async () => {
    const contract = require('@truffle/contract')
    const web3 = await getWeb3()
    const [account] = await web3.eth.getAccounts()
    const networkId = await web3.eth.net.getId() // network id 값 가져 올 수 있습니다.
    let simpleStorage = contract(SimpleStorageContract)
    simpleStorage.setProvider(web3.currentProvider)

    const Instance = await simpleStorage.deployed()
    
    dispatch(INIT_ACTIONS(web3,Instance,account))

    web3.eth.subscribe("logs",{address:Instance.address})
    .on('data', log => {
      handleResult(log,web3)
    })
    .on('error', err => console.log(err))
  }

  useEffect(()=>{
    init()
  },[])
  return (
    <div>
      <input type = "text" value = {value} onChange={handleChange} />
      <div>
        <button onClick={send}>일반 서명</button>
        <button onClick={sendAPI}>DB 거치고 서명</button>
        <button onClick={sendTx}>DB 서명</button>
      </div>
      <div>
        {loadding ? 'loadding' : storage}
      </div>
    </div>
  )
}

export default App;
