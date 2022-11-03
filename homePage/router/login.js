const express = require("express")
const path = require("path")
const router = express.Router()



// 아이디 비밀번호 일치여부 확인 api  넣어야하니까 Post
router.post("/checkLogin", (req, res) => {
    // 여부확인 하고
    const userID = req.userID
    const userPW = req.userPW

    req.session.userID = userID
    req.session.userPW = userPW
    req.session.isLogined = true;
})

// 로그아웃
router.get("/logout", (req, res) => {
    req.session.destroy()
})


// 회원정보 세션

// server.js에서 routing 모듈로 사용하게
module.exports = router