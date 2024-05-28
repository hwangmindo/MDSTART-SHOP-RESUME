import express from 'express';
import joi from 'joi';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma/index.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

const createdUsersSchema = joi.object({
  title: joi.string().required(),
  introduce: joi.string().min(150).required(),
});

// 이력서 생성 API
router.post('/resumes', authMiddleware, async (req, res, next) => {
  try {
    const { userId } = req.user;
    // body 에서 가져온 내용 유효성 검사
    const validation = await createdUsersSchema.validateAsync(req.body);
    const { title, introduce } = validation;
    const state = 'APPlY';

    // 데이터베이스에 저장
    const user = await prisma.resumes.create({
      data: {
        UserId: userId,
        title,
        introduce,
        state,
      },
    });

    // 데이터 찾기
    const data = await prisma.resumes.findFirst({
      where: { UserId: userId },
      select: {
        resumeId: true,
        UserId: true,
        title: true,
        introduce: true,
        state: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return res
      .status(201)
      .json({ message: '이력서 생성이 완료되었습니다.', data });
  } catch (error) {
    next(error);
  }
});

// 이력서 목록 조회 API
router.get('/resumes', authMiddleware, async (req, res, next) => {
  try {
    const { userId } = req.user;
    const sort = req.query.sort ? req.query.sort.toLowerCase() : 'desc';
    const orderBy = sort === 'asc' ? 'asc' : 'desc';
    if (orderBy !== 'asc' && orderBy !== 'desc') {
      throw new Error('not asc or desc');
    }
    const resumes = await prisma.users.findMany({
      where: { userId },
      select: {
        name: true,
        Resumes: {
          select: {
            resumeId: true,
            title: true,
            introduce: true,
            state: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      orderBy: { createdAt: orderBy },
    });
    return res.status(200).json({ data: resumes });
  } catch (error) {
    next(error);
  }
});

// 이력서 상세 조회 API
router.get('/resumes/:resumeId', authMiddleware, async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { resumeId } = req.params;
    if (!resumeId) {
      throw new Error('undefind resumeId');
    }
    console.log(resumeId);
    const resumes = await prisma.users.findFirst({
      where: {
        userId,
        Resumes: {
          some: { resumeId: +resumeId },
        },
      },
      select: {
        name: true,
        Resumes: {
          where: {
            resumeId: +resumeId,
          },
          select: {
            resumeId: true,
            title: true,
            introduce: true,
            state: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
    if (!resumes || resumes.Resumes.length === 0) {
      throw new Error('undefind Resume');
    }
    return res.status(200).json({ data: resumes });
  } catch (error) {
    next(error);
  }
});

const createdUsersSchema2 = joi.object({
  title: joi.string(),
  introduce: joi.string().min(150),
});

// 이력서 수정 API
router.patch('/resumes/:resumeId', authMiddleware, async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { resumeId } = req.params;
    const validation = await createdUsersSchema2.validateAsync(req.body);
    const { title, introduce } = validation;
    if (!title && !introduce) {
      throw new Error('some inner');
    }
    // 요청된 이력서가 존재하고 사용자가 소유한 이력서인지 확인
    const resume = await prisma.resumes.findUnique({
      where: {
		resumeId: +resumeId,
		UserId: userId
	  }
    });

    // 이력서가 존재하지 않으면 에러 처리
    if (!resume) {
      throw new Error('undefind Resume');
    }

    // 이력서 업데이트
    const updatedResume = await prisma.resumes.update({
      where: {
          resumeId: +resumeId,
          UserId: userId,
        },
      data: {
        title: title || undefined, // 제목이 제공되면 업데이트
        introduce: introduce || undefined, // 자기소개가 제공되면 업데이트
      },
      select: {
        resumeId: true,
        UserId: true,
        title: true,
        introduce: true,
        state: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json({ data: updatedResume });
  } catch (error) {
    next(error);
  }
});

// 이력서 삭제 API
router.delete('/resumes/:resumeId', authMiddleware, async (req, res, next) => {
	try {
	  const { userId } = req.user;
	  const { resumeId } = req.params;

	  // 요청된 이력서가 존재하고 사용자가 소유한 이력서인지 확인
	  const resume = await prisma.resumes.findUnique({
		where: {
		  resumeId: +resumeId,
		  UserId: userId
		}
	  });
  
	  // 이력서가 존재하지 않으면 에러 처리
	  if (!resume) {
		throw new Error('undefind Resume');
	  }

	  // 데이터 삭제
	  await prisma.resumes.delete({
		where: {
		  resumeId: +resumeId
		}
	  });
  
	  res.status(200).json({ deletedResumeId: +resumeId });
	} catch (error) {
	  next(error);
	}
  });


export default router;
