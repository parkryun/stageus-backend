const express = require("express")
const path = require("path")
const router = express.Router()


// 아이디찾기 페이지
router.get("/findID", (req, res) => {
    res.sendFile(path.join(__dirname, "../findID.html"))
})

// 비밀번호 찾기 페이지
router.get("/findPW", (req, res) => {
    res.sendFile(path.join(__dirname, "../findPW.html"))
})

router.post("/checkFindID", (req, res) => {
    
})

router.post("/checkFindPW", (req, res) => {
    
})

module.exports = router