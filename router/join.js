// // const express = require("express")
// // const router = express.Router()
// const path = require("path")

// const router = require("express").Router()
// const { Client } = require("pg") // postgre import

// // post /account/login
// router.post("/login", async (req, res) => {

//     const idValue = req.body.id_value
//     const pwValue = req.body.pw_value

//     const result = {
//         "success": false,
//         "message": ""
//     }

//     // PostgreSQL 기본 설정 ( DB 계정 설정)
//     const client = new Client({ // =위에 있는 Client를 받는데 
//         user: "ubuntu",
//         password: "1234",
//         host: "localhost",
//         database: "stageus",
//         port: 5432
//     })

//     // // PostgreSQL 연결 (callback)
//     // client.connect((err) => { // 이게 비동기함수 client.
//     //     if(err) {   // error가 발생
//     //         result.message = "DB 연결에 오류가 있습니다."
//     //         res.send(result)
//     //     } else {      // error가 발생x
//     //         const sql = "SELECT * FROM backend.account WHERE id=$1 and pw=$2;" // ? 대신 $로 대체 
//     //         const values = [idValue, pwValue]  // value값들을 넣어서
//     //         client.query(sql, values, (err, data) => {
//     //             if (err) {  // sql 에러 발생
//     //                 result.message = "SQL문이 잘못되었습니다."
//     //                 res.send(result)
//     //             } else {    // sql 에러 발생x
//     //                 const row = data.rows
//     //                 if (row.lenth > 0) {
//     //                     result.success = true
//     //                 }
//     //                 res.send(result)
//     //             }
//     //         })
//     //     }
//     //     // res.send(result) // 반환 이게 callback 방식
//     // })
//     // // res.send(result)

//     // PostgreSQL 연결 ( async-await ) await이 포함되어있는 함수의 시작 부분에 async를 붙여줘야해
//     try {
//         await client.connect() // await 붙여주는
        
//         const sql = "SELECT * FROM backend.account WHERE id=$1 and pw=$2;" // ? 대신 $로 대체 
//         const values = [idValue, pwValue]
    
//         const data = await client.query(sql, values) // await 앞에 변수를 붙여주는거지
//         const row = data.rows
//         if (row.lenth > 0) {
//             result.success = true
//         } else {
//             result.message = "회원정보가 잘못됐습니다."
//         }
//         res.send(result)
//     } catch(err) {
//         result.message = err
//         res.send(result)
//     }
// })

// // 회원가입 api
// router.post("/signUp", (req, res) => {
    
// })

// // 회원 정보 insert

// // server.js에서 routing 모듈로 사용하게
// module.exports = router