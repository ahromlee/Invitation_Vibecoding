// 청첩장 텍스트 및 설정 파일
// 이 파일에서 모든 텍스트를 수정하세요!

// ===== 컬러 테마 옵션 =====
export const ColorTheme = {
  PINK: 1,   // 핑크 테마
  GREEN: 2,  // 그린 테마
};

// ===== 컬러 팔레트 정의 =====
export const colorPalettes = {
  [ColorTheme.PINK]: {
    // 배경 그라데이션
    bgGradient: 'linear-gradient(to bottom right, #ffe4e6, #fce7f3, #e0e7ff)',
    bgOverlay: 'linear-gradient(to bottom right, rgba(251, 113, 133, 0.2), rgba(244, 114, 182, 0.2), rgba(196, 181, 253, 0.2))',
    // 텍스트 강조색
    accent: 'rgba(251, 113, 133, 0.8)',
    accentSolid: '#fb7185',
    heart: '#fda4af',
    // 갤러리 에러 배경
    galleryErrorBg: 'linear-gradient(to bottom right, #ffe4e6, #fce7f3)',
    // 인디케이터
    indicatorActive: '#fb7185',
    indicatorInactive: '#d1d5db',
  },
  [ColorTheme.GREEN]: {
    // 배경 그라데이션
    bgGradient: 'linear-gradient(to bottom right, #dcfce7, #d1fae5, #e0f2fe)',
    bgOverlay: 'linear-gradient(to bottom right, rgba(74, 222, 128, 0.2), rgba(52, 211, 153, 0.2), rgba(147, 197, 253, 0.2))',
    // 텍스트 강조색
    accent: 'rgba(74, 222, 128, 0.8)',
    accentSolid: '#4ade80',
    heart: '#86efac',
    // 갤러리 에러 배경
    galleryErrorBg: 'linear-gradient(to bottom right, #dcfce7, #d1fae5)',
    // 인디케이터
    indicatorActive: '#4ade80',
    indicatorInactive: '#d1d5db',
  },
};

export const config = {
  // ===== 테마 설정 =====
  // ColorTheme.PINK (1) 또는 ColorTheme.GREEN (2) 선택
  colorTheme: ColorTheme.GREEN,

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
    devDescription: '* 본 청접장은 github repository에서 확인할 수 있습니다.',
    devRepository: 'https://github.com/arom-dev/wedding-invitation',
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

