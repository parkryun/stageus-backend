const winston = require('winston');
const winstonDaily = require('winston-daily-rotate-file');

const logDir = '../logs' // logs 디렉토리 하위에 로그파일 저장
const { combine, timestamp, label, printf } = winston.format

const logFormat = printf(info => { // define log format
    return `${info.timestamp} ${info.label} ${info.level}: ${info.message}`
})

const infoTransport = new winston.transports.File({
    level: 'info',
    dataPattern: 'YYYY-MM-DD',
    dirname: logDir,
    filename: `%DATE%.log`,
    maxFiles: 30,
    zippedArchive: true
})

const errorTransport = new winston.transports.File({
    level: 'error',
    dataPattern: 'YYYY-MM-DD',
    dirname: logDir + '/error', // error.log 파일은 /logs/error 하위에 저장
    filename: `%DATE%.error.log`,
    maxFiles: 30,
    zippedArchive: true
})

const logger = winston.createLogger({
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        logFormat
    ),
    transports: [infoTransport, errorTransport]
})

logger.stream = {
    write: message => {
        logger.info(message)
    }
}

// Production 환경이 아닌 경우(dev 등) 
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({ // 콘솔로 출력
      format: winston.format.combine(
        winston.format.colorize(),  // 색깔 넣어서 출력
        winston.format.simple(),  // `${info.level}: ${info.message} JSON.stringify({ ...rest })` 포맷으로 출력
      )
    })
    )
}

module.exports = logger
