const router = require("express").Router()
const clientOption = require("../config/clientConfig/client")
const { Client } = require("pg") 
const requestIp = require("request-ip")
const logging = require("../config/loggingConfig") // logging config
const sessionCheck = require("../module/sessionCheck") // session check module

const redisClient = require("redis").createClient()

let todayEnd = new Date(new Date().setHours(23, 59, 59, 999))
 
// session mongodb 

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
    }  

    try {
        await client.connect() // await 붙여주는
        
        const sql = 'SELECT * FROM backend.account WHERE id=$1;'
        const values = [idValue]

        const data = await client.query(sql, values)
        const row = data.rows
        
        if (row.length > 0) { // if else 문 밖으로 꺼내자
            if (pwValue == row[0].pw) { // 비밀번호 일치 예외처리
                result.success = true // 로그인 성공
                result.message = "로그인 성공"

                try {
                    await redisClient.connect()

                    const data = await redisClient.hGet("session", row[0].id) // 해당 아이디 세션 collection 가져오고

                    if (data) {
                        if (data != req.session.id) { // data가 있는데 다르면 다른곳에서 로그인 한거겠지?
                            redisClient.hDel("session", row[0].id) // 삭제
                        }
                    }
                    
                    // 세션 다시 만들고
                    req.session.user = {
                        id: row[0].id,
                        name: row[0].name,
                        email: row[0].email
                    }  

                    // ======== 로그인 회원 수 
                    // 이거 그냥 세션에 있는것들로 해도 되지 않을까 어차피 익스파이어 줄거면 세션에다 주는거지 근데 이러면 자정되면 다 끊기는거잖아
                    await redisClient.sAdd("visit", req.session.user.id)
                    await redisClient.expireAt("visit", parseInt(todayEnd / 1000));  // 자정 만료
                    // 로그인 할 때마다 되는데 여기 아니면 할 곳이 없는데

                    // 세션 저장
                    await redisClient.hSet("session", req.session.user.id, req.session.id) // 그냥 session.id값만 넣으면 되는거 아니야? 어차피 쿠키에 저장되어있자나 인증으로만 사용하는거니까
                    // await redisClient.expire("session", 5 * 60);  // 자정 만료

                    // ======== 전체 로그인 수 
                    const loginCounter = await redisClient.get("loginCounter")

                    if (loginCounter) { // 있으면 그냥 추가만 하는거고
                        await redisClient.set("loginCounter", parseInt(loginCounter) + 1)
                    } else {    // 없으면 db에서 값을 가져와야지

                        const counterData = await client.query("SELECT userCounter FROM backend.user") // 가져오고
                        await redisClient.set("loginCounter", parseInt(counterData)) // redis에 넣어주고
                    }

                    await redisClient.disconnect()
                } catch(err) {
                    result.message = err.message
                    console.log(err.message)
                    return res.send(result)
                } 

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


})

// 로그아웃 api
router.get("/logout", sessionCheck, async (req, res) => {

    const result = {
        "success": false,
        "message": "",
    }
    const request = {}
    let user = req.session.user.id    

    req.session.destroy()
    //=============================MongoDB
    try {

        logging(requestIp.getClientIp(req), user, "account/logout", "get", request, result)

    } catch {
        result.message = err.message
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

router.get("/counter", sessionCheck, async (req, res) => {

    const result = {
        "success": false,
        "message": null,
        "visitCounter": null,
        "loginCounter": null
    }

    try {
        await redisClient.connect()
        const visitData = await redisClient.sMembers("visit")   // 방문자
        const loginCounter = await redisClient.get("loginCounter")  // 전체 로그인 수 

        result.visitCounter = visitData.length  // visit 수
        result.loginCounter = loginCounter

        await redisClient.disconnect()

    } catch(err) {
        result.message = err.message
        res.send(result)
    }
    result.success = true
    res.send(result)
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