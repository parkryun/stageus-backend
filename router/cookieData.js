const router = require("express").Router() 
const cookieParser = require('cookie-parser') // 쿠키 사용하게
const authCheck = require("../middleware/authCheck")

const result = {
    "success": false,
    "message": "",
    "post": []
}   

// get / cookieData
router.get('/', authCheck, (req, res) => {


    res.send(req.decoded) // decode된거 보내주기
})

module.exports = router 
