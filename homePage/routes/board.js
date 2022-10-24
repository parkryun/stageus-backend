const express = require("express")
const path = require("path")
const router = express.Router()


// 게시판 목록 가져오기 ( 게시판 페이지 )
router.get("/", (req, res) => {         
    res.sendFile(path.join(__dirname, '../board.html'))
})


// server.js에서 routing 모듈로 사용하게
module.exports = router