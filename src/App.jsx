import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { config, theme } from './config';
import './App.css';

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
  
  // 첫 페이지 Hero 섹션 - Zoom out + 마스크 reveal 효과
  const heroRef = useRef(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  // Zoom out 효과: 1.5배 → 1배 (빠르게)
  const imageScale = useTransform(heroProgress, [0, 0.3], [1.5, 1]);
  // 마스크 크기: -20%에서 시작 (완전 검은색 보장) → 빠르게 드러남
  const maskSize = useTransform(heroProgress, [0, 0.3], [-20, 200]);
  // 검은색 오버레이 투명도: 처음에 완전 불투명 → 스크롤하면 투명
  const blackOverlayOpacity = useTransform(heroProgress, [0, 0.05], [1, 0]);
  // 텍스트 위치
  const textY = useTransform(heroProgress, [0.5, 0.7], [0, -15]);

  // 목차 데이터 (config에서 가져옴)
  const menuItems = config.menu;

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

  // Hero 페이지 자동 스크롤
  const heroCompletedRef = useRef(false);
  const isAnimatingRef = useRef(false);
  const scrollTimeoutRef = useRef(null);
  
  useEffect(() => {
    const heroEnd = window.innerHeight;
    
    // 커스텀 스무스 스크롤 (2초, 등속)
    const smoothScrollTo = (targetY) => {
      if (isAnimatingRef.current) return;
      isAnimatingRef.current = true;
      
      const duration = 2000; // 2초
      const startY = window.scrollY;
      const distance = targetY - startY;
      let startTime = null;
      
      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        window.scrollTo(0, startY + distance * progress);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          isAnimatingRef.current = false;
          heroCompletedRef.current = true;
        }
      };
      
      requestAnimationFrame(animate);
    };
    
    const handleScrollEnd = () => {
      if (isAnimatingRef.current) return;
      
      const scrollY = window.scrollY;
      
      // Hero 페이지 내에 있고, 중간 상태인 경우 자동 스크롤
      if (!heroCompletedRef.current && scrollY > 10 && scrollY < heroEnd - 10) {
        smoothScrollTo(heroEnd);
      }
    };
    
    const onScroll = () => {
      // 애니메이션 중에는 아무것도 안 함
      if (isAnimatingRef.current) return;
      
      const scrollY = window.scrollY;
      
      // 맨 위로 돌아오면 리셋
      if (scrollY <= 5) {
        heroCompletedRef.current = false;
      }
      
      // Hero 끝에 도달하면 완료 표시
      if (scrollY >= heroEnd - 5) {
        heroCompletedRef.current = true;
      }
      
      clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(handleScrollEnd, 50);
    };
    
    window.addEventListener('scroll', onScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(scrollTimeoutRef.current);
    };
  }, []); // 빈 dependency - 한 번만 실행

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
  const galleryImages = config.gallery.images.filter(Boolean);

  // 스와이프 threshold (데드존)
  const SWIPE_THRESHOLD = 60;
  const TAP_DURATION = 250;

  // 갤러리 스와이프 핸들러 (터치) - 일반 모드
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

    // 수평 이동이 수직 이동보다 1.5배 이상 크면 스와이프로 판단
    if (Math.abs(diffX) > Math.abs(diffY) * 1.5 && Math.abs(diffX) > 20) {
      touchMoved.current = true;
    }
  };

  const handleTouchEnd = (e) => {
    if (!isDragging) return;
    
    const endX = e.changedTouches[0].clientX;
    const diffX = startX - endX;
    
    // 스와이프 판정: threshold 이상 이동했을 때만
    if (Math.abs(diffX) > SWIPE_THRESHOLD) {
      if (diffX > 0 && currentImageIndex < galleryImages.length - 1) {
        setCurrentImageIndex(prev => prev + 1);
      } else if (diffX < 0 && currentImageIndex > 0) {
        setCurrentImageIndex(prev => prev - 1);
      }
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
    const diffX = startX - e.clientX;
    if (Math.abs(diffX) > 20) {
      touchMoved.current = true;
    }
  };

  const handleMouseUp = (e) => {
    if (!isDragging) return;
    
    const diffX = startX - e.clientX;
    
    if (Math.abs(diffX) > SWIPE_THRESHOLD) {
      if (diffX > 0 && currentImageIndex < galleryImages.length - 1) {
        setCurrentImageIndex(prev => prev + 1);
      } else if (diffX < 0 && currentImageIndex > 0) {
        setCurrentImageIndex(prev => prev - 1);
      }
    }
    
    setIsDragging(false);
  };

  // 확대 버튼 클릭
  const openZoomModal = () => {
    setModalImageIndex(currentImageIndex);
    setShowModal(true);
  };

  // 모달 스와이프 핸들러
  const [modalStartX, setModalStartX] = useState(0);
  const [modalIsDragging, setModalIsDragging] = useState(false);

  const handleModalTouchStart = (e) => {
    setModalStartX(e.touches[0].clientX);
    setModalIsDragging(true);
  };

  const handleModalTouchEnd = (e) => {
    if (!modalIsDragging) return;
    
    const endX = e.changedTouches[0].clientX;
    const diffX = modalStartX - endX;
    
    if (Math.abs(diffX) > SWIPE_THRESHOLD) {
      if (diffX > 0 && modalImageIndex < galleryImages.length - 1) {
        setModalImageIndex(prev => prev + 1);
      } else if (diffX < 0 && modalImageIndex > 0) {
        setModalImageIndex(prev => prev - 1);
      }
    }
    
    setModalIsDragging(false);
  };

  // 모달 닫기
  const closeModal = () => {
    setShowModal(false);
  };

  // 이전/다음 이미지 함수
  const goToPrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    }
  };

  const goToNextImage = () => {
    if (currentImageIndex < galleryImages.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    }
  };

  const goToPrevModalImage = () => {
    if (modalImageIndex > 0) {
      setModalImageIndex(prev => prev - 1);
    }
  };

  const goToNextModalImage = () => {
    if (modalImageIndex < galleryImages.length - 1) {
      setModalImageIndex(prev => prev + 1);
    }
  };

  // ICS 파일 다운로드 함수
  const downloadICS = () => {
    const dateFormatted = config.wedding.date.replace(/-/g, '');
    const timeFormatted = config.wedding.time.replace(':', '') + '00';
    
    const event = {
      title: `${config.groom.name} & ${config.bride.name} 결혼식`,
      description: `${config.location.venue.name}에서 열리는 결혼식에 초대합니다.`,
      location: `${config.location.venue.name} (${config.location.venue.address})`,
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

  // 지도 탭 데이터 (config에서 가져옴)
  const mapTabs = config.location.mapTabs;

  return (
    <div style={{ 
      minHeight: '100vh', 
      maxWidth: '500px',
      margin: '0 auto',
      backgroundColor: theme.bgColor,
      boxShadow: '0 0 30px rgba(0,0,0,0.1)'
    }}>
      {/* 이미지 확대 모달 */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            onTouchStart={handleModalTouchStart}
            onTouchEnd={handleModalTouchEnd}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
              cursor: 'pointer',
              touchAction: 'pan-y'
            }}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={modalImageIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.2 }}
                src={galleryImages[modalImageIndex]}
                alt="확대 이미지"
                onClick={(e) => e.stopPropagation()}
                draggable={false}
                style={{
                  maxWidth: '100%',
                  maxHeight: '85vh',
                  objectFit: 'contain',
                  borderRadius: '0.5rem',
                  cursor: 'default',
                  userSelect: 'none'
                }}
              />
            </AnimatePresence>
            
            {/* 모달 좌우 화살표 */}
            {modalImageIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevModalImage();
                }}
                style={{
                  position: 'absolute',
                  left: '0.5rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '3rem',
                  height: '3rem',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: 300,
                  zIndex: 101
                }}
              >
                ‹
              </button>
            )}
            {modalImageIndex < galleryImages.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNextModalImage();
                }}
                style={{
                  position: 'absolute',
                  right: '0.5rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '3rem',
                  height: '3rem',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: 300,
                  zIndex: 101
                }}
              >
                ›
              </button>
            )}
            
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
                justifyContent: 'center',
                zIndex: 102
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
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalImageIndex(index);
                  }}
                  style={{
                    width: index === modalImageIndex ? '1.5rem' : '0.5rem',
                    height: '0.5rem',
                    borderRadius: '9999px',
                    border: 'none',
                    backgroundColor: index === modalImageIndex ? 'white' : 'rgba(255, 255, 255, 0.4)',
                    transition: 'all 300ms',
                    cursor: 'pointer'
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
          height: '200vh',
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
          backgroundColor: '#1a1a1a'
        }}>
          {/* 검정 오버레이 - 초기 상태 */}
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: '#000000',
              zIndex: 3,
              opacity: blackOverlayOpacity,
              pointerEvents: 'none'
            }}
          />

          {/* 배경 이미지 - Zoom out 효과 + 마스크 */}
          <motion.div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              scale: imageScale,
              // radial-gradient 마스크
              WebkitMaskImage: useTransform(maskSize, (size) => 
                `radial-gradient(circle at 50% 50%, black ${Math.max(0, size)}%, transparent ${Math.max(0, size) + 8}%)`
              ),
              maskImage: useTransform(maskSize, (size) => 
                `radial-gradient(circle at 50% 50%, black ${Math.max(0, size)}%, transparent ${Math.max(0, size) + 8}%)`
              )
            }}
          >
            <img 
              src={config.hero.backgroundImage}
              alt="Wedding"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center center'
              }}
            />
            {/* 어두운 오버레이 - 텍스트 가독성 */}
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.25)',
              pointerEvents: 'none'
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
              marginTop: '-140px',
              y: textY
            }}
          >
            {/* 영문 타이틀 - La Paloma (세로 배치) */}
            <motion.div
              style={{ 
                marginTop: '0',
                marginBottom: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px'
              }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            >
              <span style={{
                fontFamily: config.hero.nameEn1Font,
                fontSize: config.hero.nameEn1Size,
                fontWeight: 400,
                letterSpacing: '0.02em',
                textShadow: '0 2px 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.5)',
                display: 'block',
                whiteSpace: 'nowrap'
              }}>
                {config.hero.nameEn1}
              </span>
              <span style={{
                fontFamily: config.hero.ampersandFont,
                fontSize: config.hero.ampersandSize,
                fontWeight: 400,
                textShadow: '0 2px 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.5)',
                display: 'block'
              }}>
                {config.hero.ampersand}
              </span>
              <span style={{
                fontFamily: config.hero.nameEn2Font,
                fontSize: config.hero.nameEn2Size,
                fontWeight: 400,
                letterSpacing: '0.02em',
                textShadow: '0 2px 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.5)',
                display: 'block',
                whiteSpace: 'nowrap'
              }}>
                {config.hero.nameEn2}
              </span>
            </motion.div>

            {/* 한글 초대 문구 */}
            <motion.p
              style={{
                fontFamily: config.hero.inviteTextFont,
                fontSize: config.hero.inviteTextSize,
                fontWeight: config.hero.inviteTextWeight,
                letterSpacing: '0.08em',
                marginBottom: '1.5rem',
                textShadow: '0 2px 15px rgba(0,0,0,0.7), 0 0 30px rgba(0,0,0,0.4)'
              }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {config.hero.inviteText}
            </motion.p>

            {/* 날짜 */}
            <motion.div
              style={{
                fontFamily: config.hero.dateDisplayFont,
                fontSize: config.hero.dateDisplaySize,
                fontWeight: config.hero.dateDisplayWeight,
                letterSpacing: '0.05em',
                marginBottom: '0.15rem',
                textShadow: '0 2px 15px rgba(0,0,0,0.7), 0 0 30px rgba(0,0,0,0.4)'
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              {config.hero.dateDisplay}
            </motion.div>

            {/* 장소 */}
            <motion.p
              style={{
                fontFamily: config.hero.venueShortFont,
                fontSize: config.hero.venueShortSize,
                fontWeight: config.hero.venueShortWeight,
                letterSpacing: '0.03em',
                textShadow: '0 2px 15px rgba(0,0,0,0.7), 0 0 30px rgba(0,0,0,0.4)'
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.5 }}
            >
              {config.hero.venueShort}
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
              color: 'rgba(255,255,255,0.9)',
              letterSpacing: '0.25em',
              fontWeight: 400,
              textShadow: '0 1px 4px rgba(0,0,0,0.3)'
            }}>
              {config.hero.scrollText}
            </span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg style={{ width: '1rem', height: '1rem', color: 'rgba(255,255,255,0.9)', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 인사말 + 픽셀아트 통합 Section */}
      <section id="greeting" className="py-16">
        <div className="container">
          {/* 섹션 타이틀 */}
          <motion.h2 
            style={{ 
              textAlign: 'center', 
              fontFamily: config.greeting.titleFont,
              fontSize: config.greeting.titleSize,
              fontWeight: 400,
              color: theme.accentSolid,
              marginBottom: '1.5rem',
              letterSpacing: '0.3em'
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {config.greeting.title}
          </motion.h2>
          
          <motion.div
            style={{
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 8px 32px 0 rgba(0,0,0,0.06)',
              border: '1px solid rgba(255, 255, 255, 0.8)'
            }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* 신랑 신부 사진 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              {/* 신랑 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div style={{
                  borderRadius: '0.5rem',
                  overflow: 'hidden',
                  marginBottom: '0.75rem',
                  aspectRatio: '3/4'
                }}>
                  <img 
                    src={config.couple.groomImage}
                    alt="신랑"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
                <p style={{
                  textAlign: 'center',
                  fontSize: '0.8125rem',
                  color: '#4b5563',
                  fontWeight: 300
                }}>
                  {config.groom.fatherName} · {config.groom.motherName}의 {config.groom.relation} <strong style={{ fontWeight: 500 }}>{config.groom.name}</strong>
                </p>
              </motion.div>
              
              {/* 신부 */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div style={{
                  borderRadius: '0.5rem',
                  overflow: 'hidden',
                  marginBottom: '0.75rem',
                  aspectRatio: '3/4'
                }}>
                  <img 
                    src={config.couple.brideImage}
                    alt="신부"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
                <p style={{
                  textAlign: 'center',
                  fontSize: '0.8125rem',
                  color: '#4b5563',
                  fontWeight: 300
                }}>
                  {config.bride.fatherName} · {config.bride.motherName}의 {config.bride.relation} <strong style={{ fontWeight: 500 }}>{config.bride.name}</strong>
                </p>
              </motion.div>
            </div>
            
            {/* 인사말 메시지 */}
            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              textAlign: 'center',
              paddingTop: '1rem',
              borderTop: '1px solid rgba(229, 231, 235, 0.6)'
            }}>
              {/* 메인 메시지 */}
              <motion.div 
                style={{ 
                  fontFamily: config.greeting.messageFont,
                  fontSize: config.greeting.messageSize,
                  color: config.greeting.messageColor,
                  lineHeight: 1.8,
                  fontWeight: 300
                }}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {config.greeting.message.map((line, i) => (
                  <p key={i} style={{ marginBottom: '0.25rem' }}>{line}</p>
                ))}
              </motion.div>
              
              {/* 서브 메시지 */}
              <motion.div 
                style={{ 
                  fontFamily: config.greeting.messageFont,
                  fontSize: config.greeting.messageSize,
                  color: config.greeting.messageColor,
                  lineHeight: 1.8,
                  fontWeight: 300
                }}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                {config.greeting.subMessage.map((line, i) => (
                  <p key={i} style={{ marginBottom: '0.25rem' }}>{line}</p>
                ))}
              </motion.div>
            </div>
            
          </motion.div>
        </div>
      </section>

      {/* 갤러리 Section - Apple 스타일 scroll-linked zoom */}
      <section id="gallery" className="py-16" ref={galleryRef}>
        <div className="container">
          {/* 섹션 타이틀 */}
          <motion.h2 
            style={{
              fontFamily: config.gallery.titleFont,
              fontSize: config.gallery.titleSize,
              fontWeight: 400,
              textAlign: 'center',
              marginBottom: '1.5rem',
              color: theme.accentSolid,
              letterSpacing: '0.3em'
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {config.gallery.title}
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
                cursor: 'grab'
              }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
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
              
              {/* 확대 버튼 - 오른쪽 아래 */}
              <button
                onTouchStart={(e) => e.stopPropagation()}
                onTouchEnd={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  openZoomModal();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  openZoomModal();
                }}
                style={{
                  position: 'absolute',
                  bottom: '0.75rem',
                  right: '0.75rem',
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  zIndex: 10
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  <line x1="11" y1="8" x2="11" y2="14"/>
                  <line x1="8" y1="11" x2="14" y2="11"/>
                </svg>
              </button>

              {/* 좌우 화살표 */}
              {currentImageIndex > 0 && (
                <button
                  onTouchStart={(e) => e.stopPropagation()}
                  onTouchEnd={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    goToPrevImage();
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevImage();
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
                    fontWeight: 300,
                    zIndex: 10
                  }}
                >
                  ‹
                </button>
              )}
              {currentImageIndex < galleryImages.length - 1 && (
                <button
                  onTouchStart={(e) => e.stopPropagation()}
                  onTouchEnd={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    goToNextImage();
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNextImage();
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
                    fontWeight: 300,
                    zIndex: 10
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
          {/* 섹션 타이틀 - 프레임 밖 */}
          <motion.h2 
            style={{
              fontFamily: config.location.titleFont,
              fontSize: config.location.titleSize,
              fontWeight: 400,
              textAlign: 'center',
              marginBottom: '1.5rem',
              color: theme.accentSolid,
              letterSpacing: '0.3em'
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {config.location.title}
          </motion.h2>
          
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
                {config.location.venue.name} {config.location.venue.branch}
              </motion.p>
              {config.location.venue.hall && (
                <motion.p 
                  style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 300, marginBottom: '0.5rem' }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  {config.location.venue.hall}
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
                src={config.location.maps.image}
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
              {(() => {
                const currentTab = mapTabs.find(t => t.id === activeMapTab);
                return (
                  <motion.a
                    href={config.location.maps[activeMapTab]}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      backdropFilter: 'blur(4px)',
                      WebkitBackdropFilter: 'blur(4px)',
                      backgroundColor: currentTab?.bgColor,
                      borderRadius: '0.75rem',
                      padding: '0.75rem 1.5rem',
                      color: currentTab?.color,
                      fontSize: '0.875rem',
                      fontWeight: 400,
                      textDecoration: 'none',
                      boxShadow: '0 2px 8px 0 rgba(0,0,0,0.1)',
                      cursor: 'pointer',
                      border: `1px solid ${currentTab?.borderColor}`
                    }}
                    whileHover={{ scale: 1.03, boxShadow: '0 4px 12px 0 rgba(0,0,0,0.15)' }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg style={{ width: '1.125rem', height: '1.125rem' }} viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    {currentTab?.openText}
                  </motion.a>
                );
              })()}
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
                {config.location.transportLabel}
              </motion.p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', textAlign: 'center' }}>
                {config.location.transportation.map((item, index) => (
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
              {config.location.busInfo && (
                <motion.p 
                  style={{ textAlign: 'center', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(229, 231, 235, 0.6)' }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 1.2 }}
                >
                  {config.location.busInfo}
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
              fontFamily: config.account.titleFont,
              fontSize: config.account.titleSize,
              fontWeight: 400,
              textAlign: 'center',
              marginBottom: '1.5rem',
              color: theme.accentSolid,
              letterSpacing: '0.3em'
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {config.account.title}
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
                {config.account.groomSideLabel}
              </motion.p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                {[
                  { key: 'groom', label: config.groom.name, role: config.account.roles.groom, account: config.account.groom },
                  { key: 'groomFather', label: config.groom.fatherName, role: config.account.roles.father, account: config.account.groomFather },
                  { key: 'groomMother', label: config.groom.motherName, role: config.account.roles.mother, account: config.account.groomMother },
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
                {config.account.brideSideLabel}
              </motion.p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                {[
                  { key: 'bride', label: config.bride.name, role: config.account.roles.bride, account: config.account.bride },
                  { key: 'brideFather', label: config.bride.fatherName, role: config.account.roles.father, account: config.account.brideFather },
                  { key: 'brideMother', label: config.bride.motherName, role: config.account.roles.mother, account: config.account.brideMother },
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
                      { key: 'groom', label: config.groom.name, role: config.account.roles.groom, account: config.account.groom },
                      { key: 'groomFather', label: config.groom.fatherName, role: config.account.roles.father, account: config.account.groomFather },
                      { key: 'groomMother', label: config.groom.motherName, role: config.account.roles.mother, account: config.account.groomMother },
                      { key: 'bride', label: config.bride.name, role: config.account.roles.bride, account: config.account.bride },
                      { key: 'brideFather', label: config.bride.fatherName, role: config.account.roles.father, account: config.account.brideFather },
                      { key: 'brideMother', label: config.bride.motherName, role: config.account.roles.mother, account: config.account.brideMother },
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
                        <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '1rem' }}>{config.account.holderLabel}: {selected.account.holder}</p>
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
                          {copied[expandedAccount] ? config.account.copyComplete : config.account.copyButton}
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
