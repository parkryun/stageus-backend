const router = require("express").Router()
const clientOption = require("../config/clientConfig/client")
const { Client } = require("pg")  
const requestIp = require("request-ip")
const upload = require('../module/multer')
const logging = require("../config/loggingConfig") // logging config
const sessionCheck = require("../module/sessionCheck") // session check module

const redisClient = require("redis").createClient()

const elastic = require("elasticsearch")


let todayEnd = new Date(new Date().setHours(23, 59, 59, 999))

// 게시글 리스트 api
router.get("/list", sessionCheck, async (req, res) => {  

    const result = {
        "success": false,
        "message": "",
        "postList": [],
        "searchList": []
    }
    const request = {}
    const user = req.session.user.id
  
    const client = new Client(clientOption)

    try {
        await client.connect() // await 붙여주는
        
        const sql = 'SELECT * FROM backend.post ORDER BY postdate DESC;'
        
        const data = await client.query(sql)
        const row = data.rows

        if (row.length > 0) {
            result.postList.push(row)
            
            //============get search list 
            await redisClient.connect()
            
            const searchList = await redisClient.zRange(`searchList${req.session.user.id}`, 0, 4) 

            result.searchList.push(searchList)
            await redisClient.disconnect()

            //=============================MongoDB
            logging(requestIp.getClientIp(req), user, "post/list", "get", request, result)

        } else {
            result.message = '게시글이 존재하지 않습니다.'
        }
        res.send(result)
    } catch(err) { // 아 어차피 캐로 다 들어가니까 그냥 쭉 쓰는거네 근데 에러부분 뜨는 방식을 잘 모르겠네
        result.message = err.message
        res.send(result)
    }
})

// 해당 게시글 데이터 가져오는 api 댓글 가져오는 api도
router.get("/:postNum", sessionCheck, async (req, res) => {    
    
    const result = {
        "success": false,
        "message": "",
        "post": [],
        "commentList": [],
    }
    const user = req.session.user.id
  
    const request = {
        "postNum": ""
    }
    
    const client = new Client(clientOption)
    
    const postNum = req.params.postNum
    
    request.postNum = postNum


    try {
        await client.connect() 
        
        const sql1 = 'SELECT * FROM backend.post WHERE postNum=$1;'
        // const sql2 = 'SELECT * FROM backend.comment WHERE postNum=$1;'
        const values = [postNum]

        const data1 = await client.query(sql1, values) // 게시글 가져오기
        // const data2 = await client.query(sql2, values) // 해당 게시글 댓글 가져오기
        const row1 = data1.rows
        // const row2 = data2.rows

        if (row1.length > 0) {
            result.post.push(row1)

            //=============================MongoDB
            logging(requestIp.getClientIp(req), user, "post/", "post", request, result)

        } else {
            result.message = '해당 게시글이 존재하지 않습니다.'
        }
        res.send(result)
    } catch(err) { 
        result.message = err.message
        console.log(result.message)
        res.send(result)
    }
})

// 게시글 작성 api
router.post("/", sessionCheck, upload.single('image'), async (req, res) => {        
    
    const result = {
        "success": false,
        "message": "",
    }
    const user = req.session.user.id
  
    // image location이랑 originalname 을 db에 저장하고 나중에 불러올 때 이거 가져와야지

    const request = {
        "title": '',
        "content": '',
        "id": ''
    }

    const client = new Client(clientOption)
    
    const postTitleValue = req.body.postTitleValue
    const postContentValue = req.body.postContentValue
    const idValue = user
    let postImgUrl = ""
    
    request.id = idValue

    if (req.file != undefined) { // 이미지 파일 없을 때 예외처리
    
        const imgType = req.file.mimetype.split('/')[1]
        postImgUrl = req.file.location

        if (req.file.size > 5 * 1024 * 1024) {  // 크기 예외처리
            result.message = "파일의 크기가 너무 큽니다."
            return res.send(result)
        } else if (imgType != "jpg" && imgType != "png" && imgType != "jpeg") { // 확장자 예외처리
            result.message = "파일 형식이 맞지 않습니다."
            return res.send(result)
        }
    }

    if (postTitleValue == '' || postContentValue == '' || idValue == undefined) { // null값 예외처리
        result.message = "제목 또는 내용을 입력하세요"
        return res.send(result)
    }

    if (postTitleValue.length > 20 || postContentValue.length > 100) {   // 길이 체크
        result.message = "정보를 다시 입력해주세요"
        return res.send(result)
    } else { 
        try {
            // postgreSQL INSERT
            await client.connect()
            
            const sql = 'INSERT INTO backend.post (postTitle, postContent, userId, postImgUrl) VALUES ($1, $2, $3, $4);'
            const values = [postTitleValue, postContentValue, idValue, postImgUrl]
            
            await client.query(sql, values)

            // elasticsearch INSERT
            const connect = new elastic.Client({
                "node": "http://localhost:9200/" // 노드 하나만 쓸꺼니까 노드 이름 적을 필요 없겠지?
            })    
            await connect.index({   // 데이터 넣어주는 함수 
                "index": "board",
                "body": {   // 여기부터가 document
                    "author": idValue,       // 이거 하나하나가 field
                    "title": postTitleValue,
                    "content": postContentValue
                }
            })

            //=============================MongoDB
            logging(requestIp.getClientIp(req), user, "post/write", "post", request, result)

            result.success = true
            result.message = "작성 완료"
            res.send(result)
        } catch(err) { 
            result.message = err.message
            res.send(result)
        }
    }
})

// 게시글 수정api 
router.put("/:postNum", sessionCheck, async (req, res) => {

    const result = {
        "success": false,
        "message": "",
    }
    const user = req.session.user.id
 
    const request = {
        "postNum": "",
        "content": ""
    }
 
    const client = new Client(clientOption)

    const postNum = req.params.postNum
    const postContentValue = req.body.post_content    
    request.postNum = postNum
    request.content = postContentValue

    if (postContentValue == '' || postNum == undefined) { // null값 예외처리
        result.message = "작성해주세요"
        return res.send(result)
    }
    
    if (postContentValue.length > 100) {   // 길이 체크
        result.message = "정보를 다시 입력해주세요"
        return res.send(result)
    } else {
        try {
            await client.connect()
            
            const sql = 'UPDATE backend.post SET postContent=$1; WHERE postNum=$2;' 
            const values = [postContentValue, postNum]
    
            await client.query(sql, values)
            
            result.success = true
            result.message = "수정 완료"

            //=============================MongoDB
            logging(requestIp.getClientIp(req), user, "post/", "put", request, result)

            res.send(result)
        } catch(err) { // 아 어차피 캐로 다 들어가니까 그냥 쭉 쓰는거네 근데 에러부분 뜨는 방식을 잘 모르겠네
            result.message = err.message
            res.send(result)
        }
    }
})

// 게시글 삭제api
router.delete("/:postNum", sessionCheck, async (req, res) => {    

    const result = {
        "success": false,
        "message": "",
    }
    const request = {
        "postNum": "",
    }
    const user = req.session.user.id
 
    const client = new Client(clientOption)
    const postNum = req.params.postNum
    request.postNum = postNum

    if (postNum == undefined) { // undefined값 예외처리
        result.message = "게시글이 존재하지 않습니다."
        return res.send(result)
    } else {
        try {
            await client.connect()
            
            const sql = 'DELETE FROM backend.post WHERE postNum=$1;' 
            const values = [postNum]
    
            await client.query(sql, values)

            result.success = true
            result.message = "삭제완료"

            //=============================MongoDB
            logging(requestIp.getClientIp(req), user, "post/", "delete", request, result)

            res.send(result)
        } catch(err) { // 아 어차피 캐로 다 들어가니까 그냥 쭉 쓰는거네 근데 에러부분 뜨는 방식을 잘 모르겠네
            result.message = err.message
            res.send(result)
        }
    }
})

router.post("/search", sessionCheck, async (req, res) => {

    const result = {
        "success": false,
        "message": "",
        "post": []
    }
    const searchContent = req.body.search_content

    const client = new Client(clientOption)

    try {
        await client.connect() 
        
        const sql = 'SELECT * FROM backend.post WHERE postTitle LIKE $1;'
 
        const values = [`%${searchContent}%`]

        const data = await client.query(sql, values) // 게시글 가져오기

        const row = data.rows

        if (row.length > 0) {
            result.post.push(row)
        } else {
            result.message = '해당 게시글이 존재하지 않습니다.'
        }
        // ======== 검색한 기록 redis에 저장
        await redisClient.connect()
        
        const scoreTime = parseInt(1670000000 - (parseInt(Date.now() / 1000)))
        
        // 왜 그냥 score랑 value 자체로 넣으면 안되냐 object 값을 넣어야해서 그래?
        await redisClient.zAdd(`searchList${req.session.user.id}`, {score: scoreTime, value: searchContent}) // 가장 앞쪽에 표시
        // await redisClient.expireAt(`${searchList}-${req.session.user.id}`, parseInt(todayEnd / 1000));  // 자정 만료

        await redisClient.disconnect()

        res.send(result)
    } catch(err) { 
        result.message = err.message
        console.log(result.message)
        res.send(result)
    }

})

router.get("/elastic/search", sessionCheck, async (req, res) => {

    const keyword = req.query.keyword

    const result = {
        "success": false,
        "message": null,
        "data": null
    }
    
    try {
        const connect = new elastic.Client({
            "node": "http://localhost:9200/" 
        })  
        
        const searchResult = await connect.search({
            "index": "board",
            "body": {
                "size": 5,  // 검색 결과 5개
                "query": {  // 이러이러한 조건으로 검색하겠다.
                    
                    // "tokenizer": "standard",    
                    // "filter": [ // 여기서 ngram해서 나눠주는거지
                    //     {
                    //         "type": "ngram",
                    //         "min_gram": 2,
                    //         "max_gram": 10
                    //     }
                    // ],
                    "bool": {
                        "should": [ // 스코어값 올려주는 형식으로 가장 알맞는거 골라야하니까
                            {"match": {"title": keyword}},
                            {"match": {"author": keyword}}
                        ]
                    }
                },
                "sort": {   // 스코어 기준 내림차순
                    "_score": "desc"
                }
            }
        })
        console.log(searchResult)
        result.success = true
        result.data = searchResult.hits.hits // 이걸 프론트로 보내주는거야 프론트에서 쓰는 값은 이거니까
        res.send(result)
    } catch (err) {
        result.message = err.message
        console.log(result.message)
        res.send(result)
    }
})

// 댓글 작성
router.post("/comment", async (req, res) => {

    const result = {
        "success": false,
        "message": "",
    }

    const client = new Client(clientOption)
    
    const commentContentValue = req.body.comment_content
    const idValue = req.body.id_value

    if (commentContentValue == '' || idValue == undefined) { // null값 예외처리
        result.message = "댓글을 입력하세요"
        return res.send(result)
    }

    if (commentContentValue.length > 30) {   // 길이 체크
        result.message = "정보를 다시 입력해주세요"
        return res.send(result)
    } else {
        try {
            await client.connect()
            
            const sql = 'INSERT INTO backend.comment (commentContent, userId) VALUES ($1, $2);' // ? 대신 $로 대체 
            const values = [commentContentValue, idValue]
    
            await client.query(sql, values)
    
            res.send(result)
        } catch(err) { 
            result.message = err
            res.send(result)
        }
    }
})

// 댓글 수정
router.put("/comment", async (req, res) => {

    const result = {
        "success": false,
        "message": "",
    }

    const client = new Client(clientOption)

    const commentNum = req.body.comment_num
    const commentContentValue = req.body.comment_content    

    if (commentContentValue == '' || commentNum == undefined) { // null값 예외처리
        result.message = "작성해주세요"
        return res.send(result)
    }
    if (commentContentValue.length > 30) {   // 길이 체크
        result.message = "정보를 다시 입력해주세요"
        return res.send(result)
    } else {
        try {
            await client.connect()
            
            const sql = 'UPDATE backend.comment SET commentContent=$1; WHERE commentNum=$2;' 
            const values = [commentContentValue, commentNum]
    
            await client.query(sql, values)
    
            res.send(result)
        } catch(err) { // 아 어차피 캐로 다 들어가니까 그냥 쭉 쓰는거네 근데 에러부분 뜨는 방식을 잘 모르겠네
            result.message = err
            res.send(result)
        }
    }
})

// 댓글 삭제
router.delete("/comment", async (req, res) => {

    const result = {
        "success": false,
        "message": "",
    }

    const client = new Client(clientOption)

    const commentNum = req.body.comment_num

    if (commentNum == undefined) { // undefined값 예외처리
        result.message = "댓글이 존재하지 않습니다."
        return res.send(result)
    } else {
        try {
            await client.connect()
            
            const sql = 'DELETE FROM backend.comment WHERE commentNum=$1;' 
            const values = commentNum
    
            await client.query(sql, values)
    
            res.send(result)
        } catch(err) { // 아 어차피 캐로 다 들어가니까 그냥 쭉 쓰는거네 근데 에러부분 뜨는 방식을 잘 모르겠네
            result.message = err
            res.send(result)
        }
    }
})

module.exports = router