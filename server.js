const express = require("express")  // 다른 js파일 연결 가능 require // 여기서는 설치된 express import
const path = require("path")
const session = require('express-session')
const Memorystore = require('memorystore')(session)
const app = express() //express 문법 사용한다고 // import한걸 가져오는거
// ==============라우터 
const postApi = require("./router/post")
const findApi = require("./router/find")
const pagesApi = require("./router/pages")
const accountApi = require("./router/account")

const port = 3000

const maxAge = 1000 * 60 * 5 // 5분 설정
const sessionObj = {
    secret: "wegf6124@#$@#!",  // 암호화를 할 때 필요한 요소값 쿠키 변조 방지
    resave: false, // 변경사항 없어도 항상 저장할건지
    saveUninitialized: true,    // 만들었을때 수정 안하면 uninitialized
    store: new Memorystore({ checkPeriod: maxAge }),  // 서버를 저장할 공간 설정, checkPeriod > 서버쪽 세션의 유효기간
    cookie: {   // 쿠키 속성 값
        maxAge: maxAge     // 브라우저 쿠키의 유효기간
    }
}

app.use(session(sessionObj))
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use('/post', postApi)
app.use('/find', findApi)
app.use('/', pagesApi)
app.use('/account', accountApi)

app.get("/mainPage", (req, res) => {    // request(프론트에서 오는거 다 여기), response(백엔드에서 보내줄거) 다 오브젝트 형태로옴, 주소3000/mainpage이런거임
    res.sendFile(path.join(__dirname, "../mainPage.html"))   // js는 무조건 절대경로로 가져오는데 __dirname은 뒤에 파일 이름을 찾아서 가져옴 이게 api야 가져오는거 보내주는거
})


app.listen(port, () => {    // listen은 이 Js를 구동하면 실행하는 것 매개변수를 받고 실행
    console.log(`${port} 번에서 웹 서버가 시작됨`)
})
