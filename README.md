# 💒 모바일 청첩장

> 아롬 ♥ 경륜의 결혼을 알리는 모바일 청첩장입니다.

<p align="center">
  <img src="https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite" />
  <img src="https://img.shields.io/badge/Framer_Motion-11.x-FF0055?style=flat-square&logo=framer" />
</p>

---

## ✨ 주요 기능

### 🎨 디자인 & UI
- **글래스모피즘 UI** - 모던하고 세련된 반투명 카드 디자인
- **부드러운 애니메이션** - Framer Motion 기반 스크롤/인터랙션 애니메이션
- **커스텀 컬러 테마** - `config.js`에서 테마 색상 자유롭게 변경
- **모바일 퍼스트** - 모바일 최적화, PC에서도 깔끔하게 표시

### 📱 핵심 기능
- **플로팅 목차** - 원터치로 원하는 섹션으로 이동
- **갤러리** - 스와이프로 사진 넘기기, 핀치 투 줌 확대
- **지도 연동** - 네이버/카카오/T맵 바로가기
- **계좌번호 복사** - 원클릭 계좌번호 복사
- **D-Day 카운트다운** - 결혼식까지 남은 날짜 표시
- **이미지 보호** - 우클릭/드래그/길게 누르기 저장 방지

### 🔧 설정 가능 항목
- **이미지 폴더 선택** - 기본/Cartoon 등 이미지 세트 전환
- **벚꽃잎 효과** - 화면에 떨어지는 벚꽃잎 애니메이션
- **모든 텍스트/폰트** - `config.js`에서 완전 커스터마이징

---

## 🛠️ 기술 스택

| 분류 | 기술 |
|------|------|
| Frontend | React 18, Vite 5 |
| Animation | Framer Motion 11 |
| Styling | Tailwind CSS |
| Deployment | Vercel |

---

## 🚀 시작하기

### 설치
```bash
npm install
```

### 개발 서버
```bash
npm run dev
```

### 빌드
```bash
npm run build
```

---

## ⚙️ 설정

모든 텍스트와 설정은 `src/config.js`에서 관리됩니다.

### 이미지 폴더 설정
```javascript
// '' = 기본 폴더 (public/)
// 'Cartoon' = 카툰 스타일 (public/Cartoon/)
export const imageFolder = 'Cartoon';
```

### 주요 설정 항목
```javascript
export const config = {
  // 히어로 섹션
  hero: {
    backgroundImage: '/hero_main.jpg',
    nameEn1: 'Lee Ah-rom',
    nameEn2: 'Shin Gyeong-ryun',
    // ...
  },
  
  // 신랑/신부 정보
  groom: { name: '아롬', fatherName: '이원조', ... },
  bride: { name: '경륜', fatherName: '신락현', ... },
  
  // 결혼식 정보
  wedding: { date: '2026-04-18', time: '13:00', ... },
  
  // 갤러리 설정
  gallery: {
    images: [...],
    protectImages: true,  // 이미지 보호 기능
  },
  
  // 벚꽃잎 효과
  sakuraPetal: {
    enabled: true,
    count: 3,
    // ...
  },
};
```

---

## 📁 이미지 가이드

`public/` 폴더에 이미지를 넣어주세요:

| 파일명 | 용도 | 권장 사이즈 |
|--------|------|-------------|
| `hero_main.jpg` | 히어로 배경 | 1080×1440 (3:4) |
| `groom.jpg` / `bride.jpg` | 신랑/신부 사진 | 400×400 (1:1) |
| `gallery_1.jpg` ~ `gallery_10.jpg` | 갤러리 | 1080×1350 (4:5) |
| `SakuraPetals01~03.png` | 벚꽃잎 이미지 | 투명 PNG |

### Cartoon 폴더
`public/Cartoon/` 폴더에 동일한 파일명으로 이미지를 넣으면 `imageFolder` 설정으로 전환 가능합니다.

---

## 🌐 배포

[Vercel](https://vercel.com)에 배포하면 자동으로 HTTPS가 적용됩니다.

```bash
# Vercel CLI로 배포
npx vercel --prod
```

또는 GitHub 연동 후 자동 배포 설정

---

## 🤝 개발 크레딧

### 직접 개발
- 전체 UI/UX 설계 및 구현
- React 컴포넌트 구조 설계
- Framer Motion 애니메이션 시스템
- 반응형 레이아웃 구현
- 계좌번호 복사 기능
- 지도 연동 (네이버/카카오/T맵)
- D-Day 카운트다운
- 플로팅 네비게이션
- config.js 기반 설정 시스템

### Cursor AI 도움
다음 기능들은 [Cursor](https://cursor.sh/) AI의 도움을 받아 구현했습니다:
- 🌸 벚꽃잎 떨어지는 애니메이션 효과
- 🔒 초기 화면 스크롤 잠금 기능
- 🎭 마스킹을 통한 메인 페이지 로딩 연출 (딜레이 처리)
- 🔍 갤러리 이미지 확대 팝업 (핀치 투 줌)
- 🔤 폰트 리사이징 시스템

---

## 📝 라이선스

MIT License

---

<p align="center">
  Made with ♥ by RomRyun
</p>
