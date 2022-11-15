const router = require("express").Router()
const mongoClientOption = require("./mongoClient") //mongodbClient
const mongoClient = require("mongodb").MongoClient

router.get("/list", async (req, res) => {

    const user = req.session.user.id
    const result = {
        "success": false,
        "message": "",
        "loggingList": []
    }

    const client = await mongoClient.connect(mongoClientOption, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

    try {
        const database = await client.db("stageus");
        const collection = await database.collection("logging");

        const data = collection.find({}) // 쿼리와 옵션 넣어줘

        const loggingData = await data.toArray();

        client.close() // 이거는 종료하는거 꼭 넣어줘야함
        
        result.loggingList.push(loggingData)

        result.success = true
        res.send(result)

    } catch(err) {
        result.message = err.message
        console.log(err.message)
        res.send(result)
    }

}) 

module.exports = router