import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { config, colorPalettes } from './config';
import './App.css';

// 현재 테마 색상
const theme = colorPalettes[config.colorTheme];

function App() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [copied, setCopied] = useState({ groom: false, bride: false });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [activeMapTab, setActiveMapTab] = useState('naver');
  const touchStartTime = useRef(0);
  const touchMoved = useRef(false);

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

      {/* Hero Section */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: theme.bgOverlay
        }}></div>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1), transparent 50%)'
        }}></div>
        
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div style={{ 
              fontSize: '0.75rem', 
              letterSpacing: '0.3em', 
              color: theme.accent, 
              marginBottom: '2rem',
              fontWeight: 300
            }}>WEDDING INVITATION</div>
            <h1 style={{ 
              fontSize: '2.25rem', 
              fontWeight: 300, 
              color: '#1f2937', 
              marginBottom: '0.75rem',
              letterSpacing: '-0.025em'
            }}>{config.groom.name}</h1>
            <div style={{ fontSize: '1.875rem', marginBottom: '0.75rem' }}>
              <span style={{ color: theme.heart }}>♥</span>
            </div>
            <h1 style={{ 
              fontSize: '2.25rem', 
              fontWeight: 300, 
              color: '#1f2937', 
              marginBottom: '3rem',
              letterSpacing: '-0.025em'
            }}>{config.bride.name}</h1>
            <div style={{ 
              fontSize: '1rem', 
              color: '#4b5563', 
              marginBottom: '0.25rem',
              fontWeight: 300,
              letterSpacing: '0.025em'
            }}>
              {config.wedding.dateText}
            </div>
            <div style={{ 
              fontSize: '0.875rem', 
              color: '#6b7280', 
              fontWeight: 300
            }}>{config.wedding.timeText}</div>
          </motion.div>
        </div>

        <motion.div
          style={{
            position: 'absolute',
            bottom: '3rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 20
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <svg style={{ width: '1.25rem', height: '1.25rem', color: '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>

      {/* 인사말 Section */}
      <section className="py-16">
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
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 300,
              textAlign: 'center',
              marginBottom: '2rem',
              color: '#374151',
              letterSpacing: '0.025em'
            }}>{config.greeting.title}</h2>
            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              color: '#4b5563',
              lineHeight: 1.625,
              fontSize: '0.9375rem',
              textAlign: 'center'
            }}>
              <p style={{ fontWeight: 300 }}>
                {config.greeting.message.map((line, i) => (
                  <span key={i}>{line}{i < config.greeting.message.length - 1 && <br />}</span>
                ))}
              </p>
              <p style={{ fontWeight: 300, paddingTop: '0.5rem' }}>
                {config.greeting.subMessage.map((line, i) => (
                  <span key={i}>{line}{i < config.greeting.subMessage.length - 1 && <br />}</span>
                ))}
              </p>
            </div>
            <div style={{
              marginTop: '2.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid rgba(229, 231, 235, 0.6)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              color: '#4b5563',
              fontSize: '0.875rem'
            }}>
              <p style={{ fontWeight: 300 }}>{config.groom.fatherName} · {config.groom.motherName}의 {config.groom.relation} {config.groom.name}</p>
              <p style={{ fontWeight: 300 }}>{config.bride.fatherName} · {config.bride.motherName}의 {config.bride.relation} {config.bride.name}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* D-Day 카운터 Section */}
      <section className="py-16">
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
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 300,
              textAlign: 'center',
              marginBottom: '2.5rem',
              color: '#374151',
              letterSpacing: '0.025em'
            }}>D-Day</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0.625rem'
            }}>
              {[
                { label: '일', value: timeLeft.days },
                { label: '시', value: timeLeft.hours },
                { label: '분', value: timeLeft.minutes },
                { label: '초', value: timeLeft.seconds },
              ].map((item, index) => (
                <div key={index} style={{ textAlign: 'center' }}>
                  <div style={{
                    backdropFilter: 'blur(4px)',
                    WebkitBackdropFilter: 'blur(4px)',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: '0.75rem',
                    padding: '0.75rem',
                    boxShadow: '0 4px 16px 0 rgba(0,0,0,0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.6)'
                  }}>
                    <div style={{
                      fontSize: '1.875rem',
                      fontWeight: 300,
                      color: '#374151',
                      marginBottom: '0.125rem',
                      letterSpacing: '-0.025em'
                    }}>
                      {String(item.value).padStart(2, '0')}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      fontWeight: 300
                    }}>{item.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 픽셀아트 Section */}
      <section className="py-16">
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
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 300,
              textAlign: 'center',
              marginBottom: '2rem',
              color: '#374151',
              letterSpacing: '0.025em'
            }}>우리의 이야기</h2>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '200px'
            }}>
              <img 
                src={config.pixelArt}
                alt="픽셀아트" 
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: '0.75rem',
                  boxShadow: '0 4px 16px 0 rgba(0,0,0,0.08)'
                }}
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
            </div>
          </motion.div>
        </div>
      </section>

      {/* 갤러리 Section */}
      <section className="py-16">
        <div className="container">
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 300,
            textAlign: 'center',
            marginBottom: '2rem',
            color: '#374151',
            letterSpacing: '0.025em'
          }}>갤러리</h2>
          <div style={{
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            borderRadius: '1rem',
            padding: '1rem',
            boxShadow: '0 8px 32px 0 rgba(0,0,0,0.06)',
            border: '1px solid rgba(255, 255, 255, 0.8)'
          }}>
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
            </div>
            
            {/* 인디케이터 */}
            {galleryImages.length > 1 && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '0.5rem',
                marginTop: '1rem'
              }}>
                {galleryImages.map((_, index) => (
                  <button
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
                      transition: 'all 300ms'
                    }}
                    aria-label={`이미지 ${index + 1}로 이동`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 오시는 길 Section */}
      <section className="py-16">
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
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 300,
              textAlign: 'center',
              marginBottom: '2rem',
              color: '#374151',
              letterSpacing: '0.025em'
            }}>오시는 길</h2>
            <div style={{ marginBottom: '1.5rem', textAlign: 'center', color: '#4b5563' }}>
              <p style={{ fontSize: '1rem', fontWeight: 300, marginBottom: '0.5rem' }}>{config.venue.name}</p>
              {config.venue.hall && (
                <p style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 300, marginBottom: '0.5rem' }}>{config.venue.hall}</p>
              )}
              <p style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 300, marginBottom: '1rem' }}>{config.wedding.dateText} {config.wedding.timeText}</p>
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: '#4b5563', fontWeight: 300 }}>
                <p style={{ marginBottom: '0.75rem', fontWeight: 400 }}>주소</p>
                <p style={{ lineHeight: 1.625 }}>
                  {config.venue.address}<br />
                  {config.venue.addressDetail && (
                    <span style={{ color: '#6b7280' }}>{config.venue.addressDetail}</span>
                  )}
                </p>
              </div>
            </div>
            
            {/* 지도 탭 */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '0.25rem',
              marginBottom: '1rem',
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              borderRadius: '0.75rem',
              padding: '0.25rem'
            }}>
              {mapTabs.map((tab) => (
                <button
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
                    transition: 'all 200ms',
                    boxShadow: activeMapTab === tab.id ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* 지도 iframe */}
            <div style={{
              borderRadius: '0.75rem',
              overflow: 'hidden',
              boxShadow: '0 4px 16px 0 rgba(0,0,0,0.08)',
              marginBottom: '1rem',
              height: '280px',
              backgroundColor: '#f3f4f6'
            }}>
              {activeMapTab === 'naver' && (
                <iframe
                  src={`https://map.naver.com/p/search/${encodeURIComponent(config.venue.name)}`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  title="네이버 지도"
                ></iframe>
              )}
              {activeMapTab === 'kakao' && (
                <iframe
                  src={`https://map.kakao.com/link/search/${encodeURIComponent(config.venue.name)}`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  title="카카오맵"
                ></iframe>
              )}
              {activeMapTab === 'tmap' && (
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f9fafb',
                  flexDirection: 'column',
                  gap: '1rem'
                }}>
                  <svg style={{ width: '3rem', height: '3rem', color: '#E4002B' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', textAlign: 'center' }}>
                    T맵 앱에서 길안내를 받으세요
                  </p>
                </div>
              )}
            </div>

            {/* 지도 앱 열기 버튼 */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center'
            }}>
              <a
                href={
                  activeMapTab === 'naver' ? config.maps.naver :
                  activeMapTab === 'kakao' ? config.maps.kakao :
                  config.maps.tmap || `tmap://route?goalname=${encodeURIComponent(config.venue.name)}&goalx=${config.venue.longitude || ''}&goaly=${config.venue.latitude || ''}`
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
                  transition: 'all 300ms',
                  cursor: 'pointer',
                  border: `1px solid ${
                    activeMapTab === 'naver' ? 'rgba(3, 199, 90, 0.3)' :
                    activeMapTab === 'kakao' ? 'rgba(254, 229, 0, 0.5)' :
                    'rgba(228, 0, 43, 0.3)'
                  }`
                }}
              >
                <svg style={{ width: '1.125rem', height: '1.125rem' }} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                {activeMapTab === 'naver' ? '네이버 지도' : activeMapTab === 'kakao' ? '카카오맵' : 'T맵'}에서 열기
              </a>
            </div>

            {/* 교통편 정보 */}
            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(229, 231, 235, 0.6)', fontSize: '0.875rem', color: '#4b5563', fontWeight: 300, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <p style={{ textAlign: 'center', marginBottom: '0.75rem', fontWeight: 400 }}>교통편</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', textAlign: 'center' }}>
                {config.transportation.map((item, index) => (
                  <p key={index}>{item}</p>
                ))}
              </div>
              {config.busInfo && (
                <p style={{ textAlign: 'center', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(229, 231, 235, 0.6)' }}>{config.busInfo}</p>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 계좌번호 Section */}
      <section className="py-16">
        <div className="container">
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 300,
            textAlign: 'center',
            marginBottom: '2rem',
            color: '#374151',
            letterSpacing: '0.025em'
          }}>마음 전하실 곳</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* 신랑측 계좌 */}
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
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: 300,
                marginBottom: '1.25rem',
                color: '#374151',
                textAlign: 'center',
                letterSpacing: '0.025em'
              }}>신랑측</h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                color: '#4b5563',
                fontSize: '0.875rem',
                textAlign: 'center'
              }}>
                <p style={{ fontWeight: 300 }}>은행명 <span style={{ marginLeft: '0.5rem' }}>{config.accounts.groom.bank}</span></p>
                <p style={{ fontWeight: 300 }}>계좌번호 <span style={{ marginLeft: '0.5rem' }}>{config.accounts.groom.accountNumber}</span></p>
                <p style={{ fontWeight: 300 }}>예금주 <span style={{ marginLeft: '0.5rem' }}>{config.accounts.groom.holder}</span></p>
              </div>
              <button
                onClick={() => copyToClipboard(`${config.accounts.groom.bank} ${config.accounts.groom.accountNumber} ${config.accounts.groom.holder}`, 'groom')}
                style={{
                  width: '100%',
                  marginTop: '1.25rem',
                  backdropFilter: 'blur(4px)',
                  WebkitBackdropFilter: 'blur(4px)',
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  borderRadius: '0.75rem',
                  padding: '0.625rem',
                  color: '#4b5563',
                  fontSize: '0.875rem',
                  fontWeight: 300,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px 0 rgba(0,0,0,0.05)',
                  transition: 'all 300ms'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.7)'}
              >
                {copied.groom ? '✓ 복사되었습니다!' : '계좌번호 복사'}
              </button>
            </motion.div>

            {/* 신부측 계좌 */}
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
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: 300,
                marginBottom: '1.25rem',
                color: '#374151',
                textAlign: 'center',
                letterSpacing: '0.025em'
              }}>신부측</h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                color: '#4b5563',
                fontSize: '0.875rem',
                textAlign: 'center'
              }}>
                <p style={{ fontWeight: 300 }}>은행명 <span style={{ marginLeft: '0.5rem' }}>{config.accounts.bride.bank}</span></p>
                <p style={{ fontWeight: 300 }}>계좌번호 <span style={{ marginLeft: '0.5rem' }}>{config.accounts.bride.accountNumber}</span></p>
                <p style={{ fontWeight: 300 }}>예금주 <span style={{ marginLeft: '0.5rem' }}>{config.accounts.bride.holder}</span></p>
              </div>
              <button
                onClick={() => copyToClipboard(`${config.accounts.bride.bank} ${config.accounts.bride.accountNumber} ${config.accounts.bride.holder}`, 'bride')}
                style={{
                  width: '100%',
                  marginTop: '1.25rem',
                  backdropFilter: 'blur(4px)',
                  WebkitBackdropFilter: 'blur(4px)',
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  borderRadius: '0.75rem',
                  padding: '0.625rem',
                  color: '#4b5563',
                  fontSize: '0.875rem',
                  fontWeight: 300,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px 0 rgba(0,0,0,0.05)',
                  transition: 'all 300ms'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.7)'}
              >
                {copied.bride ? '✓ 복사되었습니다!' : '계좌번호 복사'}
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 캘린더 추가 Section */}
      <section className="py-16">
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
              textAlign: 'center'
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 300,
              marginBottom: '1.5rem',
              color: '#374151',
              letterSpacing: '0.025em'
            }}>캘린더에 추가</h2>
            <p style={{
              color: '#4b5563',
              marginBottom: '2rem',
              fontSize: '0.875rem',
              fontWeight: 300
            }}>
              결혼식 일정을 캘린더에 추가하시겠어요?
            </p>
            <button
              onClick={downloadICS}
              style={{
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                borderRadius: '0.75rem',
                padding: '0.75rem 2rem',
                color: '#4b5563',
                fontSize: '0.875rem',
                fontWeight: 300,
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 2px 8px 0 rgba(0,0,0,0.05)',
                transition: 'all 300ms'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.7)'}
            >
              <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              캘린더에 추가하기
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '3rem 1rem', textAlign: 'center', color: '#6b7280' }}>
        <div className="container">
          <p style={{ marginBottom: '0.375rem', fontSize: '0.875rem', fontWeight: 300 }}>{config.groom.name} ♥ {config.bride.name}</p>
          <p style={{ fontSize: '0.75rem', fontWeight: 300 }}>{config.wedding.dateText}</p>
          <p style={{ fontSize: '0.75rem', fontWeight: 300 }}>{config.wedding.devDescription}</p>
          <p style={{ fontSize: '0.75rem', fontWeight: 300 }}>{config.wedding.devRepository}</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
