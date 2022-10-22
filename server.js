const express = require("express")  // 다른 js파일 연결 가능 require
const app = express() //express 문법 사용한다고
const port = 3000

app.get("/mainPage", (req, res) => {    // request(프론트에서 오는거 다 여기), response(백엔드에서 보내줄거) 다 오브젝트 형태로옴, 주소3000/mainpage이런거임
    res.sendFile(__dirname + "/mainPage.html")   // js는 무조건 절대경로로 가져오는데 __dirname은 뒤에 파일 이름을 찾아서 가져옴 이게 api야 가져오는거 보내주는거
    //sendFile이게 뭔뜻이었지 // 아 .3000/mainPage를 들어가면 /mainPage.html을 보내준다고
})


app.post("/login", (req, res) => {

})

app.get("/account", (req, res) => {         //가져오는거 계정정보
    
})


app.post("/account", (req, res) => {        //회원가입
    
})

app.listen(port, () => {    // listen은 이 Js를 구동하면 실행하는 것 매개변수를 받고 실행
    console.log(`${port} 번에서 웹 서버가 시작됨`)
})