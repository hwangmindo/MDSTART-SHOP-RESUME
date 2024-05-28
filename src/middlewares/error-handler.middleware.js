export default (err, req, res, next) => {
	console.log('에러 처리 미들웨어가 실행되었습니다.');
	console.error(err.message);
	// joi 에러
	if (err.isJoi) {
		if(err.message === '"email" must be a valid email') {
			return res.status(400).json({ errorMessage: "이메일 형식이 올바르지 않습니다." });
		}
		if(err.message.includes('is required')) {
			const splitErr = err.message.split(' ')[0].replace(/"/g, '')
			// .replace(/"/g, '') 를 사용하면 joi의 오류메세지 따옴표를 제거가능
			return res.status(400).json({ errorMessage: `${splitErr}을(를) 입력해주세요.` });
		}
		if(err.message.includes('characters long')) {
			const splitErr = err.message.split(' ')[0].replace(/"/g, '')
			const splitNum = err.message.split(' ')[6]
			return res.status(400).json({ errorMessage: `${splitErr}는 ${splitNum}자 이상이어야 합니다.` });
		}		
	  }
	// throw 에러
	if (err.message === 'same email') {
	  	return res.status(400).json({ errorMessage: '이미 가입 된 사용자입니다.' });
	}
	if (err.message === 'not same password') {
		return res.status(400).json({ errorMessage: '입력 한 두 비밀번호가 일치하지 않습니다.' });
	}
	if (err.message === 'can not') {
		return res.status(401).json({ errorMessage: '인증 정보가 유효하지 않습니다.' });
  	}
	if (err.message === 'not asc or desc') {
		return res.status(400).json({ errorMessage: 'query에 입력한 값이 asc/desc 가 아닙니다.' });
	}
	if (err.message === 'undefind resumeId') {
		return res.status(400).json({ errorMessage: 'resumeId를 입력해주세요.' });
	}
	if (err.message === 'undefind Resume') {
		return res.status(401).json({ errorMessage: '이력서가 존재하지 않습니다.' });
	}
	if (err.message === 'some inner') {
		return res.status(400).json({ errorMessage: '수정 할 정보를 입력해 주세요' });
	}
	
  
	return res.status(500).json({
	  errorMessage: '예상치 못한 에러가 발생했습니다. 관리자에게 문의해 주세요.',
	});
};