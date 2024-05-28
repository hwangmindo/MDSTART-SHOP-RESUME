import winston from 'winston';

// winston 을 통해 어떤 로그를 관리 할 지 설정하는 부분
const logger = winston.createLogger({
  level: 'info', // 로그 레벨을 'info'로 설정합니다. 로그의 중요도를 나타냄
  format: winston.format.json(), // 로그 포맷을 JSON 형식으로 설정합니다.
  transports: [
    new winston.transports.Console(), // 로그를 콘솔에 출력합니다.
  ],
});

// 미들웨어가 실행되는 부분
export default function (req, res, next) {
  // 클라이언트의 요청이 시작된 시간을 기록합니다.
  const start = new Date().getTime();

  // 응답이 완료되면 로그를 기록합니다.
  res.on('finish', () => {
    const duration = new Date().getTime() - start;
    logger.info(
      `Method: ${req.method}, URL: ${req.url}, Status: ${res.statusCode}, Duration: ${duration}ms`
    );
  });

  next();
}
