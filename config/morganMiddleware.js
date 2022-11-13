const morgan = require("morgan");
const logger = require('../config/winston'); // log출력 함수 연결

const stream = {
    write: message => {
        logger.info(message)
    }
}

const skip = () => {        // 어떠한 상태일 때 morgan을 실행하지 않고 skip할건지 설정
    const env = process.env.NODE_ENV || "development"
    return env !== "development"
}

morgan.token("status",  (req, res) => {     // 통신 결과에 따라 색상 변화
    let color = ""

    if (res.statusCode < 300) color = "\x1B[32m"    //green
    else if (res.statusCode < 400) color = "\x1B[36m" //cyan
    else if (res.statusCode < 500) color = "\x1B[33m"   //yellow
    else if (res.statusCode < 600) color = "\x1B[31m"   //red
    else color = "\033[0m" // 글자색 초기화

    return color + res.statusCode + "\033[35m" // 보라색
})

morgan.token("request", (req, res) => {     // 프론트 단에서 body에 담아서 보내준값 보여주는거 res는 어떻게 하지?
    return "Request_ " + JSON.stringify(req.body)
})

const morganMiddleware = morgan(
    "요청ip_ :remote-addr | 요청_ :method | url_ ':url' | :request | Status_:status | 응답시간_ :response-time ms (:res[content-length]줄)",
    { stream, skip }
)

module.exports =  morganMiddleware
