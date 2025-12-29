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
  // 1. Hero (표지) - ⚠️ 고정 px 단위: 디바이스 폰트 설정 무시
  // ============================================================
  hero: {
    backgroundImage: '/hero_main.jpg',
    
    // A. 영문 이름 1 (신랑)
    nameEn1: 'Lee Ah-rom',
    nameEn1Font: "'La Paloma', 'Great Vibes', cursive",
    nameEn1Size: '26px',
    
    // B. & 기호
    ampersand: '&',
    ampersandFont: "'La Paloma', 'Great Vibes', cursive",
    ampersandSize: '18px',
    
    // C. 영문 이름 2 (신부)
    nameEn2: 'Shin Gyeong-ryun',
    nameEn2Font: "'La Paloma', 'Great Vibes', cursive",
    nameEn2Size: '26px',
    
    // D. 한글 초대 문구
    inviteText: '아롬 ♥ 경륜의 결혼식에 초대합니다',
    inviteTextFont: "'KoPubWorldDotum', sans-serif",
    inviteTextSize: '16px',
    inviteTextWeight: 300,
    
    // E. 날짜
    dateDisplay: '2026. 4. 18 (토) 오후 1시',
    dateDisplayFont: "'KoPubWorldDotum', sans-serif",
    dateDisplaySize: '22px',
    dateDisplayWeight: 300,
    
    // F. 장소
    venueShort: '청주 에스가든 웨딩 컨벤션',
    venueShortFont: "'KoPubWorldDotum', sans-serif",
    venueShortSize: '20px',
    venueShortWeight: 300,
    
    // G. 스크롤 안내
    scrollText: 'SCROLL',
  },

  // ============================================================
  // 2. 인사말 섹션
  // ============================================================
  greeting: {
    // A. 타이틀
    title: '초 대',
    titleFont: "'MapoFlowerIsland', 'Gowun Batang', serif",
    titleSize: '1.5rem',
    
    // B. 인사말 메시지
    message: [
      '소중한 분들을 모시고',
      '따사로운 봄날에 결혼합니다.',
    ],
    subMessage: [
      '부디 귀한 걸음 함께 하시어',
      '축복해주시면 감사하겠습니다.',
    ],
    messageFont: "'KoPubWorldDotum', sans-serif",
    messageSize: '1rem',
    messageColor: '#8B6D4C',
    
    // ★ 육행시 (주석처리)
    // poem: [
    //   { first: '이', rest: '렇게 우리 두 사람이' },
    //   { first: '아', rest: '름다운 만남을 시작했습니다' },
    //   { first: '롬', rest: '륜 커플이' },
    //   { first: '신', rest: '혼을 시작하려고 합니다' },
    //   { first: '경', rest: '사로운 날을 축하해주시고' },
    //   { first: '륜', rest: '택한 삶을 만들어가겠습니다' },
    // ],
    // poemFont: "'NanumYeDang', sans-serif",
    // poemSize: '1.05rem',
  },

  // ============================================================
  // 3. 신랑/신부 정보
  // ============================================================
  couple: {
    title: '신 랑  신 부',
    titleFont: "'MapoFlowerIsland', 'Gowun Batang', serif",
    titleSize: '1.5rem',
    groomImage: '/groom.jpg',
    brideImage: '/bride.jpg',
  },
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
    title: '갤 러 리',
    titleFont: "'MapoFlowerIsland', 'Gowun Batang', serif",
    titleSize: '1.5rem',
    images: [
      '/gallery_1.jpg',
      '/gallery_2.jpg',
      '/gallery_3.jpg',
      '/gallery_4.jpg',
      '/gallery_5.jpg',
      '/gallery_6.jpg',
      '/gallery_7.jpg',
      '/gallery_8.jpg',
      '/gallery_9.jpg',
      '/gallery_10.jpg',
    ],
    touchHint: '터치하여 확대',
    
    // 이미지 보호 (우클릭, 길게 누르기, 드래그 저장 방지)
    protectImages: true,
  },

  // ============================================================
  // 5. 오시는 길 섹션
  // ============================================================
  location: {
    title: '오 시 는  길',
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
    title: '마 음  전 하 실  곳',
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
      phone: '010-2286-0608',
    },
    groomFather: {
      bank: '농협',
      accountNumber: '246-02-228936',
      holder: '이원조',
      phone: '010-5652-0359',
    },
    groomMother: {
      bank: '농협',
      accountNumber: '246-02-138021',
      holder: '이점숙',
      phone: '010-5190-0359',
    },
    bride: {
      bank: '국민은행',
      accountNumber: '746702-01-202912',
      holder: '신경륜',
      phone: '010-5385-8717',
    },
    brideFather: {
      bank: '농협',
      accountNumber: '401145-51-016954',
      holder: '신락현',
      phone: '010-3909-7045',
    },
    brideMother: {
      bank: '우리',
      accountNumber: '2761-9679-502001',
      holder: '곽광숙',
      phone: '010-8359-6774',
    },
    
    callButton: '📞 전화하기',
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
