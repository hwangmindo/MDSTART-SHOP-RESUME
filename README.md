
# history

1. npm install -g yarn
2. yarn init -y
3. yarn add -D nodemon
4. yarn add -D prettier
5. npm install -g node-pre-gyp // bcrypt 설치 전 필요
6. yarn add express prisma @prisma/client cookie-parser jsonwebtoken joi dotenv bcrypt winston
7. git init
8. git remote add origin git@github.com:hwangmindo/MDSTART-SHOP-RESUME.git
9. git branch -M main
10. git add -A
11. git commit -m"
12. git push -u origin main


# 목표

1. API 명세서 작성
2. ERD 작성
3. MySQL, Prisma 데이터베이스
4. JWT, MIddleware 인증 인가 (검증)
jwt.sign({ userId: user.userId, }, "customized_secret_key")
jwt.verify(token, 'customized_secret_key')

5. bcrypt password 보안성 (hash, compare)
6. Bearer 토큰 형식 활용 
res.cookie("authorization", `Bearer ${token}`)

7. aws ec2 배포


# Develop

개발 1
1. 디렉터리 가이드 라인 생성

개발 2
1. DB연결 npx prisma init (prisma를 활용해 myspl db에 연결)
2. schema.prisma 작성후 npx prisma db push

개발 3
1. 회원가입 api < users.router.js >
2. 로그인 api < users.router.js >

개발 4
1. 사용자 인증 < auth.middleware.js >
2. 내 정보 조회 api < users.router.js >

개발 5
1. 이력서 생성 api < resumes.router.js >
2. 이력서 목록 조회 api < resumes.router.js >
3. 이력서 상세 조회 api < resumes.router.js >
4. 이력서 수정 api < resumes.router.js >
5. 이력서 삭제 api < resumes.router.js >

# 관계

1. 1:N Users / resumes
