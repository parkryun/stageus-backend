const express = require("express")
const path = require("path")
const router = express.Router()

// 로그인페이지 가져오기
router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../login.html"))
})

// 아이디 비밀번호 일치여부 확인 api  넣어야하니까 Post
router.post("/checkLogin", (req, res) => {
    
})


// 회원정보 세션

// server.js에서 routing 모듈로 사용하게
module.exports = router