const express = require("express")
const path = require("path")
const router = express.Router()

// 게시글 리스트 api
router.get("/list", (req, res) => {         
    
})

// 해당 게시글 데이터 가져오는 api 댓글 가져오는 api도
router.get("/", (req, res) => {         
    
})

// 게시글 작성 api
router.post("/", (req, res) => {         
    
})

// 게시글 수정api
router.put("/", (req, res) => {         
    
})

// 게시글 삭제api
router.delete("/", (req, res) => {         
    
})

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