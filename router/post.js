const router = require("express").Router()
const { Client } = require("pg") 

const result = {
    "success": false,
    "message": "",
    "post": []
}    

// PostgreSQL 기본 설정 ( DB 계정 설정)
const client = new Client({ // =위에 있는 Client를 받는데 
    user: "ubuntu",
    password: "1234",
    host: "localhost",
    database: "stageus",
    port: 5432
})

// 게시글 리스트 api
router.get("/list", async (req, res) => {  

    result.postList = []

    try {
        await client.connect() // await 붙여주는
        
        const sql = 'SELECT * FROM backend.post;'
        
        const data = await client.query(sql)
        const row = data.rows

        result.postList.push(row);
        res.send(result)

    } catch(err) { // 아 어차피 캐로 다 들어가니까 그냥 쭉 쓰는거네 근데 에러부분 뜨는 방식을 잘 모르겠네
        result.message = err
        res.send(result)
    }
})

// 해당 게시글 데이터 가져오는 api 댓글 가져오는 api도
router.get("/", (req, res) => {    

    const postNum = req.body.post_num
    result.post = []
    result.commentList = []

    try {
        await client.connect() 
        
        const sql1 = 'SELECT * FROM backend.post WHERE postNum=$1;'
        const sql2 = 'SELECT * FROM backend.comment WHERE postNum=$1;'
        const values = postNum

        const data1 = await client.query(sql1, values) // 게시글 가져오기
        const data2 = await client.query(sql2, values) // 해당 게시글 댓글 가져오기
        const row1 = data1.rows
        const row2 = data2.rows

        result.post.push(row1)
        result.commentList.push(row2)

        res.send(result)

    } catch(err) { 
        result.message = err
        res.send(result)
    }
})

// 게시글 작성 api
router.post("/", (req, res) => {         

    const postTitleValue = req.body.post_title
    const postContentValue = req.body.post_content
    const idValue = req.body.id_value


    try {
        await client.connect()
        
        const sql = 'INSERT INTO backend.post (postTitle, postContent, userId) * VALUES ($1, $2, $3);' // ? 대신 $로 대체 
        const values = [postTitleValue, postContentValue, idValue]

        await client.query(sql, values)

        res.send(result)

    } catch(err) { // 아 어차피 캐로 다 들어가니까 그냥 쭉 쓰는거네 근데 에러부분 뜨는 방식을 잘 모르겠네
        result.message = err
        res.send(result)
    }
})

// 게시글 수정api 
router.put("/", (req, res) => {

    const postNum = req.body.post_num
    const postContentValue = req.body.post_content    
    
    try {
        await client.connect()
        
        const sql = 'UPDATE backend.post SET postContent=$1; WHERE postNum=$2;' 
        const values = [postContentValue, postNum]

        await client.query(sql, values)

        res.send(result)

    } catch(err) { // 아 어차피 캐로 다 들어가니까 그냥 쭉 쓰는거네 근데 에러부분 뜨는 방식을 잘 모르겠네
        result.message = err
        res.send(result)
    }
    
})

// 게시글 삭제api
router.delete("/", (req, res) => {    
    
    const postNum = req.body.post_num

    try {
        await client.connect()
        
        const sql = 'DELETE FROM backend.post WHERE postNum=$1;' 
        const values = postNum

        await client.query(sql)

        res.send(result)

    } catch(err) { // 아 어차피 캐로 다 들어가니까 그냥 쭉 쓰는거네 근데 에러부분 뜨는 방식을 잘 모르겠네
        result.message = err
        res.send(result)
    }
    
})

// 댓글리스트 가져오기
router.get("/comment-list", (req, res) => {    

    result.commentList = []

    try {
        await client.connect() // await 붙여주는
        
        const sql = 'SELECT * FROM backend.comment;' // ? 대신 $로 대체 
        
        const data = await client.query(sql)
        const row = data.rows

        result.commentList.push(row);
        res.send(result)

    } catch(err) { 
        result.message = err
        res.send(result)
    }
})

// 댓글 작성
router.post("/comment", (req, res) => {
    
    const commentContentValue = req.body.comment_content
    const idValue = req.body.id_value

    try {
        await client.connect()
        
        const sql = 'INSERT INTO backend.comment (commentContent, userId) * VALUES ($1, $2);' // ? 대신 $로 대체 
        const values = [commentContentValue, idValue]

        await client.query(sql, values)

        res.send(result)

    } catch(err) { // 아 어차피 캐로 다 들어가니까 그냥 쭉 쓰는거네 근데 에러부분 뜨는 방식을 잘 모르겠네
        result.message = err
        res.send(result)
    }
})

// 댓글 수정
router.put("/comment", (req, res) => {

    const commentNum = req.body.comment_num
    const commentContentValue = req.body.comment_content    
    
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
})

// 댓글 삭제
router.delete("/comment", (req, res) => {

    const commentNum = req.body.comment_num

    try {
        await client.connect()
        
        const sql = 'DELETE FROM backend.comment WHERE commentNum=$1;' 
        const values = commentNum

        await client.query(sql)

        res.send(result)

    } catch(err) { // 아 어차피 캐로 다 들어가니까 그냥 쭉 쓰는거네 근데 에러부분 뜨는 방식을 잘 모르겠네
        result.message = err
        res.send(result)
    }
})

// server.js에서 routing 모듈로 사용하게
module.exports = router