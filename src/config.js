// 청첩장 설정 파일
// 페이지 순서대로 정리됨

// ===== 베이지 테마 색상 =====
export const theme = {
  // 배경
  bgColor: '#E5E1D8',
  bgGradient: 'linear-gradient(to bottom, #E5E1D8, #F5F0E8)',
  
  // 강조색 (브라운/골드 계열)
  accent: 'rgba(139, 109, 76, 0.85)',
  accentSolid: '#8B6D4C',
  accentLight: 'rgba(139, 109, 76, 0.15)',
  
  // 하트/포인트
  heart: '#C9A87C',
  
  // 갤러리 에러 배경
  galleryErrorBg: 'linear-gradient(to bottom right, #F5F0E8, #E5E1D8)',
  
  // 인디케이터
  indicatorActive: '#8B6D4C',
  indicatorInactive: '#d1d5db',
  
  // 텍스트
  textDark: '#374151',
  textMuted: '#6b7280',
  textLight: '#9ca3af',
};

export const config = {
  // ============================================================
  // 1. 첫 페이지 (Hero) - 영문 이름, 날짜, 장소
  // ============================================================
  hero: {
    // 배경 이미지
    backgroundImage: '/hero_main.jpg',
    
    // --- A. 영문 이름 1 (신랑) ---
    nameEn1: 'Lee Ah-rom',
    nameEn1Size: 'clamp(1.5rem, 5vw, 2.4rem)',
    
    // --- B. & 기호 ---
    ampersand: '&',
    ampersandSize: 'clamp(1rem, 2.5vw, 1.4rem)',
    
    // --- C. 영문 이름 2 (신부) ---
    nameEn2: 'Shin Gyeong-ryun',
    nameEn2Size: 'clamp(1.5rem, 5vw, 2.4rem)',
    
    // --- D. 한글 초대 문구 ---
    inviteText: '아롬 ♥ 경륜의 결혼식에 초대합니다',
    inviteTextSize: 'clamp(0.95rem, 3vw, 1.15rem)',
    
    // --- E. 날짜/시간 ---
    dateDisplay: '2026. 4. 18 (Sat) PM 1',
    dateDisplaySize: 'clamp(1.3rem, 4.5vw, 1.8rem)',
    
    // --- F. 장소 ---
    venueShort: '청주 에스가든 웨딩 컨벤션',
    venueShortSize: 'clamp(0.95rem, 3vw, 1.15rem)',
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
