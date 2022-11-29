const router = require("express").Router()
const clientOption = require("../config/clientConfig/client")
const { Client } = require("pg") 
const requestIp = require("request-ip")
const logging = require("../config/loggingConfig") // logging config

// PostgreSQL 기본 설정 ( DB 계정 설정)


// post /account/login 로그인 api
router.post("/login", async (req, res) => {

    const result = {
        "success": false,
        "message": "",
    }
    const request = {
        "id": "",
        "pw": ""
    }

    const client = new Client(clientOption)

    const idValue = req.body.id_value
    const pwValue = req.body.pw_value
    request.id = idValue
    request.pw = pwValue

    if (idValue == '' || pwValue == '') { // null값 예외처리
        result.message = "작성해주세요"
        return res.send(result)
    }

    if (idValue.length > 10 || pwValue.length > 10) {   // 길이 체크
        result.message = "정보를 다시 입력해주세요"
        return res.send(result)
    } else {
        try {
            await client.connect() // await 붙여주는
            
            const sql = 'SELECT * FROM backend.account WHERE id=$1;'
            const values = [idValue]
    
            const data = await client.query(sql, values)
            const row = data.rows
            
            if (row.length > 0) {
                if (pwValue == row[0].pw) { // 비밀번호 일치 예외처리
                    result.success = true // 로그인 성공
                    result.message = "로그인 성공"

                    req.session.user = {
                        id: row[0].id,
                        name: row[0].name,
                        email: row[0].email
                    }
                    console.log(req.session)
                    //=============MongoDB 로깅
                    logging(requestIp.getClientIp(req), "", "account/login", "post", request, result)

                } else {
                    result.message = '비밀번호가 일치하지 않습니다.'
                }
            } else {
                result.message = '회원이 존재하지 않습니다.'
            }
            res.send(result)   
        } catch(err) { // 아 어차피 캐로 다 들어가니까 그냥 쭉 쓰는거네 근데 에러부분 뜨는 방식을 잘 모르겠네
            result.message = err.message
            console.log(result.message)
            res.send(result)
        }
    }

})

// 로그아웃 api
router.get("/logout", async (req, res) => {

    const result = {
        "success": false,
        "message": "",
    }

    let user = ""
    
    if (req.session.user) { // 세션 예외처리
        user = req.session.user.id
    } else {
        result.message = "세션이 없습니다."
        return res.send(result)
    }
    
    const request = {}

    req.session.destroy()
    //=============================MongoDB
    try {

        logging(requestIp.getClientIp(req), user, "account/logout", "get", request, result)

    } catch {
        result.message = err
        res.send(result)
    }
    result.success = true
    res.send(result)
})

// 이것도 post 회원가입
router.post("/", async (req, res) => {

    const result = {
        "success": false,
        "message": "",
    }

    const client = new Client(clientOption)

    const idValue = req.body.id_value
    const pwValue = req.body.pw_value
    const nameValue = req.body.name_value
    const emailValue = req.body.email_value

    const request = {
        "id": idValue,
        "pw": pwValue,
        "name": nameValue,
        "email": emailValue
    }

    if (idValue == '' || pwValue == '' || nameValue == '' || emailValue == '') { // null값 예외처리
        result.message = "작성해주세요"
        return res.send(result)
    }

    if (idValue.length > 10 || pwValue.length > 10 || nameValue.length > 10 || emailValue.length > 20) {   // 길이 체크
        result.message = "정보를 다시 입력해주세요"
        return res.send(result)
    } else {
        try {
            await client.connect()
    
            const sql = 'INSERT INTO backend.account (id, pw, name, email) VALUES ($1, $2, $3, $4);'
            const values = [idValue, pwValue, nameValue, emailValue]
    
            await client.query(sql, values)
            //======================MongoDB
            logging(requestIp.getClientIp(req), "", "account/", "post", request, result)

            result.success = true
            res.send(result)
        } catch(err) {
            result.message = err
            res.send(result)
        }
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