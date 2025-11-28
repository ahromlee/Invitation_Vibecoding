// 청첩장 텍스트 및 설정 파일
// 이 파일에서 모든 텍스트를 수정하세요!

export const config = {
  // ===== 신랑/신부 정보 =====
  groom: {
    name: '아롬',
    fatherName: '이원조',
    motherName: '이점숙',
    relation: '장남', // 장남, 차남, 삼남 등
  },
  bride: {
    name: '경륜',
    fatherName: '신락현',
    motherName: '곽광숙',
    relation: '장녀', // 장녀, 차녀, 삼녀 등
  },

  // ===== 결혼식 정보 =====
  wedding: {
    date: '2026-04-18', // YYYY-MM-DD 형식
    time: '13:00', // HH:MM 형식 (24시간)
    dateText: '2026년 4월 18일 토요일',
    timeText: '오후 1시',
  },

  // ===== 예식장 정보 =====
  venue: {
    name: '에스가든웨딩홀 청주점',
    address: '충청북도 청주시 서원구 1순환로 854',
    addressDetail: '(산남동 320번지, CJB미디어센터)',
    hall: '', // 예: '3층 그랜드홀' (없으면 비워두기)
  },

  // ===== 지도 링크 =====
  maps: {
    naver: 'https://naver.me/G02HkD4H',
    kakao: 'https://kko.kakao.com/m7wFN3SI-8',
    tmap: 'https://tmap.life/ea42d1f6', 
  },

  // ===== 교통편 안내 =====
  transportation: [
    '남부터미널 | 자차 5분 · 대중교통 20분',
    '가경시외버스터미널 | 자차 10분 · 대중교통 30분',
    '서청주IC | 자차 15분',
  ],
  busInfo: '버스 | 30-1, 30-2, 710, 843, 851',

  // ===== 인사말 =====
  greeting: {
    title: '초대합니다',
    message: [
      '서로의 삶에 따뜻한 동반자가 되어',
      '사랑과 신뢰로 한 가정을 이루려 합니다.',
    ],
    subMessage: [
      '축복의 자리에 귀한 걸음 하시어',
      '저희의 새로운 시작을 함께해 주세요.',
    ],
  },

  // ===== 계좌 정보 =====
  accounts: {
    groom: {
      bank: '신한은행',
      accountNumber: '110-482-263062',
      holder: '아롬',
    },
    bride: {
      bank: '예시은행',
      accountNumber: '987-654-321098',
      holder: '경륜',
    },
    // 부모님 계좌 추가 시 아래 주석 해제
    // groomFather: {
    //   bank: '은행명',
    //   accountNumber: '000-000-000000',
    //   holder: '이원조',
    // },
    // groomMother: {
    //   bank: '은행명',
    //   accountNumber: '000-000-000000',
    //   holder: '이정숙',
    // },
    // brideFather: {
    //   bank: '은행명',
    //   accountNumber: '000-000-000000',
    //   holder: '신락현',
    // },
    // brideMother: {
    //   bank: '은행명',
    //   accountNumber: '000-000-000000',
    //   holder: '곽광숙',
    // },
  },

  // ===== 갤러리 이미지 =====
  // public 폴더에 이미지 추가 후 여기에 경로 입력
  gallery: [
    '/gallery_1.jpg',
    '/gallery_2.jpg',
    '/gallery_3.jpg',
    '/gallery_4.jpg',
  ],

  // ===== 픽셀아트/메인 이미지 =====
  pixelArt: '/pixel_art.gif',
};

