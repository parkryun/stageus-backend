const router = require("express").Router()
const { Client } = require("pg") // postgre import

const result = {
    "success": false,
    "message": ""
}

// PostgreSQL 기본 설정 ( DB 계정 설정)
const client = new Client({ // =위에 있는 Client를 받는데 
    user: "ubuntu",
    password: "1234",
    host: "localhost",
    database: "stageus",
    port: 5432
})

// post /account/login 로그인 api
router.post("/login", async (req, res) => {

    const idValue = req.body.id_value
    const pwValue = req.body.pw_value

    // if (idValue = '' || pwValue = '') { // null값 예외처리
    //     result.message = ""
    // }

    // // PostgreSQL 연결 (callback)
    // client.connect((err) => { // 이게 비동기함수 client.
    //     if(err) {   // error가 발생
    //         result.message = "DB 연결에 오류가 있습니다."
    //         res.send(result)
    //     } else {      // error가 발생x
    //         const sql = "SELECT * FROM backend.account WHERE id=$1 and pw=$2;" // ? 대신 $로 대체 
    //         const values = [idValue, pwValue]  // value값들을 넣어서
    //         client.query(sql, values, (err, data) => {
    //             if (err) {  // sql 에러 발생
    //                 result.message = "SQL문이 잘못되었습니다."
    //                 res.send(result)
    //             } else {    // sql 에러 발생x
    //                 const row = data.rows
    //                 if (row.lenth > 0) {
    //                     result.success = true
    //                 }
    //                 res.send(result)
    //             }
    //         })
    //     }
    //     // res.send(result) // 반환 이게 callback 방식
    // })
    // // res.send(result)

    // PostgreSQL 연결 ( async-await ) await이 포함되어있는 함수의 시작 부분에 async를 붙여줘야해
    try {
        await client.connect() // await 붙여주는
        
        const sql = 'SELECT * FROM backend.account WHERE id=$1 and pw=$2;' // ? 대신 $로 대체 
        const values = [idValue, pwValue]
        
        const data = await client.query(sql, values)
        const row = data.rows

        if (idValue == pwValue) { // 아이디 비밀번호 일치 예외처리
            result.success = true // 로그인 성공
            
            req.session.user = {
                id: row[0].id,
                name: row[0].name,
                email: row[0].email
            }
            // 여기에 세션
        } else {
            result.message = `비밀번호가 일치하지 않습니다.`
        }

        res.send(result)
    } catch(err) { // 아 어차피 캐로 다 들어가니까 그냥 쭉 쓰는거네 근데 에러부분 뜨는 방식을 잘 모르겠네
        result.message = err
        res.send(result)
    }
})

// 로그아웃 api
router.get("/logout", (req, res) => {
    req.session.destroy()

    res.redirect("/login") // 로그아웃 후 로그인 페이지
})

// 이것도 post 회원가입
router.post("/", async (req, res) => {
    
    const idValue = req.body.id_value
    const pwValue = req.body.pw_value
    const nameValue = req.body.name_value
    const emailValue = req.body.email_value

    try {
        await client.connect()

        const sql = 'INSERT INTO backend.account (id, pw, name, email) VALUES ($1, $2, $3, $4);'
        const values = [idValue, pwValue, nameValue, emailValue]

        await client.query(sql, values)

        result.success = true

        res.send(result)
    } catch(err) {
        result.message = err
        res.send(result)
    }
})

// get /account/account 이거니까 account를 지워주는거야 그냥 /로만 이건 회원정보 가져오기
router.get("/", (req, res) => {
    
})

// 회원정보 수정
router.put("/", (req, res) => {
    
})

// 회원 탈퇴
router.delete("/", (req, res) => {
    
})

module.exports = router