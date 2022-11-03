const express = require("express")
const path = require("path")
const router = express.Router()


// 데이터 가져오는 api


// 게시글 작성 페이지
router.get("/writePage", (req, res) => {         
    res.sendFile(path.join(__dirname, '../postWrite.html'))
})

// 게시글 작성 api
router.post("/write", (req, res) => {         
    
})

// 게시글 수정 삭제 api

// 댓글 작성수정삭제
router.post("/comment", (req, res) => {
    
})

// 댓글 수정
router.put("/comment", (req, res) => {
    
})

// 댓글 삭제
router.delete("/comment", (req, res) => {
    
})

// server.js에서 routing 모듈로 사용하게
module.exports = router