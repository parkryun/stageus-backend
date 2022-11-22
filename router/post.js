const router = require("express").Router()
const clientOption = require("../config/clientConfig/client")
const { Client } = require("pg")  
const requestIp = require("request-ip")
const upload = require('../module/multer')
const logging = require("../config/loggingConfig") // logging config


// 게시글 리스트 api
router.get("/list", async (req, res) => {  

    const result = {
        "success": false,
        "message": "",
        "postList": []
    }
    
    const user = req.session.user.id
    if (user == undefined) { // 세션 예외처리
        result.message = "세션없음"   
        res.send(result)
    }

    const request = {}

    const client = new Client(clientOption)

    try {
        await client.connect() // await 붙여주는
        
        const sql = 'SELECT * FROM backend.post ORDER BY postdate DESC;'
        
        const data = await client.query(sql)
        const row = data.rows

        if (row.length > 0) {
            result.postList.push(row)

            //=============================MongoDB
            logging(requestIp.getClientIp(req), user, "post/list", "get", request, result)

        } else {
            result.message = '게시글이 존재하지 않습니다.'
        }
        res.send(result)
    } catch(err) { // 아 어차피 캐로 다 들어가니까 그냥 쭉 쓰는거네 근데 에러부분 뜨는 방식을 잘 모르겠네
        result.message = err.message
        console.log(err.message)
        res.send(result)
    }
})

// 해당 게시글 데이터 가져오는 api 댓글 가져오는 api도
router.post("/", async (req, res) => {    
    
    const result = {
        "success": false,
        "message": "",
        "post": [],
        "commentList": []
    }
    const user = req.session.user.id
    if (user == undefined) { // 세션 예외처리
        result.message = "세션없음"   
        res.send(result)
    }

    const request = {
        "postNum": ""
    }
    
    const client = new Client(clientOption)
    const postNum = req.body.postNum_value
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
router.post("/write", upload.single('image'), async (req, res) => {        
    
    // image location이랑 originalname 을 db에 저장하고 나중에 불러올 때 이거 가져와야지
    const result = {
        "success": false,
        "message": "",
    }
    const user = req.session.user.id
    if (user == undefined) { // 세션 예외처리
        result.message = "세션없음"   
        res.send(result)
    }

    const request = {
        "title": '',
        "content": '',
        "id": ''
    }

    const client = new Client(clientOption)

    const postTitleValue = req.body.postTitleValue
    const postContentValue = req.body.postContentValue
    const postImgUrl = req.file.location
    const idValue = user

    request.title = postTitleValue
    request.content = postContentValue
    request.id = idValue

    if (postTitleValue == '' || postContentValue == '' || idValue == undefined) { // null값 예외처리
        result.message = "제목 또는 내용을 입력하세요"
        return res.send(result)
    }

    if (postTitleValue.length > 20 || postContentValue.length > 100) {   // 길이 체크
        result.message = "정보를 다시 입력해주세요"
        return res.send(result)
    } else {
        try {
            await client.connect()
            
            const sql = 'INSERT INTO backend.post (postTitle, postContent, userId, postImgUrl) VALUES ($1, $2, $3, $4);'
            const values = [postTitleValue, postContentValue, idValue, postImgUrl]
            
            await client.query(sql, values)

            result.success = true
            result.message = "작성 완료"

            //=============================MongoDB
            logging(requestIp.getClientIp(req), user, "post/write", "post", request, result)

            res.send(result)
        } catch(err) { 
            result.message = err.message
            res.send(result)
        }
    }
})

// 게시글 수정api 
router.put("/", async (req, res) => {

    const result = {
        "success": false,
        "message": "",
    }
    const request = {
        "postNum": "",
        "content": ""
    }

    const user = req.session.user.id
    if (user == undefined) { // 세션 예외처리
        result.message = "세션없음"   
        res.send(result)
    }

    const client = new Client(clientOption)

    const postNum = req.body.postNum_value
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
router.delete("/", async (req, res) => {    

    const result = {
        "success": false,
        "message": "",
    }
    const request = {
        "postNum": "",
    }
    const user = req.session.user.id
    if (user == undefined) { // 세션 예외처리
        result.message = "세션없음"   
        res.send(result)
    }

    const client = new Client(clientOption)
    const postNum = req.body.postNum_value
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