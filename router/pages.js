const router = require("express").Router() 
const path = require("path")
const clientOption = require("../config/clientConfig/client")

const result = {
    "success": false,
    "message": "",
    "post": []
}   

let postNum = ""

// get //mainPage
router.get("/main", (req, res) => {

    res.sendFile(path.join(__dirname, "../htmlPage/mainPage.html"))
})

// get mainpage session
router.get("/main-session", (req, res) => {
    
    if (req.session.user) {
        res.send(req.session.user)
    } else {
        result.message = "세션이 없습니다."
        res.send(result)
    }
})

// logging Page
router.get("/loggingPage", (req, res) => {

    res.sendFile(path.join(__dirname, "../htmlPage/logging.html"))
})

// 로그인페이지 가져오기
router.get("/login", (req, res) => {

    if (req.session.user) { // 세션 예외처리
        res.send("<script>alert('로그아웃이 필요합니다.');location.href = '/main'</script>")
    } else {
        res.sendFile(path.join(__dirname, "../htmlPage/login.html"))    
    }
})

// 게시글 보는 페이지
router.get("/postPage", (req, res) => {

    postNum = req.query.postNum
    
    res.sendFile(path.join(__dirname, "../htmlPage/post.html"), postNum)
})

// 게시글 작성 페이지
router.get("/post-write", (req, res) => {
    
    res.sendFile(path.join(__dirname, "../htmlPage/postWrite.html"))
})

// 게시글 작성 session
router.get("/post-write-session", (req, res) => {
    
    if (req.session.user) {
        res.send(result)
    } else {
        result.message = "세션이 없습니다."
        res.send(result)
    }
})

// 게시판 목록 가져오기 ( 게시판 페이지 )
router.get("/post-list", (req, res) => {    

    res.sendFile(path.join(__dirname, '../htmlPage/postList.html')) 
})
 
// 아이디찾기 페이지
router.get("/find-id", (req, res) => {

    if (req.session.user) { // 세션 예외처리
        res.send("<script>alert('로그아웃이 필요합니다.');location.href = '/main'</script>")
    } else {
        res.sendFile(path.join(__dirname, "../htmlPage/findID.html"))
    }
})

// 비밀번호 찾기 페이지
router.get("/find-pw", (req, res) => {
    if (req.session.user) { // 세션 예외처리
        res.send("<script>alert('로그아웃이 필요합니다.');location.href = '/main'</script>")
    } else {
        res.sendFile(path.join(__dirname, "../htmlPage/findPW.html"))
    }
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
