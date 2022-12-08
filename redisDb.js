const mongoClientOption = require("../config/clientConfig/mongoClient") //mongodbClient
const mongoClient = require("mongodb").mongoClient
const redisClient = require("redis").createClient()

let year = new Date().getFullYear()
let month = new Date().getMonth() + 1
let date = new Date().getDate()

let today = year + '/' + month + '/' + date

const redisUpload = async () => {

    const client = await mongoClient.connect(mongoClientOption, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    try {
        await redisClient.connect()

        const visitData = await redisClient.sMembers("visit")   // 방문자
        const searchData = await redisClient.zRange("searchList", 0, -1) // 검색기록

        await redisClient.disconnect()

        await database.db("stageus").collection("redisVisit").insert({date: today, data: visitData})
        await database.db("stageus").collection("redisSearch").insert({date: today, data: searchData})

        database.close()

    } catch (err) {
        result.message = err.message
        res.send(result)
    }
}

module.exports = redisUpload