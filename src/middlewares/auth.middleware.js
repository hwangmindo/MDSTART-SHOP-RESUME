import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma/index.js';

export default async function (req, res, next) {
  try {
    // 1. 클라이언트로 부터 쿠키(Cookie) 전달받기
    const { authorization } = req.cookies;

    if (!authorization) {
      throw new Error('인증 정보가 없습니다.');
    }
    // 2. 쿠키(Cookie)가 Bearer 토큰 형식인지 확인
    const [tokenType, token] = authorization.split(' ');
    if (tokenType !== 'Bearer') {
      throw new Error('지원하지 않는 인증 방식입니다.');
    }
    const key = process.env.ACCESS_TOKEN_SECRET_KEY;

    // 3. 서버에서 발급한 JWT가 맞는지 검증
    const decodedToken = jwt.verify(token, key);
    const userId = decodedToken.userId;

    // 4. JWT의 `userId`를 이용해 사용자를 조회
    const user = await prisma.users.findFirst({
      where: { userId: +userId },
    });
    if (!user) {
      res.clearCookie('authorization');
      // 쿠키를 받았는데 없다면 정상적이지 않은 쿠키이기 때문에 삭제를 진행해야함
      throw new Error('인증 정보와 일치하는 사용자가 없습니다.');
    }

    // 5. `req.user` 에 조회된 사용자 정보를 할당합니다.
    req.user = user;

    // 6. 다음 미들웨어를 실행합니다.
    next();
  } catch (error) {
    res.clearCookie('authorization'); // 특정 쿠키를 삭제시킨다.

    switch (error.name) {
      case 'TokenExpiredError': // 토큰이 만료되었을 때, 발생하는 에러
        return res
          .status(401)
          .json({ errorMessage: '인증 정보가 만료되었습니다.' });
      case 'JsonWebTokenError': // 토큰에 검증이 실패했을 때, 발생하는 에러
        return res
          .status(401)
          .json({ errorMessage: '토큰이 유효하지 않습니다.' });
      default: // 그 외 모든 예외적인 에러 처리
        return res
          .status(401)
          .json({ errorMessage: error.message ?? '비정상적인 요청입니다.' });
      // error.message ?? 의 ??연산자는 왼쪽 피연산자가 null or undefined 일때만 오른쪽 피연산자를 반환 한다.
    }
  }
}
