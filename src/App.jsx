import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './App.css';

function App() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [copied, setCopied] = useState({ groom: false, bride: false });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // D-Day 카운터
  useEffect(() => {
    const targetDate = new Date('2026-04-18T13:00:00').getTime();
    
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
  const galleryImages = [
    '/gallery-1.jpg',
    // '/gallery-2.jpg',
    // '/gallery-3.jpg',
  ].filter(Boolean);

  // 갤러리 스와이프 핸들러
  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diffX = startX - currentX;

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

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleMouseDown = (e) => {
    setStartX(e.clientX);
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    const diffX = startX - currentX;

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

  // ICS 파일 다운로드 함수
  const downloadICS = () => {
    const event = {
      title: '아롬 & 경륜 결혼식',
      description: '에스가든웨딩홀 청주에서 열리는 결혼식에 초대합니다.',
      location: '에스가든웨딩홀 청주',
      startDate: '20260418T130000',
      endDate: '20260418T150000',
    };

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Wedding Invitation//KR
BEGIN:VEVENT
UID:wedding-2026-04-18@invitation
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:20260418T130000
DTEND:20260418T150000
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

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom right, #ffe4e6, #fce7f3, #e0e7ff)' 
    }}>
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
          background: 'linear-gradient(to bottom right, rgba(251, 113, 133, 0.2), rgba(244, 114, 182, 0.2), rgba(196, 181, 253, 0.2))'
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
              color: 'rgba(251, 113, 133, 0.8)', 
              marginBottom: '2rem',
              fontWeight: 300
            }}>WEDDING INVITATION</div>
            <h1 style={{ 
              fontSize: '2.25rem', 
              fontWeight: 300, 
              color: '#1f2937', 
              marginBottom: '0.75rem',
              letterSpacing: '-0.025em'
            }}>아롬</h1>
            <div style={{ fontSize: '1.875rem', marginBottom: '0.75rem' }}>
              <span style={{ color: '#fda4af' }}>♥</span>
            </div>
            <h1 style={{ 
              fontSize: '2.25rem', 
              fontWeight: 300, 
              color: '#1f2937', 
              marginBottom: '3rem',
              letterSpacing: '-0.025em'
            }}>경륜</h1>
            <div style={{ 
              fontSize: '1rem', 
              color: '#4b5563', 
              marginBottom: '0.25rem',
              fontWeight: 300,
              letterSpacing: '0.025em'
            }}>
              2026년 4월 18일 토요일
            </div>
            <div style={{ 
              fontSize: '0.875rem', 
              color: '#6b7280', 
              fontWeight: 300
            }}>오후 1시</div>
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
            }}>초대합니다</h2>
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
                서로의 삶에 따뜻한 동반자가 되어<br />
                사랑과 신뢰로 한 가정을 이루려 합니다.
              </p>
              <p style={{ fontWeight: 300, paddingTop: '0.5rem' }}>
                축복의 자리에 귀한 걸음 하시어<br />
                저희의 새로운 시작을 함께해 주세요.
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
              <p style={{ fontWeight: 300 }}>이원조 · 이정숙의 장남 아롬</p>
              <p style={{ fontWeight: 300 }}>신락현 · 곽광숙의 장녀 경륜</p>
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
                src="/pixel-art.gif" 
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
            padding: '1.5rem',
            boxShadow: '0 8px 32px 0 rgba(0,0,0,0.06)',
            border: '1px solid rgba(255, 255, 255, 0.8)'
          }}>
            <div 
              style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '0.75rem'
              }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <div 
                style={{
                  display: 'flex',
                  transition: 'transform 300ms ease-out',
                  transform: `translateX(-${currentImageIndex * 100}%)`
                }}
              >
                {galleryImages.map((image, index) => (
                  <div key={index} style={{ minWidth: '100%', flexShrink: 0 }}>
                    <img 
                      src={image}
                      alt={`갤러리 ${index + 1}`}
                      style={{
                        width: '100%',
                        height: 'auto',
                        borderRadius: '0.75rem',
                        boxShadow: '0 4px 16px 0 rgba(0,0,0,0.08)',
                        objectFit: 'cover'
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
                      alignItems: 'center',
                      justifyContent: 'center',
                      aspectRatio: '16/9',
                      background: 'linear-gradient(to bottom right, #ffe4e6, #fce7f3)',
                      borderRadius: '0.75rem'
                    }}>
                      <div style={{ color: '#9ca3af', textAlign: 'center', padding: '1rem' }}>
                        <svg style={{ width: '4rem', height: '4rem', margin: '0 auto 0.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p style={{ fontSize: '0.875rem', fontWeight: 300 }}>사진 {index + 1}</p>
                        <p style={{ fontSize: '0.75rem', marginTop: '0.25rem', color: '#9ca3af' }}>/public/gallery-{index + 1}.jpg 파일을 추가하세요</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
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
                      onClick={() => setCurrentImageIndex(index)}
                      style={{
                        width: index === currentImageIndex ? '1.5rem' : '0.5rem',
                        height: '0.5rem',
                        borderRadius: '9999px',
                        border: 'none',
                        backgroundColor: index === currentImageIndex ? '#fb7185' : '#d1d5db',
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
              <p style={{ fontSize: '1rem', fontWeight: 300, marginBottom: '0.5rem' }}>에스가든웨딩홀 청주</p>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 300, marginBottom: '1rem' }}>2026년 4월 18일 (토) 오후 1시</p>
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: '#4b5563', fontWeight: 300 }}>
                <p style={{ marginBottom: '0.75rem', fontWeight: 400 }}>주소</p>
                <p style={{ lineHeight: 1.625 }}>
                  충청북도 청주시 서원구 1순환로 854<br />
                  <span style={{ color: '#6b7280' }}>(산남동 320번지, CJB미디어센터)</span>
                </p>
              </div>
            </div>
            <div style={{ marginBottom: '1.5rem', fontSize: '0.875rem', color: '#4b5563', fontWeight: 300, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <p style={{ textAlign: 'center', marginBottom: '0.75rem', fontWeight: 400 }}>교통편</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', textAlign: 'center' }}>
                <p>남부터미널 | 자차 5분 · 대중교통 20분</p>
                <p>가경시외버스터미널 | 자차 10분 · 대중교통 30분</p>
                <p>서청주IC | 자차 15분</p>
              </div>
              <p style={{ textAlign: 'center', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(229, 231, 235, 0.6)' }}>버스 | 30-1, 30-2, 710, 843, 851</p>
            </div>
            <div style={{
              borderRadius: '0.75rem',
              overflow: 'hidden',
              boxShadow: '0 4px 16px 0 rgba(0,0,0,0.08)',
              marginBottom: '1rem',
              height: '280px'
            }}>
              <iframe
                src="https://map.kakao.com/link/search/에스가든웨딩홀 청주"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                title="카카오맵"
              ></iframe>
            </div>
            <div style={{ textAlign: 'center' }}>
              <a
                href="https://map.kakao.com/link/search/에스가든웨딩홀 청주"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  backdropFilter: 'blur(4px)',
                  WebkitBackdropFilter: 'blur(4px)',
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  borderRadius: '0.75rem',
                  padding: '0.625rem 1.5rem',
                  color: '#4b5563',
                  fontSize: '0.875rem',
                  fontWeight: 300,
                  textDecoration: 'none',
                  boxShadow: '0 2px 8px 0 rgba(0,0,0,0.05)',
                  transition: 'all 300ms',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.7)'}
              >
                카카오맵에서 열기
              </a>
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
                <p style={{ fontWeight: 300 }}>은행명 <span style={{ marginLeft: '0.5rem' }}>예시은행</span></p>
                <p style={{ fontWeight: 300 }}>계좌번호 <span style={{ marginLeft: '0.5rem' }}>123-456-789012</span></p>
                <p style={{ fontWeight: 300 }}>예금주 <span style={{ marginLeft: '0.5rem' }}>아롬</span></p>
              </div>
              <button
                onClick={() => copyToClipboard('예시은행 123-456-789012 아롬', 'groom')}
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
                <p style={{ fontWeight: 300 }}>은행명 <span style={{ marginLeft: '0.5rem' }}>예시은행</span></p>
                <p style={{ fontWeight: 300 }}>계좌번호 <span style={{ marginLeft: '0.5rem' }}>987-654-321098</span></p>
                <p style={{ fontWeight: 300 }}>예금주 <span style={{ marginLeft: '0.5rem' }}>경륜</span></p>
              </div>
              <button
                onClick={() => copyToClipboard('예시은행 987-654-321098 경륜', 'bride')}
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
          <p style={{ marginBottom: '0.375rem', fontSize: '0.875rem', fontWeight: 300 }}>아롬 ♥ 경륜</p>
          <p style={{ fontSize: '0.75rem', fontWeight: 300 }}>2026년 4월 18일</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
