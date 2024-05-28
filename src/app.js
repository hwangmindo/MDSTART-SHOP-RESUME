import express from 'express';
import cookieParser from 'cookie-parser';
import logMiddleware from './middlewares/log.middleware.js';
import errorHandlerMiddleware from './middlewares/error-handler.middleware.js';
import UsersRouter from './routes/users.router.js';
import ResumesRouter from '/routes/resumes.router.js';


const app = express();
const PORT = 3020;

app.use(logMiddleware);
app.use(express.json());
app.use(cookieParser());
app.use('/api',[UsersRouter, ResumesRouter]);
app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
	console.log(PORT, "포트로 서버가 열렸어요!")
})