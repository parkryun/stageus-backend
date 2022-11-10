const router = require("express").Router() 
const path = require("path")
const clientOption = require("./client")

const result = {
    "success": false,
    "message": "",
    "post": []
}   

// get //mainPage
router.get("/main", (req, res) => {
    // res.sendFile(__dirname + "../htmlPage/mainPage.html")
    res.sendFile(path.join(__dirname, "../htmlPage/mainPage.html"))
})

// get mainpage session
router.get("/main-session", (req, res) => {
    // res.sendFile(__dirname + "../htmlPage/mainPage.html")
    let user = req.session.user
    if (user) {
        res.send(user)
    } else {
        result.message = "세션없음"
        console.log(result)
        res.send(result)
    }
})

// 로그인페이지 가져오기
router.get("/login", (req, res) => {

    console.log(clientOption)

    res.sendFile(path.join(__dirname, "../htmlPage/login.html"))
})

// 게시글 보는 페이지
router.get("/postPage", (req, res) => {
    res.sendFile(path.join(__dirname, "../htmlPage/post.html"))
})

// 댓글 남길때 session
router.get("/comment-session", (req, res) => {
    let user = req.session.user
    if (user) {
        res.send(user)
    } else {
        result.message = "세션없음"
        console.log(result)
        res.send(result)
    }
})

// 게시글 작성 페이지
router.get("/post-write", (req, res) => {
    res.sendFile(path.join(__dirname, "../htmlPage/postWrite.html"))
})

// 게시글 작성 session
router.get("/post-write-session", (req, res) => {
    let user = req.session.user
    if (user) {
        res.send(user)
    } else {
        result.message = "세션없음"
        console.log(result)
        res.send(result)
    }
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
    res.sendFile(path.join(__dirname, "../htmlPage/updatePW.html")) // 변경 페이지로 넣어야지
})

// 비밀번호 변경 아이디 session
router.get("/update-pw-session", (req, res) => {
    let user = req.session.user
    if (user) {
        res.send(user)
    } else {
        result.message = "세션없음"
        console.log(result)
        res.send(result)
    }
})

// 회원가입 페이지
router.get("/join", (req, res) => {
    res.sendFile(path.join(__dirname, "../htmlPage/join.html"))
})
module.exports = router 
