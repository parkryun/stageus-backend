const express = require("express")
const path = require("path")
const router = express.Router()

// 회원가입 페이지
router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../join.html"))
})

// 회원가입 api
router.post("/signUp", (req, res) => {
    
})

// 회원 정보 insert

// server.js에서 routing 모듈로 사용하게
module.exports = router
