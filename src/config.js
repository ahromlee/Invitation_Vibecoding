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
    bgGradient: 'linear-gradient(to bottom right, #ffe4e6, #fce7f3, #e0e7ff)',
    bgOverlay: 'linear-gradient(to bottom right, rgba(251, 113, 133, 0.2), rgba(244, 114, 182, 0.2), rgba(196, 181, 253, 0.2))',
    accent: 'rgba(251, 113, 133, 0.8)',
    accentSolid: '#fb7185',
    heart: '#fda4af',
    galleryErrorBg: 'linear-gradient(to bottom right, #ffe4e6, #fce7f3)',
    indicatorActive: '#fb7185',
    indicatorInactive: '#d1d5db',
  },
  [ColorTheme.GREEN]: {
    bgGradient: 'linear-gradient(to bottom right, #dcfce7, #d1fae5, #e0f2fe)',
    bgOverlay: 'linear-gradient(to bottom right, rgba(74, 222, 128, 0.2), rgba(52, 211, 153, 0.2), rgba(147, 197, 253, 0.2))',
    accent: 'rgba(22, 163, 74, 0.85)',
    accentSolid: '#15803d',
    heart: '#16a34a',
    galleryErrorBg: 'linear-gradient(to bottom right, #dcfce7, #d1fae5)',
    indicatorActive: '#4ade80',
    indicatorInactive: '#d1d5db',
  },
};

export const config = {
  // ============================================================
  // 1. 기본 설정
  // ============================================================
  colorTheme: ColorTheme.GREEN,  // PINK(1) 또는 GREEN(2)

  // ============================================================
  // 2. 히어로 섹션 (첫 화면)
  // ============================================================
  hero: {
    // 메인 타이틀 (영문 또는 한글)
    titleLine1: '우리',            // 첫 줄
    titleLine2: '결혼해요',         // 둘째 줄
    // 배경 이미지
    backgroundImage: '/bg.jpg',
    backgroundOpacity: 0.5,       // 0.0 ~ 1.0
    useBackgroundImage: true,
  },

  // ============================================================
  // 3. 신랑/신부 정보
  // ============================================================
  groom: {
    name: '아롬',           // 표시용 이름
    fullname: '이아롬',     // 성+이름
    fatherName: '이원조',
    motherName: '이점숙',
    relation: '장남',       // 장남, 차남, 삼남 등
  },
  bride: {
    name: '경륜',
    fullname: '신경륜',
    fatherName: '신락현',
    motherName: '곽광숙',
    relation: '장녀',
  },

  // ============================================================
  // 4. 결혼식 날짜/시간
  // ============================================================
  wedding: {
    date: '2026-04-18',           // YYYY-MM-DD (캘린더용)
    time: '13:00',                // HH:MM 24시간 (캘린더용)
    // 표시용 텍스트
    year: '2026년',
    monthDay: '4월 18일',
    dayOfWeek: '토요일',
    timeText: '오후 1시',
  },

  // ============================================================
  // 5. 예식장 정보
  // ============================================================
  venue: {
    name: '에스가든웨딩홀',        // 예식장 이름
    branch: '청주점',              // 지점명 (없으면 빈 문자열)
    hall: '',                      // 홀 이름 (예: '그랜드볼룸', 없으면 빈 문자열)
    address: '충청북도 청주시 서원구 1순환로 854',
    addressDetail: '(산남동 320번지, CJB미디어센터)',
  },

  // ============================================================
  // 6. 지도/교통
  // ============================================================
  maps: {
    naver: 'https://naver.me/G02HkD4H',
    kakao: 'https://kko.kakao.com/m7wFN3SI-8',
    tmap: 'https://tmap.life/ea42d1f6',
    image: '/map_image.png',
  },
  transportation: [
    '남부터미널 | 자차 5분 · 대중교통 20분',
    '가경시외버스터미널 | 자차 10분 · 대중교통 30분',
    '서청주IC | 자차 15분',
  ],
  busInfo: '버스 | 30-1, 30-2, 710, 843, 851',

  // ============================================================
  // 7. 섹션 타이틀 (한글)
  // ============================================================
  sectionTitles: {
    greeting: '초대합니다',
    story: '우리의 이야기',
    gallery: '갤러리',
    location: '오시는 길',
    account: '마음 전하실 곳',
    // dday: 'D-Day',
    // calendar: '캘린더에 추가',
  },

  // ============================================================
  // 8. 인사말
  // ============================================================
  greeting: {
    message: [
      '서로의 삶에 따뜻한 동반자가 되어',
      '사랑과 신뢰로 한 가정을 이루려 합니다.',
    ],
    subMessage: [
      '축복의 자리에 귀한 걸음 하시어',
      '저희의 새로운 시작을 함께해 주세요.',
    ],
  },

  // ============================================================
  // 9. 우리의 이야기 (픽셀아트 아래)
  // ============================================================
  ourStory: [
    {
      text: [
        '첫 번째 줄 텍스트를 입력하세요.',
        '두 번째 줄 텍스트를 입력하세요.',
      ],
      author: '신랑',
    },
    {
      text: [
        '첫 번째 줄 텍스트를 입력하세요.',
        '두 번째 줄 텍스트를 입력하세요.',
      ],
      author: '신부',
    },
  ],

  // ============================================================
  // 10. 갤러리 이미지
  // ============================================================
  gallery: [
    '/gallery_1.jpg',
    '/gallery_2.jpg',
    '/gallery_3.jpg',
    '/gallery_4.jpg',
  ],
  pixelArt: '/pixel_art.gif',

  // ============================================================
  // 11. 계좌 정보
  // ============================================================
  accounts: {
    // 신랑측
    groom: {
      bank: '신한은행',
      accountNumber: '110-482-263062',
      holder: '이아롬',
    },
    groomFather: {
      bank: '농협',           // 은행명 (빈 문자열이면 표시 안함)
      accountNumber: '246-02-228936',
      holder: '이원조',
    },
    groomMother: {
      bank: '농협',
      accountNumber: '246-02-138021',
      holder: '이점숙',
    },
    // 신부측
    bride: {
      bank: '국민은행',
      accountNumber: '404015-2900197-01',
      holder: '신경륜',
    },
    brideFather: {
      bank: '륜알려주세요은행',
      accountNumber: '11111111111',
      holder: '신락현',
    },
    brideMother: {
      bank: '륜알려주세요은행',
      accountNumber: '11111111111',
      holder: '곽광숙',
    },
  },

  // ============================================================
  // 12. 버튼/UI 텍스트
  // ============================================================
  ui: {
    copyAccount: '계좌번호 복사',
    copiedAccount: '✓ 복사되었습니다!',
    touchToEnlarge: '터치하여 확대',
    close: '닫기',
  },

  // ============================================================
  // 13. 푸터
  // ============================================================
  footer: {
    message: 'Made by 아롬',
    repository: 'https://github.com/RomRyun/Invitation',
    showRepository: true,  // GitHub 링크 표시 여부
  },
};
