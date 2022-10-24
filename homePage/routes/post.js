const express = require("express")
const path = require("path")
const router = express.Router()


// 게시글 보는 페이지 (여기에 comment get까지 있어야겠는데 )
router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../post.html"))
})

// 게시글 작성 페이지
router.get("/writePage", (req, res) => {         
    res.sendFile(path.join(__dirname, '../postWrite.html'))
})

// 게시글 작성 api
router.post("/write", (req, res) => {         
    
})

// 댓글 작성수정삭제
router.post("/writeComment", (req, res) => {
    
})

// 댓글 수정
router.put("/updateComment", (req, res) => {
    
})

// 댓글 삭제
router.delete("/removeComment", (req, res) => {
    
})

// server.js에서 routing 모듈로 사용하게
module.exports = router