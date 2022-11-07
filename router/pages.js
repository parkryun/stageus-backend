const router = require("express").Router() 
const path = require("path")

// get //mainPage
router.get("/main", (req, res) => {
    // res.sendFile(__dirname + "../htmlPage/mainPage.html")
    res.sendFile(path.join(__dirname, "../htmlPage/mainPage.html"))
})

// 로그인페이지 가져오기
router.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../htmlPage/login.html"))
})

// 게시글 보는 페이지
router.get("/post", (req, res) => {
    res.sendFile(path.join(__dirname, "../htmlPage/post.html"))
})

// 게시판 목록 가져오기 ( 게시판 페이지 )
router.get("/post-list", (req, res) => {         
    res.sendFile(path.join(__dirname, '../htmlPage/postList.html'))
})

// 아이디찾기 페이지
router.get("/find-id", (req, res) => {
    res.sendFile(path.join(__dirname, "../htmlPage/findID.html"))
})

// 비밀번호 찾기 페이지
router.get("/find-pw", (req, res) => {
    res.sendFile(path.join(__dirname, "../htmlPage/findPW.html"))
})

// 비밀번호 변경 페이지
router.get("/update-pw", (req, res) => {
    res.sendFile(path.join(__dirname, "../htmlPage/findPW.html")) // 변경 페이지로 넣어야지
})

// 회원가입 페이지
router.get("/join", (req, res) => {
    res.sendFile(path.join(__dirname, "../htmlPage/join.html"))
})
module.exports = router 
