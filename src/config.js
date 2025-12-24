// 청첩장 설정 파일
// 형식: 내용물 → 폰트 → 폰트사이즈 순서
// Hero(표지)는 px 단위 (디바이스 폰트 설정 무시)
// 나머지는 rem 단위 (디바이스 폰트 설정 반영)

// ===== 테마 색상 =====
export const theme = {
  bgColor: '#E5E1D8',
  accentSolid: '#8B6D4C',
  indicatorActive: '#8B6D4C',
  indicatorInactive: '#d1d5db',
  galleryErrorBg: 'linear-gradient(to bottom right, #F5F0E8, #E5E1D8)',
};

export const config = {
  // ============================================================
  // 1. Hero (표지) - ⚠️ px 단위: 디바이스 폰트 설정 무시
  // ============================================================
  hero: {
    backgroundImage: '/hero_main.jpg',
    
    // A. 영문 이름 1 (신랑)
    nameEn1: 'Lee Ah-rom',
    nameEn1Font: "'La Paloma', 'Great Vibes', cursive",
    nameEn1Size: 'clamp(24px, 5vw, 38px)',
    
    // B. & 기호
    ampersand: '&',
    ampersandFont: "'La Paloma', 'Great Vibes', cursive",
    ampersandSize: 'clamp(16px, 2.5vw, 22px)',
    
    // C. 영문 이름 2 (신부)
    nameEn2: 'Shin Gyeong-ryun',
    nameEn2Font: "'La Paloma', 'Great Vibes', cursive",
    nameEn2Size: 'clamp(24px, 5vw, 38px)',
    
    // D. 한글 초대 문구
    inviteText: '아롬 ♥ 경륜의 결혼식에 초대합니다',
    inviteTextFont: "'NanumMinkyung', 'Pretendard', sans-serif",
    inviteTextSize: 'clamp(18px, 3vw, 20px)',
    
    // E. 날짜
    dateDisplay: '2026. 4. 18 (토) 오후 1시',
    dateDisplayFont: "'NanumMinkyung', 'Pretendard', sans-serif",
    dateDisplaySize: 'clamp(24px, 4.5vw, 29px)',
    
    // F. 장소
    venueShort: '청주 에스가든 웨딩 컨벤션',
    venueShortFont: "'NanumMinkyung', 'Pretendard', sans-serif",
    venueShortSize: 'clamp(21px, 3vw, 24px)',
    
    // G. 스크롤 안내
    scrollText: 'SCROLL',
  },

  // ============================================================
  // 2. 인사말 섹션
  // ============================================================
  greeting: {
    // A. 타이틀 (주석 처리)
    // title: '"서로를 비추는 별이 되려 합니다"',
    // titleFont: "'MapoFlowerIsland', 'Gowun Batang', serif",
    // titleSize: '1.5rem',
    
    // B. 메인 메시지 (주석 처리)
    // message: [
    //   '각자의 밤 하늘을 수놓던 별빛들이 만나',
    //   '서로를 비추는 아름다운 은하수가 되고자 합니다.',
    // ],
    
    // C. 서브 메시지 (주석 처리)
    // subMessage: [
    //   '이 설레이는 소중한 시작의 자리에',
    //   '귀한 걸음 하시어 저희와 함께 해주세요.',
    // ],
    
    // ★ 육행시 (이아롬 + 신경륜)
    // 첫 글자가 Bold 처리됨
    poem: [
      // 이아로(롬)
      { first: '이', rest: '토록 고요한 밤하늘 아래' },
      { first: '아', rest: '스라이 홀로 빛나던 별들이 만나' },
      { first: '로마', rest: ' 신화 속 별자리처럼 함께 하고자 합니다' },
      // 신경륜
      { first: '신', rest: '비롭고 설레이는 이 첫걸음의 자리에' },
      { first: '경', rest: '건한 마음으로 소중한 분들을 초대하오니' },
      { first: '륜', rest: '슬처럼 반짝일 우리의 시작에 함께 해주십시오' },
    ],
    poemFont: "'MapoFlowerIsland', 'Gowun Batang', serif",
    poemSize: '0.9375rem',
    
    // D. 픽셀아트
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
    titleFont: "'MapoFlowerIsland', 'Gowun Batang', serif",
    titleSize: '1.5rem',
    images: [
      '/gallery_1.jpg',
      '/gallery_2.jpg',
      '/gallery_3.jpg',
      '/gallery_4.jpg',
    ],
    touchHint: '터치하여 확대',
  },

  // ============================================================
  // 5. 오시는 길 섹션
  // ============================================================
  location: {
    title: '오시는 길',
    titleFont: "'MapoFlowerIsland', 'Gowun Batang', serif",
    titleSize: '1.5rem',
    
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
    
    mapTabs: [
      { id: 'naver', label: '네이버 지도', openText: '네이버 지도에서 열기', color: '#03C75A', bgColor: 'rgba(3, 199, 90, 0.15)', borderColor: 'rgba(3, 199, 90, 0.3)' },
      { id: 'kakao', label: '카카오맵', openText: '카카오맵에서 열기', color: '#3C1E1E', bgColor: 'rgba(254, 229, 0, 0.2)', borderColor: 'rgba(254, 229, 0, 0.5)' },
      { id: 'tmap', label: 'T맵', openText: 'T맵에서 열기', color: '#E4002B', bgColor: 'rgba(228, 0, 43, 0.15)', borderColor: 'rgba(228, 0, 43, 0.3)' },
    ],
    
    addressLabel: '주소',
    transportLabel: '교통편',
    transportation: [
      '남부터미널 | 자차 5분 · 대중교통 20분',
      '가경시외버스터미널 | 자차 10분 · 대중교통 30분',
      '서청주IC | 자차 15분',
    ],
    busInfo: '버스 | 30-1, 30-2, 710, 843, 851',
  },

  // ============================================================
  // 6. 결혼식 날짜/시간
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
  // 7. 계좌 섹션
  // ============================================================
  account: {
    title: '마음 전하실 곳',
    titleFont: "'MapoFlowerIsland', 'Gowun Batang', serif",
    titleSize: '1.5rem',
    
    groomSideLabel: '신랑측',
    brideSideLabel: '신부측',
    roles: {
      groom: '신랑',
      bride: '신부',
      father: '아버지',
      mother: '어머니',
    },
    
    copyButton: '계좌번호 복사하기',
    copyComplete: '✓ 복사 완료!',
    holderLabel: '예금주',
    
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
      bank: '',
      accountNumber: '',
      holder: '신락현',
    },
    brideMother: {
      bank: '',
      accountNumber: '',
      holder: '곽광숙',
    },
  },

  // ============================================================
  // 8. 메뉴 (플로팅 목차)
  // ============================================================
  menu: [
    { id: 'greeting', label: '인사말' },
    { id: 'gallery', label: '갤러리' },
    { id: 'location', label: '오시는 길' },
    { id: 'account', label: '마음 전하실 곳' },
  ],

  // ============================================================
  // 9. 푸터
  // ============================================================
  footer: {
    message: 'Made by 아롬',
    repository: 'https://github.com/RomRyun/Invitation',
    showRepository: true,
  },
};
