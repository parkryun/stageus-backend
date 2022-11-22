const router = require("express").Router()
const mongoClientOption = require("../config/clientConfig/mongoClient") //mongodbClient
const mongoClient = require("mongodb").MongoClient

router.get("/list", async (req, res) => {

    const result = {
        "success": false,
        "message": "",
        "loggingList": []
    }
    if (req.session.user == undefined) { // 세션 예외처리
        result.message = "세션없음"   
        res.send(result)
    }
    const user = req.session.user.id

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

router.post("/list-filter", async (req, res) => {

    const result = {
        "success": false,
        "message": "",
        "loggingList": []
    }
    
    if (req.session.user == undefined) { // 세션 예외처리 없으면 여기서 막히게
        result.message = "세션없음"   
        res.send(result)
    }
    const user = req.session.user.id

    const filterOptionValue = req.body.filter_option_value
    const filterContentValue = req.body.filter_content_value
    const filterReverseValue = req.body.filter_reverse_value
    let sql = {}
    const sortReverse ={
        "api_time": 1
    }
    if (filterReverseValue) {     // 역순
        sortReverse.api_time = -1
    }

    if (filterOptionValue == '' || filterContentValue == '') { // null값 예외처리
        result.message = "입력해주세요"
        return res.send(result)
    }

    if (filterOptionValue == "user_id") {   // 필터값 입력
        sql.user_id = filterContentValue
    } else {
        sql.api = filterContentValue
    }

    const client = await mongoClient.connect(mongoClientOption, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

    try {
        const database = await client.db("stageus")
        const collection = await database.collection("logging")

        const data = collection.find(sql).sort(sortReverse)

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

router.post("/list-date-filter", async (req, res) => {

    const result = {
        "success": false,
        "message": "",
        "loggingList": []
    }

    const user = req.session.user.id
    if (user == undefined) { // 세션 예외처리
        result.message = "세션없음"   
        res.send(result)
    }

    const startDateValue = req.body.start_date_value
    const endDateValue = req.body.end_date_value
    const filterReverseValue = req.body.filter_reverse_value

    const sortReverse ={
        "api_time": 1
    }
    if (filterReverseValue) {     // 역순
        sortReverse.api_time = -1
    }

    if (startDateValue == '' || endDateValue == '') { // null값 예외처리
        result.message = "선택해주세요"
        return res.send(result)
    }

    let sql = {
        '$gte': new Date(startDateValue),
        '$lte': new Date(endDateValue)
    }

    const client = await mongoClient.connect(mongoClientOption, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

    try {
        const database = await client.db("stageus");
        const collection = await database.collection("logging");

        const data = collection.find({"api_time": sql}).sort(sortReverse) // 쿼리와 옵션 넣어줘

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