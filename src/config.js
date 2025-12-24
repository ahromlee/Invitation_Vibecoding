// 청첩장 설정 파일
// 페이지 순서대로 정리됨

// ===== 컬러 테마 =====
export const ColorTheme = {
  PINK: 1,
  GREEN: 2,
};

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
  // 테마 설정
  // ============================================================
  colorTheme: ColorTheme.GREEN,

  // ============================================================
  // 1. 첫 페이지 (Hero) - 영문 이름, 날짜, 장소
  // ============================================================
  hero: {
    // 영문 이름 (La Paloma 폰트)
    nameEn1: 'Lee Ah-rom',
    nameEn2: 'Shin Gyeong-ryun',
    // 한글 초대 문구
    inviteText: '이 아롬 신 경륜의 결혼식에 초대합니다.',
    // 날짜/시간
    dateDisplay: '2026. 4. 18 (Sat) PM 1',
    // 장소
    venueShort: '청주 에스가든 웨딩 컨벤션',
    // 배경 이미지
    backgroundImage: '/hero_main.jpg',
  },

  // ============================================================
  // 2. 인사말 섹션 (Greeting)
  // ============================================================
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
    // 픽셀아트 이미지
    pixelArt: '/pixel_art.gif',
  },

  // ============================================================
  // 3. 신랑/신부 정보
  // ============================================================
  groom: {
    name: '아롬',
    fatherName: '이원조',
    motherName: '이점숙',
    relation: '장남',
  },
  bride: {
    name: '경륜',
    fatherName: '신락현',
    motherName: '곽광숙',
    relation: '장녀',
  },

  // ============================================================
  // 4. 갤러리 섹션
  // ============================================================
  gallery: {
    title: '갤러리',
    images: [
      '/gallery_1.jpg',
      '/gallery_2.jpg',
      '/gallery_3.jpg',
      '/gallery_4.jpg',
    ],
  },

  // ============================================================
  // 5. 오시는 길 섹션 (Location)
  // ============================================================
  location: {
    title: '오시는 길',
    venue: {
      name: '에스가든웨딩홀',
      branch: '청주점',
      hall: '',
      address: '충청북도 청주시 서원구 1순환로 854',
      addressDetail: '(산남동 320번지, CJB미디어센터)',
    },
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
  },

  // ============================================================
  // 6. 결혼식 날짜/시간 (캘린더용)
  // ============================================================
  wedding: {
    date: '2026-04-18',
    time: '13:00',
    year: '2026년',
    monthDay: '4월 18일',
    dayOfWeek: '토요일',
    timeText: '오후 1시',
  },

  // ============================================================
  // 7. 계좌 섹션 (Account)
  // ============================================================
  account: {
    title: '마음 전하실 곳',
    groom: {
      bank: '신한은행',
      accountNumber: '110-482-263062',
      holder: '이아롬',
    },
    groomFather: {
      bank: '농협',
      accountNumber: '246-02-228936',
      holder: '이원조',
    },
    groomMother: {
      bank: '농협',
      accountNumber: '246-02-138021',
      holder: '이점숙',
    },
    bride: {
      bank: '국민은행',
      accountNumber: '404015-2900197-01',
      holder: '신경륜',
    },
    brideFather: {
      bank: '은행명입력',
      accountNumber: '계좌번호입력',
      holder: '신락현',
    },
    brideMother: {
      bank: '은행명입력',
      accountNumber: '계좌번호입력',
      holder: '곽광숙',
    },
  },

  // ============================================================
  // 8. 푸터
  // ============================================================
  footer: {
    message: 'Made by 아롬',
    repository: 'https://github.com/RomRyun/Invitation',
    showRepository: true,
  },
};
