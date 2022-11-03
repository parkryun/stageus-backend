const router = require("express").Router() 
const path = require("path")

// get //mainPage
router.get("/mainPage", (req, res) => {
    // res.sendFile(__dirname + "../mainPage.html")
    res.sendFile(path.join(__dirname, "../mainPage.html"))
})

// 로그인페이지 가져오기
router.get("/loginPage", (req, res) => {
    res.sendFile(path.join(__dirname, "../login.html"))
})

// 게시글 보는 페이지
router.get("/postPage", (req, res) => {
    res.sendFile(path.join(__dirname, "../post.html"))
})

// 게시판 목록 가져오기 ( 게시판 페이지 )
router.get("/boardPage", (req, res) => {         
    res.sendFile(path.join(__dirname, '../board.html'))
})

// 아이디찾기 페이지
router.get("/findIDPage", (req, res) => {
    res.sendFile(path.join(__dirname, "../findID.html"))
})

// 비밀번호 찾기 페이지
router.get("/findPWPage", (req, res) => {
    res.sendFile(path.join(__dirname, "../findPW.html"))
})

// 회원가입 페이지
router.get("/joinPage", (req, res) => {
    res.sendFile(path.join(__dirname, "../join.html"))
})
module.exports = router 
