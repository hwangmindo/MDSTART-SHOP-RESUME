import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({ // PrismaClient 인스턴스를 생성합니다.
	// Prisma를 이용해 데이터베이스를 접근할 때, SQL을 출력해줍니다.
	log: ['query', 'info', 'warn', 'error'],
	// query: Prisma가 실행하는 SQL 쿼리에 대한 정보를 출력합니다.
	// info: 정보에 관련된 로그를 출력합니다. 예를 들어 연결 상태 변경 등의 정보가 있을 수 있습니다.
	// warn: 경고에 관련된 로그를 출력합니다. 예상치 못한 상황이 발생할 수 있는 경우에 사용됩니다.
	// error: 오류에 관련된 로그를 출력합니다. 프로그램 실행 중 오류가 발생한 경우에 사용됩니다.

	// 에러 메시지를 평문이 아닌, 개발자가 읽기 쉬운 형태로 출력해줍니다.
	errorFormat: 'pretty'
}); 