// 청첩장 설정 파일
// 형식: 내용물 → 폰트 → 폰트사이즈 순서
// Hero(표지)는 px 단위 (디바이스 폰트 설정 무시)
// 나머지는 rem 단위 (디바이스 폰트 설정 반영)

// ===== 이미지 폴더 설정 =====
// '' = 기본 폴더 (public/)
// 'cartoon' = 카툰 스타일 (public/cartoon/)
export const imageFolder = 'cartoon';

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
    backgroundImage: imageFolder ? `/${imageFolder}/hero_main.jpg` : '/hero_main.jpg',
    
    // A. 영문 이름 1 (신랑)
    // ⚠️ 실제 사용 시 전체 이름을 입력하세요 (예: 'Lee Ah-rom', 'Kim Min-su')
    nameEn1: 'Eraenim',
    // ⚠️ 폰트 주의사항: La Paloma 폰트는 일부 문자만 포함된 subset 폰트입니다.
    // 실제 사용 시 필요한 모든 문자(A-Z, a-z, 특수문자 등)가 포함된 폰트 파일을 사용하거나,
    // 폰트 서브셋팅 도구로 필요한 문자만 추출하여 사용하세요.
    nameEn1Font: "'La Paloma', 'Great Vibes', cursive",
    nameEn1Size: '26px',
    
    // B. & 기호
    ampersand: '&',
    // ⚠️ 폰트 주의사항: La Paloma 폰트는 일부 문자만 포함된 subset 폰트입니다.
    ampersandFont: "'La Paloma', 'Great Vibes', cursive",
    ampersandSize: '18px',
    
    // C. 영문 이름 2 (신부)
    // ⚠️ 실제 사용 시 전체 이름을 입력하세요 (예: 'Shin Gyeong-ryun', 'Park So-young')
    nameEn2: 'Monnim',
    // ⚠️ 폰트 주의사항: La Paloma 폰트는 일부 문자만 포함된 subset 폰트입니다.
    // 실제 사용 시 필요한 모든 문자(A-Z, a-z, 특수문자 등)가 포함된 폰트 파일을 사용하거나,
    // 폰트 서브셋팅 도구로 필요한 문자만 추출하여 사용하세요.
    nameEn2Font: "'La Paloma', 'Great Vibes', cursive",
    nameEn2Size: '26px',
    
    // D. 한글 초대 문구
    inviteText: '이레님 ♥ 몬님의 결혼식에 초대합니다',
    inviteTextFont: "'KoPubWorldDotum', sans-serif",
    inviteTextSize: '16px',
    inviteTextWeight: 300,
    
    // E. 날짜
    // ⚠️ 실제 결혼식 날짜로 변경하세요 (예: '2026. 4. 18 (토) 오후 1시')
    dateDisplay: 'YYYY. M. D (요일) 오후 N시',
    dateDisplayFont: "'KoPubWorldDotum', sans-serif",
    dateDisplaySize: '22px',
    dateDisplayWeight: 300,
    
    // F. 장소
    // ⚠️ 실제 결혼식 장소로 변경하세요 (예: '서울 그랜드힐컨벤션웨딩', '부산 웨딩홀')
    venueShort: '지역명 웨딩홀 이름',
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
    groomImage: imageFolder ? `/${imageFolder}/groom.jpg` : '/groom.jpg',
    brideImage: imageFolder ? `/${imageFolder}/bride.jpg` : '/bride.jpg',
  },
  groom: {
    name: '이레님',
    fatherName: '이레 대디',
    motherName: '이레 마미',
    relation: '장남',
  },
  bride: {
    name: '몬님',
    fatherName: '몬 대디',
    motherName: '몬 마미',
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
      imageFolder ? `/${imageFolder}/gallery_1.jpg` : '/gallery_1.jpg',
      imageFolder ? `/${imageFolder}/gallery_2.jpg` : '/gallery_2.jpg',
      imageFolder ? `/${imageFolder}/gallery_3.jpg` : '/gallery_3.jpg',
      imageFolder ? `/${imageFolder}/gallery_4.jpg` : '/gallery_4.jpg',
      imageFolder ? `/${imageFolder}/gallery_5.jpg` : '/gallery_5.jpg',
      imageFolder ? `/${imageFolder}/gallery_6.jpg` : '/gallery_6.jpg',
      imageFolder ? `/${imageFolder}/gallery_7.jpg` : '/gallery_7.jpg',
      imageFolder ? `/${imageFolder}/gallery_8.jpg` : '/gallery_8.jpg',
      imageFolder ? `/${imageFolder}/gallery_9.jpg` : '/gallery_9.jpg',
      imageFolder ? `/${imageFolder}/gallery_10.jpg` : '/gallery_10.jpg',
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
      // ⚠️ 실제 웨딩홀 정보로 변경하세요
      name: '웨딩홀 이름',
      branch: '지점명',  // 지점이 없으면 빈 문자열 ''
      hall: '',  // 홀 이름 (예: '그랜드홀', '로즈홀')
      address: '주소를 입력하세요',  // 예: '서울특별시 강남구 테헤란로 123'
      addressDetail: '(상세 주소 정보)',  // 예: '(역삼동 456번지, 빌딩명)'
    },
    
    maps: {
      // ⚠️ 네이버 지도 링크 설정 방법:
      // 1. 네이버 지도(https://map.naver.com)에서 장소 검색
      // 2. 공유하기 버튼 클릭 > 링크 복사
      // 3. 복사한 링크를 여기에 붙여넣기 (예: https://naver.me/XXXXXXXXXX)
      naver: 'https://naver.me/XXXXXXXXXX',
      
      // ⚠️ 카카오맵 링크 설정 방법:
      // 1. 카카오맵(https://map.kakao.com)에서 장소 검색
      // 2. 공유하기 버튼 클릭 > 링크 복사
      // 3. 복사한 링크를 여기에 붙여넣기 (예: https://kko.kakao.com/XXXXXXXXXX)
      kakao: 'https://kko.kakao.com/XXXXXXXXXX',
      
      // ⚠️ T맵 링크 설정 방법:
      // 1. T맵(https://tmap.life)에서 장소 검색
      // 2. 공유하기 버튼 클릭 > 링크 복사
      // 3. 복사한 링크를 여기에 붙여넣기 (예: https://tmap.life/XXXXXXXXXX)
      tmap: 'https://tmap.life/XXXXXXXXXX',
      
      // 지도 이미지 파일 경로 (public/ 폴더 기준)
      image: '/map_image.png',
    },
    
    mapTabs: [
      { id: 'naver', label: '네이버 지도', openText: '네이버 지도에서 열기', color: '#03C75A', bgColor: 'rgba(3, 199, 90, 0.15)', borderColor: 'rgba(3, 199, 90, 0.3)' },
      { id: 'kakao', label: '카카오맵', openText: '카카오맵에서 열기', color: '#3C1E1E', bgColor: 'rgba(254, 229, 0, 0.2)', borderColor: 'rgba(254, 229, 0, 0.5)' },
      { id: 'tmap', label: 'T맵', openText: 'T맵에서 열기', color: '#E4002B', bgColor: 'rgba(228, 0, 43, 0.15)', borderColor: 'rgba(228, 0, 43, 0.3)' },
    ],
    
    addressLabel: '주소',
    transportLabel: '교통편',
    // ⚠️ 실제 교통편 정보로 변경하세요
    transportation: [
      '터미널명 | 자차 N분 · 대중교통 N분',
      '지하철역명 | 자차 N분 · 대중교통 N분',
      '고속도로IC명 | 자차 N분',
    ],
    // ⚠️ 실제 버스 노선 정보로 변경하세요 (버스 정보가 없으면 빈 문자열 '' 또는 주석 처리)
    busInfo: '버스 | 노선번호1, 노선번호2, 노선번호3',
  },

  // ============================================================
  // 6. 결혼식 날짜/시간
  // ============================================================
  wedding: {
    // ⚠️ 실제 결혼식 날짜와 시간으로 변경하세요
    date: 'YYYY-MM-DD',  // ISO 형식 (예: '2026-04-18')
    time: 'HH:MM',  // 24시간 형식 (예: '13:00', '14:30')
    year: 'YYYY년',  // 예: '2026년'
    monthDay: 'M월 D일',  // 예: '4월 18일'
    dayOfWeek: '요일',  // 예: '토요일', '일요일'
    timeText: '오후 N시',  // 예: '오후 1시', '오후 2시 30분'
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
      bank: '은행나무',
      accountNumber: '123-456-7890',
      holder: '이레님',
      phone: '010-1234-5678',
    },
    groomFather: {
      bank: '은행나무',
      accountNumber: '123-456-7890',
      holder: '이레 대디',
      phone: '010-1234-5678',
    },
    groomMother: {
      bank: '은행나무',
      accountNumber: '123-456-7890',
      holder: '이레 마미',
      phone: '010-1234-5678',
    },
    bride: {
      bank: '은행나무',
      accountNumber: '123-456-7890',
      holder: '몬님',
      phone: '010-1234-5678',
    },
    brideFather: {
      bank: '은행나무',
      accountNumber: '123-456-7890',
      holder: '몬 대디',
      phone: '010-1234-5678',
    },
    brideMother: {
      bank: '은행나무',
      accountNumber: '123-456-7890',
      holder: '몬 마미',
      phone: '010-1234-5678',
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
    message: 'Made by 이레님',
    repository: 'https://github.com/RomRyun/Invitation_Public',
    showRepository: true,
  },

  // ============================================================
  // 10. 카카오톡 공유 설정
  // ============================================================
  kakaoShare: {
    enabled: true,
    
    // ⚠️ 카카오 JavaScript 키 설정 방법:
    // 1. 카카오 개발자 콘솔 접속: https://developers.kakao.com
    // 2. 내 애플리케이션 > 앱 선택 > 앱 키
    // 3. JavaScript 키를 복사하여 아래에 붙여넣기
    //    (예: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6')
    javascriptKey: 'YOUR_KAKAO_JAVASCRIPT_KEY',
    
    // ⚠️ 카카오 메시지 템플릿 ID (선택사항):
    // 커스텀 템플릿을 사용하려면:
    // 1. 카카오 개발자 콘솔 > 도구 > 메시지 템플릿
    // 2. 템플릿 만들기 또는 기존 템플릿 ID 확인
    // 3. 템플릿 ID를 아래에 입력 (예: 123456)
    // 템플릿을 사용하지 않으면 null 또는 주석 처리
    templateId: null, // 또는 숫자로 템플릿 ID 입력 (예: 123456)
    
    // ⚠️ 기본 공유 설정 (템플릿 미사용 시 사용됨):
    title: '이레님 💍 몬님, 결혼합니다',
    description: '2026년 4월 18일 (토) 오후 1시\n청주 에스가든 웨딩 컨벤션',
    
    // ⚠️ 공유 이미지 URL 설정 방법:
    // 1. 청첩장을 배포한 후 (Vercel, Netlify 등)
    // 2. /public/preview.jpg 또는 /public/kakao_preview.jpg 파일이 배포된 URL
    // 3. 반드시 https://로 시작하는 공개 URL이어야 함
    // 4. 예: 'https://your-wedding-invitation.vercel.app/preview.jpg'
    imageUrl: 'https://your-wedding-invitation.vercel.app/preview.jpg',
    
    // ⚠️ 청첩장 배포 URL 설정 방법:
    // 1. Vercel, Netlify 등에 배포한 후
    // 2. 배포된 실제 URL을 아래에 입력
    // 3. 예: 'https://your-wedding-invitation.vercel.app/'
    webUrl: 'https://your-wedding-invitation.vercel.app/',
    
    // 버튼 텍스트
    buttonTitle: '청첩장 보기',
    shareButtonText: '카카오톡 공유하기',
  },

  // ============================================================
  // 11. 벚꽃잎 효과 (Cherry Blossom Petal Effect)
  // ============================================================
  sakuraPetal: {
    enabled: true,                    // 효과 활성화 여부
    petalImages: [                     // 벚꽃잎 이미지 파일들
      '/SakuraPetals01.png',
      '/SakuraPetals02.png',
      '/SakuraPetals03.png',
    ],
    count: 5,                          // 동시에 떨어지는 벚꽃잎 개수 (1.5배 증가: 3 → 5)
    size: {                            // 벚꽃잎 크기 (px)
      min: 25,
      max: 40,
    },
    duration: {                       // 떨어지는 시간 (초) - 더 빠르게
      min: 10,
      max: 18,
    },
    delay: {                           // 시작 지연 시간 (초) - 더 자주 나오도록
      min: 0,
      max: 5,
    },
    sway: {                            // 좌우 흔들림 범위 (px) - 나풀대는 효과
      min: 40,
      max: 100,
    },
    rotation: {                        // 회전 범위 (도) - 더 자연스럽게
      min: -180,
      max: 180,
    },
    opacity: {                         // 투명도 (알파)
      min: 0.6,
      max: 0.9,
    },
  },
};
