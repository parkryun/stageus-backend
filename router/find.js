const router = require("express").Router()
const { Client } = require("pg") 

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

    const result = {
        "success": false,
        "message": "",
    }
    
    result.id = ""

    const nameValue = req.body.name_value
    const emailValue = req.body.email_value

    if (nameValue == '' || emailValue == '') { // null값 예외처리
        result.message = "작성해주세요"
        return res.send(result)
    }

    if (nameValue.length > 10 || emailValue.length > 10) {   // 길이 체크
        result.message = "정보를 다시 입력해주세요"
        return res.send(result)
    } else {
        try {
            await client.connect()
    
            const sql = 'SELECT * FROM backend.account WHERE name=$1;' // ? 대신 $로 대체 
            const values = [nameValue]
            
            const data = await client.query(sql, values)
            const row = data.rows
            
            if (row.length > 0) {
                if (row[0].email == emailValue) { // 이메일 일치 예외처리
                    result.success = true
                    result.id = row[0].id // 아이디 넘겨주기
                } else {
                    result.message = `회원정보가 정확하지 않습니다.`
                }
            } else {
                result.message = "회원이 존재하지 않습니다"
            }
            res.send(result)
        } catch(err) {
            result.message = err
            res.send(result)
        }
    }
})

// 비밀번호 찾기
router.post("/pw", async (req, res) => {

    const result = {
        "success": false,
        "message": "",
    }
        
    const idValue = req.body.id_value
    const emailValue = req.body.email_value

    if (idValue == '' || emailValue == '') { // null값 예외처리
        result.message = "작성해주세요"
        return res.send(result)
    }

    if (idValue.length > 10 || emailValue.length > 10) {   // 길이 체크
        result.message = "정보를 다시 입력해주세요"
        return res.send(result)
    } else {
        try {
            await client.connect()
    
            const sql = 'SELECT * FROM backend.account WHERE id=$1;' // ? 대신 $로 대체 
            const values = [idValue]
            
            const data = await client.query(sql, values)
            const row = data.rows
    
            if (row.length > 0) {
                if (row[0].email == emailValue) { // 이메일 일치 예외처리
                    req.session.user = {
                        id: row[0].id
                    } // 세션으로 아이디 넘기고
        
                    result.success = true
                } else {
                    result.message = `회원정보가 정확하지 않습니다.`
                }
            } else {
                result.message = "아이디가 존재하지 않습니다."
            }
            res.send(result)
        } catch(err) {
            result.message = err
            res.send(result)
        }
    }
})

// 비밀번호 변경
router.put("/pw", async (req, res) => {

    const result = {
        "success": false,
        "message": "",
    }
    const pwValue = req.body.pw_value
    const pwCheckValue = req.body.pw_check_value
    const idValue = req.body.id_value

    if (pwValue == '' || pwCheckValue == '' || idValue == undefined) { // null값 예외처리
        result.message = "작성해주세요"
        return res.send(result)
    }

    if (pwValue.length > 10 || pwCheckValue.length > 10) {   // 길이 체크
        result.message = "정보를 다시 입력해주세요"
        return res.send(result)
    } else {
        if (pwValue != pwCheckValue) { // 일차 예외처리
            result.message = "비밀번호가 일치하지 않습니다"
            return res.send(result)
        } else {
            try {
                await client.connect()
                
                const sql = 'UPDATE backend.account SET pw=$1; WHERE id=$2;' // ? 대신 $로 대체 
                const values = [pwValue, idValue]
                
                await client.query(sql, values)
                
                req.session.user.destroy() // 세션 지우고
        
                result.success = true
                res.send(result)
            } catch(err) {
                result.message = err
                res.send(result)
            }             
        }
    }
})

module.exports = router