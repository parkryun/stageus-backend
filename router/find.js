const express = require("express")
const path = require("path")
const router = express.Router()

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

// 아이디 찾기
router.post("/id", async (req, res) => {
    
    result.id = ""

    const nameValue = req.body.name_value
    const emailValue = req.body.email_value
    // 예외처리
    try {
        await client.connect()

        const sql = 'SELECT * FROM backend.account WHERE name=$1;' // ? 대신 $로 대체 
        const values = nameValue
        
        const data = await client.query(sql, values)
        const row = data.rows

        if (row[0].email == emailValue) { // 이메일 일치 예외처리
            result.success = true
            result.id = row[0].id // 아이디 넘겨주기
        } else {
            result.message = `회원정보가 정확하지 않습니다.`
        }
        res.send(result)
    } catch(err) {
        result.message = err
        res.send(result)
    }
})

// 비밀번호 찾기
router.post("/pw", async (req, res) => {
        
    const idValue = req.body.id_value
    const emailValue = req.body.email_value
    // 예외처리
    try {
        await client.connect()

        const sql = 'SELECT * FROM backend.account WHERE id=$1;' // ? 대신 $로 대체 
        const values = idValue
        
        const data = await client.query(sql, values)
        const row = data.rows

        if (row[0].email == emailValue) { // 이메일 일치 예외처리
            result.success = true
            // 아이디 세션으로 넘기고
        } else {
            result.message = `회원정보가 정확하지 않습니다.`
        }
        res.send(result)
    } catch(err) {
        result.message = err
        res.send(result)
    }
})

// 비밀번호 변경
router.put("/pw", async (req, res) => {

    const pwValue = req.body.pw_value
    const pwCheckValue = req.body.pw_check_value
    // 세션 아이디 받기
    
    try {
        await client.connect()

        const sql = 'UPDATE backend.account SET pw=$1; WHERE id=$2;' // ? 대신 $로 대체 
        const values = [pwValue, idValue]
        
        await client.query(sql, values)

        res.send(result)
    } catch(err) {
        result.message = err
        res.send(result)
    }
})

module.exports = router