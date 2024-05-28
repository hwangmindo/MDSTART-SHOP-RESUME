import express from 'express';
import joi from 'joi';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { prisma } from '../utils/prisma/index.js'

const router = express.Router()

const createdUsersSchema = joi.object({
	email: joi.string().email().required(),
	password: joi.string().min(6).required(),
	pwCheck: joi.string().required(),
	name: joi.string().required()
});

// 회원가입 API
router.post('/sign-up', async (req, res, next) => {
	try {
	// body 에서 가져온 내용 유효성 검사
	const validation = await createdUsersSchema.validateAsync(req.body);
	const { email, password, pwCheck, name } = validation;
	
	// 이미 사용되고 있는 email 검증
	const isExistUser = await prisma.users.findFirst({
        where: { email }
    });
    if(isExistUser) {
        throw new Error('same email')
    }

	// password 확인
	if(password !== pwCheck) {
		throw new Error('not same password')
	}
	const part = "APPLICANT"
	const salt = 10
	const hashPw = await bcrypt.hash(password, salt)

	// 데이터베이스에 저장
	const user = await prisma.users.create({
		data: {
			email,
			password: hashPw,
			name,
			part
		}
	});

	// 데이터 찾기
	const data = await prisma.users.findFirst({
		where: { email },
		select: {
			userId: true,
			email: true,
			name: true,
			part: true,
			createdAt: true,
			updatedAt: true
		}
	});
	return res.status(201).json({ message: "회원가입이 완료되었습니다.", data });
	} catch(error) {
		next(error);
	}
});

const createdUsersSchema2 = joi.object({
	email: joi.string().email().required(),
	password: joi.string().min(6).required()
});

// 로그인 API
router.post('/sign-in', async (req, res, next) => {
	try {
		const validation = await createdUsersSchema2.validateAsync(req.body);
		const { email, password } = validation;

		const user = await prisma.users.findFirst({
			where: { email }
		});
		if(!user) {
			throw new Error('can not')
		}
		if(!await bcrypt.compare(password, user.password)) {
			throw new Error('can not')
		}
		const accessToken = jwt.sign(
			{ userId: user.userId }, 
			process.env.ACCESS_TOKEN_SECRET_KEY, 
			{ expiresIn: '12h' }
		);
		res.cookie('authorization', `Bearer ${accessToken}`);
		return res.status(200).json({ message: "Token이 정상적으로 발급되었습니다."});
	} catch(error) {
		next(error);
	}
});

export default router;