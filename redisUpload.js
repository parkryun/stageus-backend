const express = require("express")

const clientOption = require("./config/clientConfig/client")
const { Client } = require("pg") 
const redisClient = require("redis").createClient()

let now = new Date()
const delayHours = 1000 * 60 * 60 * (23 - (now.getHours() + 9))
const delayMinutes = 1000 * 60 * (60 - now.getMinutes())
 
const renewalUserCount = async () => {

    const client = new Client(clientOption)

    const updateSql = "UPDATE backend.user SET userCounter=$1"

    try {
        await redisClient.connect()

        const data = await redisClient.get("loginCounter") // 값 가져오고
        await redisClient.del("loginCounter") // 삭제

        await redisClient.disconnect()
        
        await client.connect()
        const updateUserCounter = [parseInt(data)] // 새로운 값 업데이트

        await client.query(updateSql, updateUserCounter)

    } catch (err) {
        console.log(err.message)
    }
}

console.log("redisUpload.js")

setTimeout(() => {  // 일정시간 후에 반복해야하니까 settimeout으로 시작하고 // 첫 시작도 자정에 시작하잖아
    setInterval(renewalUserCount, 1000 * 60 * 60 * 24)  // 일정 시간마다 반복해야하니까 setinterval
    }, delayHours + delayMinutes
)

// 아 이 js 는 pm2로 돌려둬야겠구낭