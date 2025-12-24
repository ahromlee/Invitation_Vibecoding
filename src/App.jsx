import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { config, colorPalettes } from './config';
import './App.css';

// 현재 테마 색상
const theme = colorPalettes[config.colorTheme];

function App() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [copied, setCopied] = useState({ 
    groom: false, bride: false, 
    groomFather: false, groomMother: false,
    brideFather: false, brideMother: false 
  });
  const [expandedAccount, setExpandedAccount] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [activeMapTab, setActiveMapTab] = useState('naver');
  const [activeCalendarTab, setActiveCalendarTab] = useState('google');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const touchStartTime = useRef(0);
  const touchMoved = useRef(false);
  
  // 갤러리 Section scroll-linked zoom
  const galleryRef = useRef(null);
  const { scrollYProgress: galleryScrollProgress } = useScroll({
    target: galleryRef,
    offset: ["start end", "end start"]
  });
  
  // 갤러리 이미지가 스크롤에 따라 확대되는 효과
  const galleryScale = useTransform(galleryScrollProgress, [0, 0.3, 0.7, 1], [0.85, 1, 1, 0.95]);
  const galleryOpacity = useTransform(galleryScrollProgress, [0, 0.2, 0.8, 1], [0.6, 1, 1, 0.6]);
  const galleryY = useTransform(galleryScrollProgress, [0, 0.5, 1], [50, 0, -30]);
  
  // 첫 페이지 Hero 섹션 - Zoom out + PNG 마스크 reveal 효과
  const heroRef = useRef(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  // Zoom out 효과: 처음에 확대 → 스크롤하면 전체 이미지로
  const imageScale = useTransform(heroProgress, [0, 0.6], [1.8, 1]);
  // 마스크 크기: 0% → 100% (스크롤하면 벗겨짐)
  const maskSize = useTransform(heroProgress, [0, 0.5], [0, 150]);
  // 텍스트는 계속 유지
  const textY = useTransform(heroProgress, [0.6, 0.9], [0, -20]);

  // 목차 데이터
  const menuItems = [
    { id: 'greeting', label: '인사말' },
    { id: 'story', label: '우리의 이야기' },
    { id: 'gallery', label: '갤러리' },
    { id: 'location', label: '오시는 길' },
    // { id: 'dday', label: 'D-Day' },
    // { id: 'calendar', label: '캘린더' },
    { id: 'account', label: '마음 전하실 곳' },
  ];

  // 메뉴 아이템 클릭 시 스크롤
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  // D-Day 카운터
  useEffect(() => {
    const targetDate = new Date(`${config.wedding.date}T${config.wedding.time}:00`).getTime();
    
    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  // 계좌번호 복사 함수
  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied({ ...copied, [type]: true });
      setTimeout(() => {
        setCopied({ ...copied, [type]: false });
      }, 2000);
    });
  };

  // 갤러리 이미지 배열
  const galleryImages = config.gallery.filter(Boolean);

  // 갤러리 스와이프 핸들러 (터치)
  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
    setStartY(e.touches[0].clientY);
    setIsDragging(true);
    touchStartTime.current = Date.now();
    touchMoved.current = false;
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = startX - currentX;
    const diffY = startY - currentY;

    // 수평 이동이 수직 이동보다 크면 스와이프로 판단
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 30) {
      touchMoved.current = true;
      if (Math.abs(diffX) > 50) {
        if (diffX > 0 && currentImageIndex < galleryImages.length - 1) {
          setCurrentImageIndex(currentImageIndex + 1);
          setIsDragging(false);
        } else if (diffX < 0 && currentImageIndex > 0) {
          setCurrentImageIndex(currentImageIndex - 1);
          setIsDragging(false);
        }
      }
    }
  };

  const handleTouchEnd = () => {
    const touchDuration = Date.now() - touchStartTime.current;
    // 짧은 터치 + 이동 없음 = 탭 (이미지 확대)
    if (touchDuration < 200 && !touchMoved.current) {
      setModalImageIndex(currentImageIndex);
      setShowModal(true);
    }
    setIsDragging(false);
  };

  // 마우스 핸들러 (PC용)
  const handleMouseDown = (e) => {
    setStartX(e.clientX);
    setIsDragging(true);
    touchMoved.current = false;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    const diffX = startX - currentX;

    if (Math.abs(diffX) > 30) {
      touchMoved.current = true;
    }

    if (Math.abs(diffX) > 50) {
      if (diffX > 0 && currentImageIndex < galleryImages.length - 1) {
        setCurrentImageIndex(currentImageIndex + 1);
        setIsDragging(false);
      } else if (diffX < 0 && currentImageIndex > 0) {
        setCurrentImageIndex(currentImageIndex - 1);
        setIsDragging(false);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 이미지 클릭 (PC용 확대)
  const handleImageClick = (e) => {
    if (!touchMoved.current) {
      setModalImageIndex(currentImageIndex);
      setShowModal(true);
    }
  };

  // 모달 닫기
  const closeModal = () => {
    setShowModal(false);
  };

  // ICS 파일 다운로드 함수
  const downloadICS = () => {
    const dateFormatted = config.wedding.date.replace(/-/g, '');
    const timeFormatted = config.wedding.time.replace(':', '') + '00';
    
    const event = {
      title: `${config.groom.name} & ${config.bride.name} 결혼식`,
      description: `${config.venue.name}에서 열리는 결혼식에 초대합니다.`,
      location: `${config.venue.name} (${config.venue.address})`,
    };

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Wedding Invitation//KR
BEGIN:VEVENT
UID:wedding-${config.wedding.date}@invitation
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${dateFormatted}T${timeFormatted}
DTEND:${dateFormatted}T${String(parseInt(config.wedding.time.split(':')[0]) + 2).padStart(2, '0')}0000
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'wedding-invitation.ics';
    link.click();
  };

  // 지도 탭 데이터
  const mapTabs = [
    { id: 'naver', label: '네이버 지도', color: '#03C75A' },
    { id: 'kakao', label: '카카오맵', color: '#FEE500' },
    { id: 'tmap', label: 'T맵', color: '#E4002B' },
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: theme.bgGradient 
    }}>
      {/* 이미지 확대 모달 */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
              cursor: 'pointer'
            }}
          >
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              src={galleryImages[modalImageIndex]}
              alt="확대 이미지"
              onClick={(e) => e.stopPropagation()}
              style={{
                maxWidth: '100%',
                maxHeight: '90vh',
                objectFit: 'contain',
                borderRadius: '0.5rem',
                cursor: 'default'
              }}
            />
            {/* 닫기 버튼 */}
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontSize: '1.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>
            {/* 이미지 인디케이터 */}
            <div style={{
              position: 'absolute',
              bottom: '2rem',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '0.5rem'
            }}>
              {galleryImages.map((_, index) => (
                <div
                  key={index}
                  style={{
                    width: index === modalImageIndex ? '1.5rem' : '0.5rem',
                    height: '0.5rem',
                    borderRadius: '9999px',
                    backgroundColor: index === modalImageIndex ? 'white' : 'rgba(255, 255, 255, 0.4)',
                    transition: 'all 300ms'
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Zoom Out + 마스크 Reveal 효과 - 첫 페이지 */}
      <section 
        ref={heroRef}
        style={{
          height: '300vh',
          position: 'relative'
        }}
      >
        <div style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          backgroundColor: '#0a0a0a'
        }}>
          {/* 배경 이미지 - Zoom out 효과 + 마스크 */}
          <motion.div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              scale: imageScale,
              // PNG 마스크 또는 radial-gradient 마스크
              WebkitMaskImage: useTransform(maskSize, (size) => 
                `radial-gradient(circle at 50% 50%, black ${size}%, transparent ${size + 5}%)`
              ),
              maskImage: useTransform(maskSize, (size) => 
                `radial-gradient(circle at 50% 50%, black ${size}%, transparent ${size + 5}%)`
              )
            }}
          >
            <img 
              src="/hero_main.jpg"
              alt="Wedding"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 40%'
              }}
            />
            {/* 이미지 위 오버레이 - 텍스트 가독성 */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.3) 100%)'
            }} />
          </motion.div>

          {/* 텍스트 콘텐츠 - 항상 보임 */}
          <motion.div
            style={{
              position: 'relative',
              zIndex: 10,
              textAlign: 'center',
              color: 'white',
              padding: '2rem',
              y: textY
            }}
          >
            {/* 영문 타이틀 - La Paloma */}
            <motion.div
              style={{ marginBottom: '1.2rem' }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            >
              <span style={{
                fontFamily: "'La Paloma', 'Great Vibes', cursive",
                fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
                fontWeight: 400,
                letterSpacing: '0.02em',
                textShadow: '0 2px 25px rgba(0,0,0,0.7)',
                display: 'inline'
              }}>
                Lee Ah-rom
              </span>
              <span style={{
                fontFamily: "'La Paloma', 'Great Vibes', cursive",
                fontSize: 'clamp(1rem, 3vw, 1.5rem)',
                fontWeight: 400,
                textShadow: '0 2px 25px rgba(0,0,0,0.7)',
                margin: '0 0.3rem',
                display: 'inline'
              }}>
                &
              </span>
              <span style={{
                fontFamily: "'La Paloma', 'Great Vibes', cursive",
                fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
                fontWeight: 400,
                letterSpacing: '0.02em',
                textShadow: '0 2px 25px rgba(0,0,0,0.7)',
                display: 'inline'
              }}>
                Shin Gyeong-ryun
              </span>
            </motion.div>

            {/* 한글 초대 문구 */}
            <motion.p
              style={{
                fontFamily: "'NanumMinkyung', 'Pretendard', sans-serif",
                fontSize: 'clamp(0.9rem, 2.8vw, 1.1rem)',
                fontWeight: 400,
                letterSpacing: '0.08em',
                marginBottom: '1.5rem',
                textShadow: '0 1px 20px rgba(0,0,0,0.7)'
              }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              이 아롬 신 경륜의 결혼식에 초대합니다.
            </motion.p>

            {/* 날짜 */}
            <motion.div
              style={{
                fontFamily: "'NanumMinkyung', 'Pretendard', sans-serif",
                fontSize: 'clamp(1.2rem, 4vw, 1.6rem)',
                fontWeight: 400,
                letterSpacing: '0.05em',
                marginBottom: '0.4rem',
                textShadow: '0 2px 20px rgba(0,0,0,0.7)'
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              2026. 4. 18 (Sat) PM 1
            </motion.div>

            {/* 장소 */}
            <motion.p
              style={{
                fontFamily: "'NanumMinkyung', 'Pretendard', sans-serif",
                fontSize: 'clamp(0.9rem, 2.8vw, 1.1rem)',
                fontWeight: 400,
                letterSpacing: '0.03em',
                textShadow: '0 1px 20px rgba(0,0,0,0.7)'
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.5 }}
            >
              청주 에스가든 웨딩 컨벤션
            </motion.p>
          </motion.div>

          {/* 스크롤 안내 - 마스크 위에 */}
          <motion.div
            style={{
              position: 'absolute',
              bottom: '2.5rem',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 20,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              opacity: useTransform(heroProgress, [0, 0.15], [1, 0])
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.8 }}
          >
            <span style={{
              fontFamily: "'Pretendard', sans-serif",
              fontSize: '0.6rem',
              color: 'rgba(255,255,255,0.8)',
              letterSpacing: '0.25em',
              fontWeight: 400
            }}>
              SCROLL
            </span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg style={{ width: '1rem', height: '1rem', color: 'rgba(255,255,255,0.8)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 인사말 Section */}
      <section id="greeting" className="py-16">
        <div className="container">
          <motion.div
            style={{
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
              borderRadius: '1rem',
              padding: '2rem',
              boxShadow: '0 8px 32px 0 rgba(0,0,0,0.06)',
              border: '1px solid rgba(255, 255, 255, 0.8)'
            }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* 섹션 타이틀 - reveal 효과 */}
            <motion.h2 
              style={{
                fontFamily: "'MapoFlowerIsland', 'Gowun Batang', serif",
                fontSize: '1.5rem',
                fontWeight: 400,
                textAlign: 'center',
                marginBottom: '2rem',
                color: '#374151',
                letterSpacing: '0.15em'
              }}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {config.sectionTitles.greeting}
            </motion.h2>
            
            {/* 인사말 텍스트 - 한 줄씩 순차 reveal */}
            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              color: '#4b5563',
              lineHeight: 1.8,
              fontSize: '0.9375rem',
              textAlign: 'center'
            }}>
              {/* 메인 메시지 - 각 줄이 순차적으로 나타남 */}
              <div style={{ fontWeight: 300 }}>
                {config.greeting.message.map((line, i) => (
                  <motion.p 
                    key={i}
                    style={{ marginBottom: '0.25rem' }}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ 
                      duration: 0.5, 
                      delay: 0.3 + (i * 0.1),
                      ease: "easeOut"
                    }}
                  >
                    {line}
                  </motion.p>
                ))}
              </div>
              
              {/* 서브 메시지 - 약간의 딜레이 후 나타남 */}
              <div style={{ fontWeight: 300, paddingTop: '0.5rem' }}>
                {config.greeting.subMessage.map((line, i) => (
                  <motion.p 
                    key={i}
                    style={{ marginBottom: '0.25rem' }}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ 
                      duration: 0.5, 
                      delay: 0.5 + (config.greeting.message.length * 0.1) + (i * 0.1),
                      ease: "easeOut"
                    }}
                  >
                    {line}
                  </motion.p>
                ))}
              </div>
            </div>
            
            {/* 부모님 소개 - 구분선 애니메이션 + 순차 등장 */}
            <motion.div 
              style={{
                marginTop: '2.5rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid rgba(229, 231, 235, 0.6)',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                color: '#4b5563',
                fontSize: '0.875rem'
              }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <motion.p 
                style={{ fontWeight: 300 }}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                {config.groom.fatherName} · {config.groom.motherName}의 {config.groom.relation} <strong style={{ fontWeight: 500 }}>{config.groom.name}</strong>
              </motion.p>
              <motion.p 
                style={{ fontWeight: 300 }}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1.0 }}
              >
                {config.bride.fatherName} · {config.bride.motherName}의 {config.bride.relation} <strong style={{ fontWeight: 500 }}>{config.bride.name}</strong>
              </motion.p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 픽셀아트 Section - 강화된 애니메이션 */}
      <section id="story" className="py-16">
        <div className="container">
          <motion.div
            style={{
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
              borderRadius: '1rem',
              padding: '2rem',
              boxShadow: '0 8px 32px 0 rgba(0,0,0,0.06)',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              overflow: 'hidden'
            }}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* 섹션 타이틀 - reveal 효과 */}
            <motion.h2 
              style={{
                fontFamily: "'MapoFlowerIsland', 'Gowun Batang', serif",
                fontSize: '1.5rem',
                fontWeight: 400,
                textAlign: 'center',
                marginBottom: '2rem',
                color: '#374151',
                letterSpacing: '0.15em'
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {config.sectionTitles.story}
            </motion.h2>
            
            {/* 픽셀아트 이미지 - scale-up 등장 효과 */}
            <motion.div 
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '200px'
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.8, 
                delay: 0.3,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              <motion.img 
                src={config.pixelArt}
                alt="픽셀아트" 
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: '0.75rem',
                  boxShadow: '0 4px 16px 0 rgba(0,0,0,0.08)'
                }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  const errorDiv = e.target.nextElementSibling;
                  if (errorDiv) {
                    errorDiv.style.display = 'block';
                  }
                }}
              />
              <div style={{
                display: 'none',
                textAlign: 'center',
                color: '#6b7280',
                padding: '2rem 0',
                fontSize: '0.875rem',
                fontWeight: 300,
                width: '100%'
              }}>
                <p>픽셀아트 이미지를 준비해주세요</p>
                <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: '#9ca3af' }}>/public/pixel-art.gif 파일을 추가하세요</p>
              </div>
            </motion.div>
            
            {/* 우리의 이야기 텍스트 - 순차 reveal */}
            {config.ourStory && config.ourStory.length > 0 && (
              <motion.div 
                style={{ 
                  marginTop: '2rem',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid rgba(229, 231, 235, 0.6)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem'
                }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                {config.ourStory.map((story, idx) => (
                  <motion.div 
                    key={idx} 
                    style={{ textAlign: 'center' }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6 + (idx * 0.2) }}
                  >
                    <div style={{ 
                      color: '#4b5563', 
                      fontSize: '0.9375rem', 
                      lineHeight: 1.8,
                      fontWeight: 300,
                      fontStyle: 'italic'
                    }}>
                      {story.text.map((line, lineIdx) => (
                        <motion.p 
                          key={lineIdx}
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: 0.7 + (idx * 0.2) + (lineIdx * 0.1) }}
                        >
                          {line}
                        </motion.p>
                      ))}
                    </div>
                    <motion.p 
                      style={{ 
                        marginTop: '0.75rem', 
                        color: '#6b7280', 
                        fontSize: '0.8125rem',
                        fontWeight: 400
                      }}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.9 + (idx * 0.2) }}
                    >
                      — {story.author}
                    </motion.p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* 갤러리 Section - Apple 스타일 scroll-linked zoom */}
      <section id="gallery" className="py-16" ref={galleryRef}>
        <div className="container">
          {/* 섹션 타이틀 */}
          <motion.h2 
            style={{
              fontFamily: "'MapoFlowerIsland', 'Gowun Batang', serif",
              fontSize: '1.5rem',
              fontWeight: 400,
              textAlign: 'center',
              marginBottom: '2rem',
              color: '#374151',
              letterSpacing: '0.15em'
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {config.sectionTitles.gallery}
          </motion.h2>
          
          {/* 갤러리 컨테이너 - scroll-linked 효과 적용 */}
          <motion.div 
            style={{
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
              borderRadius: '1rem',
              padding: '1rem',
              boxShadow: '0 8px 32px 0 rgba(0,0,0,0.06)',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              scale: galleryScale,
              opacity: galleryOpacity,
              y: galleryY
            }}
          >
            <div 
              style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '0.75rem',
                cursor: 'pointer'
              }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onClick={handleImageClick}
            >
              {/* 고정 비율 컨테이너 (4:5 세로 비율) */}
              <div style={{
                position: 'relative',
                width: '100%',
                paddingTop: '125%', // 4:5 비율
                overflow: 'hidden',
                borderRadius: '0.75rem',
                backgroundColor: '#f3f4f6'
              }}>
                <div 
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    transition: 'transform 300ms ease-out',
                    transform: `translateX(-${currentImageIndex * 100}%)`
                  }}
                >
                  {galleryImages.map((image, index) => (
                    <div key={index} style={{ 
                      minWidth: '100%', 
                      flexShrink: 0,
                      position: 'relative'
                    }}>
                      <img 
                        src={image}
                        alt={`갤러리 ${index + 1}`}
                        draggable={false}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center',
                          userSelect: 'none'
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const errorDiv = e.target.nextElementSibling;
                          if (errorDiv) {
                            errorDiv.style.display = 'flex';
                          }
                        }}
                      />
                      <div style={{
                        display: 'none',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: theme.galleryErrorBg
                      }}>
                        <div style={{ color: '#9ca3af', textAlign: 'center', padding: '1rem' }}>
                          <svg style={{ width: '3rem', height: '3rem', margin: '0 auto 0.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p style={{ fontSize: '0.75rem', fontWeight: 300 }}>사진 {index + 1}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 터치 힌트 */}
              <div style={{
                position: 'absolute',
                bottom: '0.75rem',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                fontSize: '0.625rem',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                pointerEvents: 'none'
              }}>
                터치하여 확대
              </div>

              {/* 좌우 화살표 */}
              {currentImageIndex > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(prev => prev - 1);
                  }}
                  style={{
                    position: 'absolute',
                    left: '0.5rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    color: '#374151',
                    fontSize: '1.25rem',
                    fontWeight: 300
                  }}
                >
                  ‹
                </button>
              )}
              {currentImageIndex < galleryImages.length - 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(prev => prev + 1);
                  }}
                  style={{
                    position: 'absolute',
                    right: '0.5rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    color: '#374151',
                    fontSize: '1.25rem',
                    fontWeight: 300
                  }}
                >
                  ›
                </button>
              )}
            </div>
            
            {/* 인디케이터 - 애니메이션 추가 */}
            {galleryImages.length > 1 && (
              <motion.div 
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginTop: '1rem'
                }}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {galleryImages.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                    style={{
                      width: index === currentImageIndex ? '1.5rem' : '0.5rem',
                      height: '0.5rem',
                      borderRadius: '9999px',
                      border: 'none',
                      backgroundColor: index === currentImageIndex ? theme.indicatorActive : theme.indicatorInactive,
                      cursor: 'pointer',
                    }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    animate={{ 
                      width: index === currentImageIndex ? '1.5rem' : '0.5rem',
                      backgroundColor: index === currentImageIndex ? theme.indicatorActive : theme.indicatorInactive 
                    }}
                    transition={{ duration: 0.3 }}
                    aria-label={`이미지 ${index + 1}로 이동`}
                  />
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* 오시는 길 Section - 강화된 애니메이션 */}
      <section id="location" className="py-16">
        <div className="container">
          <motion.div
            style={{
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
              borderRadius: '1rem',
              padding: '2rem',
              boxShadow: '0 8px 32px 0 rgba(0,0,0,0.06)',
              border: '1px solid rgba(255, 255, 255, 0.8)'
            }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* 섹션 타이틀 */}
            <motion.h2 
              style={{
                fontFamily: "'MapoFlowerIsland', 'Gowun Batang', serif",
                fontSize: '1.5rem',
                fontWeight: 400,
                textAlign: 'center',
                marginBottom: '2rem',
                color: '#374151',
                letterSpacing: '0.15em'
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {config.sectionTitles.location}
            </motion.h2>
            
            {/* 장소 정보 - 순차 등장 */}
            <motion.div 
              style={{ marginBottom: '1.5rem', textAlign: 'center', color: '#4b5563' }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.p 
                style={{ fontSize: '1rem', fontWeight: 300, marginBottom: '0.5rem' }}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                {config.venue.name} {config.venue.branch}
              </motion.p>
              {config.venue.hall && (
                <motion.p 
                  style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 300, marginBottom: '0.5rem' }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  {config.venue.hall}
                </motion.p>
              )}
              <motion.p 
                style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 300, marginBottom: '1rem' }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                {config.wedding.year} {config.wedding.monthDay} {config.wedding.dayOfWeek} {config.wedding.timeText}
              </motion.p>
              <motion.div 
                style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: '#4b5563', fontWeight: 300 }}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.6 }}
              >
                <p style={{ marginBottom: '0.75rem', fontWeight: 400 }}>주소</p>
                <p style={{ lineHeight: 1.625 }}>
                  {config.venue.address}<br />
                  {config.venue.addressDetail && (
                    <span style={{ color: '#6b7280' }}>{config.venue.addressDetail}</span>
                  )}
                </p>
              </motion.div>
            </motion.div>
            
            {/* 지도 이미지 - zoom-in 효과 */}
            <motion.div 
              style={{
                borderRadius: '0.75rem',
                overflow: 'hidden',
                boxShadow: '0 4px 16px 0 rgba(0,0,0,0.08)',
                marginBottom: '1rem',
                backgroundColor: '#f3f4f6'
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
            >
              <motion.img 
                src={config.maps.image}
                alt="오시는 길"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block'
                }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  const errorDiv = e.target.nextElementSibling;
                  if (errorDiv) errorDiv.style.display = 'flex';
                }}
              />
              <div style={{
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                height: '200px',
                backgroundColor: '#f9fafb',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                <svg style={{ width: '2.5rem', height: '2.5rem', color: '#9ca3af' }} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <p style={{ color: '#9ca3af', fontSize: '0.75rem' }}>/public/map_image.jpg 파일을 추가하세요</p>
              </div>
            </motion.div>

            {/* 지도 탭 - 애니메이션 */}
            <motion.div 
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '0.25rem',
                marginBottom: '1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                borderRadius: '0.75rem',
                padding: '0.25rem'
              }}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              {mapTabs.map((tab, idx) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveMapTab(tab.id)}
                  style={{
                    flex: 1,
                    padding: '0.625rem 0.5rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    backgroundColor: activeMapTab === tab.id ? 'white' : 'transparent',
                    color: activeMapTab === tab.id ? '#374151' : '#6b7280',
                    fontSize: '0.8125rem',
                    fontWeight: activeMapTab === tab.id ? 500 : 300,
                    cursor: 'pointer',
                    boxShadow: activeMapTab === tab.id ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  animate={{
                    backgroundColor: activeMapTab === tab.id ? 'white' : 'transparent',
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {tab.label}
                </motion.button>
              ))}
            </motion.div>

            {/* 지도 앱 열기 버튼 - 애니메이션 */}
            <motion.div 
              style={{ 
                display: 'flex', 
                justifyContent: 'center'
              }}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <motion.a
                href={
                  activeMapTab === 'naver' ? config.maps.naver :
                  activeMapTab === 'kakao' ? config.maps.kakao :
                  config.maps.tmap
                }
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backdropFilter: 'blur(4px)',
                  WebkitBackdropFilter: 'blur(4px)',
                  backgroundColor: 
                    activeMapTab === 'naver' ? 'rgba(3, 199, 90, 0.15)' :
                    activeMapTab === 'kakao' ? 'rgba(254, 229, 0, 0.2)' :
                    'rgba(228, 0, 43, 0.15)',
                  borderRadius: '0.75rem',
                  padding: '0.75rem 1.5rem',
                  color: 
                    activeMapTab === 'naver' ? '#03C75A' :
                    activeMapTab === 'kakao' ? '#3C1E1E' :
                    '#E4002B',
                  fontSize: '0.875rem',
                  fontWeight: 400,
                  textDecoration: 'none',
                  boxShadow: '0 2px 8px 0 rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  border: `1px solid ${
                    activeMapTab === 'naver' ? 'rgba(3, 199, 90, 0.3)' :
                    activeMapTab === 'kakao' ? 'rgba(254, 229, 0, 0.5)' :
                    'rgba(228, 0, 43, 0.3)'
                  }`
                }}
                whileHover={{ scale: 1.03, boxShadow: '0 4px 12px 0 rgba(0,0,0,0.15)' }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2 }}
              >
                <svg style={{ width: '1.125rem', height: '1.125rem' }} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                {activeMapTab === 'naver' ? '네이버 지도' : activeMapTab === 'kakao' ? '카카오맵' : 'T맵'}에서 열기
              </motion.a>
            </motion.div>

            {/* 교통편 정보 - 순차 등장 */}
            <motion.div 
              style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(229, 231, 235, 0.6)', fontSize: '0.875rem', color: '#4b5563', fontWeight: 300, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <motion.p 
                style={{ textAlign: 'center', marginBottom: '0.75rem', fontWeight: 400 }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.9 }}
              >
                교통편
              </motion.p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', textAlign: 'center' }}>
                {config.transportation.map((item, index) => (
                  <motion.p 
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -10 : 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 1.0 + (index * 0.1) }}
                  >
                    {item}
                  </motion.p>
                ))}
              </div>
              {config.busInfo && (
                <motion.p 
                  style={{ textAlign: 'center', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(229, 231, 235, 0.6)' }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 1.2 }}
                >
                  {config.busInfo}
                </motion.p>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 계좌번호 Section - 카드 애니메이션 */}
      <section id="account" className="py-16">
        <div className="container">
          {/* 섹션 타이틀 */}
          <motion.h2 
            style={{
              fontFamily: "'MapoFlowerIsland', 'Gowun Batang', serif",
              fontSize: '1.5rem',
              fontWeight: 400,
              textAlign: 'center',
              marginBottom: '1.5rem',
              color: '#374151',
              letterSpacing: '0.15em'
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {config.sectionTitles.account}
          </motion.h2>
          
          <motion.div
            style={{
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
              borderRadius: '1rem',
              padding: '1.25rem',
              boxShadow: '0 8px 32px 0 rgba(0,0,0,0.06)',
              border: '1px solid rgba(255, 255, 255, 0.8)'
            }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {/* 신랑측 */}
            <motion.div 
              style={{ marginBottom: '1rem' }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.p 
                style={{ 
                  fontSize: '0.9375rem', 
                  fontWeight: 500, 
                  color: '#374151', 
                  marginBottom: '0.75rem',
                  textAlign: 'center'
                }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                신랑측
              </motion.p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                {[
                  { key: 'groom', label: config.groom.name, role: '신랑', account: config.accounts.groom },
                  { key: 'groomFather', label: config.groom.fatherName, role: '아버지', account: config.accounts.groomFather },
                  { key: 'groomMother', label: config.groom.motherName, role: '어머니', account: config.accounts.groomMother },
                ].filter(item => item.account?.bank).map((item, idx) => (
                  <motion.button
                    key={item.key}
                    onClick={() => setExpandedAccount(expandedAccount === item.key ? null : item.key)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: expandedAccount === item.key ? theme.accentSolid : 'rgba(255,255,255,0.7)',
                      color: expandedAccount === item.key ? 'white' : '#374151',
                      borderRadius: '0.75rem',
                      padding: '0.75rem 0.5rem',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.4 + (idx * 0.1) }}
                    whileHover={{ scale: 1.03, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    whileTap={{ scale: 0.97 }}
                    animate={{
                      backgroundColor: expandedAccount === item.key ? theme.accentSolid : 'rgba(255,255,255,0.7)',
                      color: expandedAccount === item.key ? 'white' : '#374151',
                    }}
                  >
                    <span style={{ fontSize: '0.6875rem', opacity: 0.8, marginBottom: '0.125rem' }}>{item.role}</span>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{item.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* 구분선 */}
            <motion.div 
              style={{ height: '1px', backgroundColor: 'rgba(0,0,0,0.08)', margin: '0.75rem 0' }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
            />

            {/* 신부측 */}
            <motion.div 
              style={{ marginBottom: '0.75rem' }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <motion.p 
                style={{ 
                  fontSize: '0.9375rem', 
                  fontWeight: 500, 
                  color: '#374151', 
                  marginBottom: '0.75rem',
                  textAlign: 'center'
                }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.6 }}
              >
                신부측
              </motion.p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                {[
                  { key: 'bride', label: config.bride.name, role: '신부', account: config.accounts.bride },
                  { key: 'brideFather', label: config.bride.fatherName, role: '아버지', account: config.accounts.brideFather },
                  { key: 'brideMother', label: config.bride.motherName, role: '어머니', account: config.accounts.brideMother },
                ].filter(item => item.account?.bank).map((item, idx) => (
                  <motion.button
                    key={item.key}
                    onClick={() => setExpandedAccount(expandedAccount === item.key ? null : item.key)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: expandedAccount === item.key ? theme.accentSolid : 'rgba(255,255,255,0.7)',
                      color: expandedAccount === item.key ? 'white' : '#374151',
                      borderRadius: '0.75rem',
                      padding: '0.75rem 0.5rem',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.7 + (idx * 0.1) }}
                    whileHover={{ scale: 1.03, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    whileTap={{ scale: 0.97 }}
                    animate={{
                      backgroundColor: expandedAccount === item.key ? theme.accentSolid : 'rgba(255,255,255,0.7)',
                      color: expandedAccount === item.key ? 'white' : '#374151',
                    }}
                  >
                    <span style={{ fontSize: '0.6875rem', opacity: 0.8, marginBottom: '0.125rem' }}>{item.role}</span>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{item.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* 선택된 계좌 정보 표시 */}
            <AnimatePresence>
              {expandedAccount && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ overflow: 'hidden' }}
                >
                  {(() => {
                    const allAccounts = [
                      { key: 'groom', label: config.groom.name, role: '신랑', account: config.accounts.groom },
                      { key: 'groomFather', label: config.groom.fatherName, role: '아버지', account: config.accounts.groomFather },
                      { key: 'groomMother', label: config.groom.motherName, role: '어머니', account: config.accounts.groomMother },
                      { key: 'bride', label: config.bride.name, role: '신부', account: config.accounts.bride },
                      { key: 'brideFather', label: config.bride.fatherName, role: '아버지', account: config.accounts.brideFather },
                      { key: 'brideMother', label: config.bride.motherName, role: '어머니', account: config.accounts.brideMother },
                    ];
                    const selected = allAccounts.find(a => a.key === expandedAccount);
                    if (!selected) return null;
                    return (
                      <div style={{
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        borderRadius: '0.75rem',
                        padding: '1rem',
                        marginTop: '0.75rem',
                        textAlign: 'center'
                      }}>
                        <p style={{ fontSize: '0.875rem', color: '#374151', fontWeight: 500, marginBottom: '0.75rem' }}>
                          {selected.role} {selected.label}
                        </p>
                        <p style={{ fontSize: '0.8125rem', color: '#6b7280', marginBottom: '0.25rem' }}>{selected.account.bank}</p>
                        <p style={{ fontSize: '1.0625rem', color: '#1f2937', fontWeight: 600, marginBottom: '0.25rem', letterSpacing: '0.05em' }}>
                          {selected.account.accountNumber}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '1rem' }}>예금주: {selected.account.holder}</p>
                        <button
                          onClick={() => copyToClipboard(`${selected.account.bank} ${selected.account.accountNumber} ${selected.account.holder}`, selected.key)}
                          style={{
                            width: '100%',
                            backgroundColor: theme.accentSolid,
                            color: 'white',
                            borderRadius: '0.5rem',
                            padding: '0.75rem',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          {copied[expandedAccount] ? '✓ 복사 완료!' : '계좌번호 복사하기'}
                        </button>
                      </div>
                    );
                  })()}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Footer - 애니메이션 */}
      <motion.footer 
        style={{ padding: '3rem 1rem', textAlign: 'center', color: '#6b7280' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container">
          <motion.p 
            style={{ marginBottom: '0.375rem', fontSize: '0.875rem', fontWeight: 300 }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {config.groom.name} ♥ {config.bride.name}
          </motion.p>
          <motion.p 
            style={{ marginBottom: '1.5rem', fontSize: '0.75rem', fontWeight: 300 }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {config.wedding.year} {config.wedding.monthDay}
          </motion.p>
          <motion.p 
            style={{ fontSize: '0.75rem', fontWeight: 300 }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {config.footer.message}
            {config.footer.showRepository && config.footer.repository && (
              <>
                {' '}
                <motion.a 
                  href={config.footer.repository} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    color: '#9ca3af',
                    textDecoration: 'underline',
                  }}
                  whileHover={{ color: theme.accentSolid }}
                  transition={{ duration: 0.2 }}
                >
                  GitHub
                </motion.a>
              </>
            )}
          </motion.p>
        </div>
      </motion.footer>

      {/* 플로팅 목차 버튼 */}
      <div style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 1000
      }}>
        {/* 메뉴 패널 */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute',
                bottom: '4rem',
                right: 0,
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '1rem',
                padding: '0.75rem 0',
                boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                border: '1px solid rgba(255, 255, 255, 0.8)',
                minWidth: '160px',
                overflow: 'hidden'
              }}
            >
              {menuItems.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '0.625rem 1.25rem',
                    textAlign: 'left',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#374151',
                    fontSize: '0.875rem',
                    fontWeight: 300,
                    cursor: 'pointer',
                    transition: 'background-color 150ms'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0,0,0,0.05)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <span style={{ 
                    color: theme.accentSolid, 
                    marginRight: '0.5rem',
                    fontSize: '0.75rem'
                  }}>{idx + 1}.</span>
                  {item.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 토글 버튼 */}
        <motion.button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{
            width: '3rem',
            height: '3rem',
            borderRadius: '50%',
            backgroundColor: theme.accentSolid,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            color: 'white'
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence mode="wait">
            {isMenuOpen ? (
              <motion.svg
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
                style={{ width: '1.25rem', height: '1.25rem' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </motion.svg>
            ) : (
              <motion.div
                key="dots"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.15 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '3px'
                }}
              >
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'white' }} />
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'white' }} />
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'white' }} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}

export default App;
