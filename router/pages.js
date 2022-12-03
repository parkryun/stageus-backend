const router = require("express").Router() 
const path = require("path")
const sessionCheck = require("../module/sessionCheck") // session check module

const result = {
    "success": false,
    "message": "",
    session: null
}   


// get //mainPage
router.get("/main", (req, res) => {
    
    res.sendFile(path.join(__dirname, "../htmlPage/mainPage.html"))
})

// get mainpage session
router.get("/main-session", sessionCheck, (req, res) => {

    result.session = req.session
    res.send(result)
})

// logging Page
router.get("/loggingPage", (req, res) => {

    res.sendFile(path.join(__dirname, "../htmlPage/logging.html"))
})

// 로그인페이지 가져오기
router.get("/login", (req, res) => {

    if (req.session.user) { // 세션 예외처리 
        res.sendFile(path.join(__dirname, "../htmlPage/mainPage.html")) // 이게 더 자연스럽지 
    } else {
        res.sendFile(path.join(__dirname, "../htmlPage/login.html"))    
    }
})

// 게시글 보는 페이지
router.get("/postPage", (req, res) => {
    
    res.sendFile(path.join(__dirname, "../htmlPage/post.html"))
})

// 게시글 작성 페이지
router.get("/post-write", (req, res) => {
    
    if (req.session.user) {
        res.sendFile(path.join(__dirname, "../htmlPage/postWrite.html"))
    } else {
        res.sendFile(path.join(__dirname, "../htmlPage/login.html"))
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
