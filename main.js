/**
 * 강석수학 (KANG MATH) - 공식 홈페이지 스크립트
 * kangmath.com / 강석수학.com
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Math Background Canvas Animation
  // ==========================================
  const canvas = document.getElementById('math-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(Math.floor(window.innerWidth / 35), 45);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1.2,
        symbols: ['∫', '∑', 'lim', 'dx', 'π', 'θ', 'f(x)', 'Δ', '√'][Math.floor(Math.random() * 9)]
      });
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      // Draw glowing lines between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 160) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.15 * (1 - dist / 160)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw floating particles and subtle math symbols
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(96, 165, 250, 0.4)';
        ctx.fill();

        ctx.font = '11px Outfit, sans-serif';
        ctx.fillStyle = 'rgba(148, 163, 184, 0.25)';
        ctx.fillText(p.symbols, p.x + 6, p.y - 6);
      });

      requestAnimationFrame(animate);
    }
    animate();
  }

  // ==========================================
  // 2. Sticky Header & Top Scroll Button
  // ==========================================
  const header = document.getElementById('header');
  const scrollTopBtn = document.getElementById('scroll-top-btn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    if (scrollTopBtn) {
      if (window.scrollY > 400) {
        scrollTopBtn.style.opacity = '1';
        scrollTopBtn.style.pointerEvents = 'auto';
      } else {
        scrollTopBtn.style.opacity = '0.4';
      }
    }
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==========================================
  // 3. Mobile Navigation Menu Toggle
  // ==========================================
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const spans = mobileToggle.querySelectorAll('span');
      if (navMenu.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    // Close menu when clicking nav links
    navMenu.querySelectorAll('.nav-link, .nav-cta-btn').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        const spans = mobileToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      });
    });
  }

  // ==========================================
  // 4. Metric Number Counters on Scroll
  // ==========================================
  const counters = document.querySelectorAll('.counter');
  let animatedCounters = false;

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animatedCounters) {
        animatedCounters = true;
        counters.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          const duration = 1500;
          const stepTime = 20;
          const steps = duration / stepTime;
          const increment = target / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              counter.textContent = target;
              clearInterval(timer);
            } else {
              counter.textContent = Math.floor(current);
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.5 });

  const metricsSection = document.querySelector('.hero-metrics');
  if (metricsSection) {
    countObserver.observe(metricsSection);
  }

  // ==========================================
  // 5. School Customized Strategy Tabs
  // ==========================================
  const schoolData = {
    donghwa: {
      name: "동화고등학교",
      badge: "비평준화 명문 · 고난도 변별력 극대화",
      trend: "전국구 모의고사 1등급권 학생들이 다수 포진해 있어, 단순 계산 문제보다는 평가원 기출 변형 및 준킬러·킬러 문항에서 1등급이 결정됩니다.",
      strategy: [
        "평가원·교육청 4점 기출 10개년 완벽 변형 훈련",
        "50분 시험 시간 중 20분 내 기본 문항 100% 정답률 확보 훈련",
        "부분점수 감점 요인을 사전 차단하는 서술형 모범 답안 첨삭"
      ],
      videoTag: "동화고 기출 손글씨 직강 유튜브 업로드 완료"
    },
    dasan: {
      name: "다산고등학교",
      badge: "다산신도시 중심 고교 · 실수 방지 & 서술형 승부",
      trend: "학교 부교재와 교과서 심화 발전 문제의 연계율이 높으며, 계산 실수를 유발하는 함정 문항이 복병으로 작용합니다.",
      strategy: [
        "학교 지정 부교재 및 유인물 3회독 & 변형 문항 집중 훈련",
        "실수 패턴 1:1 교정 클리닉 (자주 틀리는 연산/조건 누락 방지)",
        "서술형 단계별 점수 배점 기준에 맞춘 답안 구조화 훈련"
      ],
      videoTag: "다산고 1학기 중간/기말 전 문항 해설 완비"
    },
    donong: {
      name: "도농고등학교",
      badge: "핵심 유형 정복 & 1등급 킬러 2문항 쟁취",
      trend: "기본 및 중상 난이도 문항이 75%를 차지하고, 1~2등급을 가르는 킬러 문항 2~3개가 승부처입니다.",
      strategy: [
        "대표 빈출 유형의 풀이 시간 최소화 (기계적 체화)",
        "킬러 문항 발상 조건 독해 훈련 (조건식 분해법 전수)",
        "직전 파이널 모의고사로 실전 긴장감 극복"
      ],
      videoTag: "도농고 내신 기출 분석 리포트 보유"
    },
    wabu: {
      name: "와부고등학교",
      badge: "자율형 공립고 · 깊이 있는 수학적 논리 전개",
      trend: "수능형 고난도 문항과 개념의 증명 과정을 묻는 깊이 있는 문제가 출제되어, 벼락치기식 암기로는 상위권 진입이 불가능합니다.",
      strategy: [
        "<수학은 개념을 사랑해> 기반의 완벽한 증명 백지 훈련",
        "EBS 수능특강·수능완성 고난도 문항 변형 대비",
        "원장 직접 1:1 손글씨 논리 풀이 지도"
      ],
      videoTag: "와부고 킬러 문항 손글씨 해설 영상 제공"
    },
    inchang: {
      name: "인창고등학교",
      badge: "구리 명문 · 학교 프린트 100% 흡수 & 시간 단축",
      trend: "선생님별 수업 프린트와 기출 응용 문제가 주를 이루며, 시험지 후반부 고난도 문항의 시간 부족 현상이 흔합니다.",
      strategy: [
        "학교 프린트 심화 변형 5배수 문항집 제공",
        "타임어택 모의훈련으로 객관식 킬러 풀이 시간 확보",
        "개념 누락 단원 1:1 보충 클리닉"
      ],
      videoTag: "인창고 학기별 출제 경향 분석 완료"
    },
    pyeongnae: {
      name: "평내고 · 가운고등학교",
      badge: "내신 최상위권 안정화 & 수능 연계 완성",
      trend: "내신 성적을 1등급으로 견고히 굳혀 수시 학생부종합전형 및 수능 최저 기준을 동시에 충족해야 하는 전략적 학교군입니다.",
      strategy: [
        "내신 만점을 목표로 하는 꼼꼼한 전 범위 개념 회독",
        "수능 모의고사 1등급을 위한 대수·미적분 심화 개념 체화",
        "자물쇠반(Lock & Study)을 통한 방학 순공 집중 몰입"
      ],
      videoTag: "평내고·가운고 맞춤 1등급 대비 교재 완비"
    }
  };

  const schoolContent = document.getElementById('school-content');
  const schoolButtons = document.querySelectorAll('.school-btn');

  function renderSchool(key) {
    const data = schoolData[key];
    if (!data || !schoolContent) return;

    schoolContent.innerHTML = `
      <div class="school-card-inner" style="display: grid; grid-template-columns: 1fr 1fr; gap: 36px; align-items: center;">
        <div class="sc-left">
          <div class="badge-pill" style="display:inline-block; margin-bottom: 12px; background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59,130,246,0.3); padding: 4px 14px; border-radius: 99px; font-weight:700;">
            ${data.badge}
          </div>
          <h3 style="font-size: 1.8rem; margin-bottom: 16px; color: #ffffff;">${data.name} 1등급 맞춤 전략</h3>
          <p style="font-size: 1rem; color: #cbd5e1; line-height: 1.7; margin-bottom: 24px; word-break: keep-all;">
            <strong>[출제 경향]</strong> ${data.trend}
          </p>
          <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px; padding: 12px 16px; display: inline-flex; align-items: center; gap: 10px; color: #f87171; font-size: 0.88rem; font-weight: 600;">
            <svg style="width:18px; height:18px; flex-shrink:0;" viewBox="0 0 24 24"><path fill="currentColor" d="M10 15l5.2-3L10 9v6z"/></svg>
            <span>${data.videoTag}</span>
          </div>
        </div>
        <div class="sc-right" style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 14px; padding: 28px;">
          <h4 style="font-size: 1.15rem; color: #fbbf24; margin-bottom: 18px; display: flex; align-items: center; gap: 8px;">
            <span>🛡️</span> 강석수학만의 필승 대비 솔루션
          </h4>
          <ul style="display: flex; flex-direction: column; gap: 14px;">
            ${data.strategy.map(item => `
              <li style="display: flex; align-items: flex-start; gap: 12px; font-size: 0.95rem; color: #f1f5f9; line-height: 1.5;">
                <span style="color: #10b981; font-weight: bold; flex-shrink:0;">✔</span>
                <span>${item}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
    `;
  }

  // Initial school load
  renderSchool('donghwa');

  schoolButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      schoolButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const schoolKey = btn.getAttribute('data-school');
      renderSchool(schoolKey);
    });
  });

  // ==========================================
  // 6. Curriculum Tabs Switching
  // ==========================================
  const curriData = {
    'pre-high': {
      title: "예비고1 (중3) 로드맵",
      sub: "입시는 산수입니다. 18,503 법칙으로 고교 선택부터 공통수학 완성까지",
      desc: "중3의 고교 선택은 고3의 대입 못지않게 중요합니다. 자사고/일반고 선택 기준을 명쾌하게 세우고, 고등학교 입학 전 공통수학1·2의 개념을 완벽히 마스터합니다.",
      courses: [
        {
          name: "중3 고교선택 입시 컨설팅",
          detail: "동화고, 다산고, 도농고, 자사고 등 목표 고교별 유불리 분석 및 3개년 대입 로드맵 설계"
        },
        {
          name: "공통수학 1·2 개념 구조화",
          detail: "자체 개념서 <수학은 개념을 사랑해> 기반 백지 유도 및 증명 중심 기본+심화 2회독"
        },
        {
          name: "고1 내신 킬러 사전 훈련",
          detail: "구리·남양주 주요 고교 1학기 중간고사 기출 모의평가 진행으로 실전 감각 극대화"
        }
      ]
    },
    'high1': {
      title: "고등학교 1학년 정규반",
      sub: "2022 개정 교육과정 완벽 적응 · 흔들리지 않는 내신 1등급",
      desc: "내신 5등급제 개편에 맞추어 상위 10% 1등급을 안정적으로 선점합니다. 시험 5주 전부터 학교별 부교재와 기출 10개년 변형 문항으로 철벽 대비합니다.",
      courses: [
        {
          name: "학교별 내신 파이널 기출 변형",
          detail: "동화·다산·도농·와부 등 학교별 출제 경향 100% 반영 교재 및 1:1 오답 클리닉"
        },
        {
          name: "서술형 감점 제로 피드백",
          detail: "원장이 직접 채점하여 부분점수 누수를 막는 서술형 논리 전개 첨삭"
        },
        {
          name: "방학 Lock & Study (자물쇠반)",
          detail: "순공 시간을 강제 확보하여 다음 학기 전 범위를 완성하는 자기주도 몰입 프로그램"
        }
      ]
    },
    'high2': {
      title: "고등학교 2학년 심화반",
      sub: "대수 & 미적분1 정복 · 내신 1등급과 수능 1등급의 완벽한 징검다리",
      desc: "수능 직접 출제 과목인 대수와 미적분1의 킬러 단원(수열, 삼각함수, 함수의 극한과 연속)을 시각적 직관과 논리적 증명으로 꿰뚫습니다.",
      courses: [
        {
          name: "대수 & 미적분1 심화 개념 완성",
          detail: "공식 암기가 아닌 기하학적 의미와 그래프 추론 발상법 집중 전수"
        },
        {
          name: "모의고사 킬러/준킬러 정밀 분석",
          detail: "교육청 및 평가원 기출 4점 문항 조건 분해 및 단계별 해법 훈련 (유튜브 손글씨 제공)"
        },
        {
          name: "예비 고3 조기 수능 체제 돌입",
          detail: "2학기 기말고사 직후 수능 실전 모드로 전환하여 겨울방학 골든타임 선점"
        }
      ]
    },
    'high3': {
      title: "고3 & 수능 / 논술 파이널",
      sub: "수능 100분 타임어택 · 킬러 문항 발상 훈련 및 수리논술 완성",
      desc: "아무리 어려운 킬러 문항도 결국 기본 개념의 결합입니다. 20년 수능 입시 노하우로 출제자의 의도를 역추적하는 1등급 실전 솔루션을 완성합니다.",
      courses: [
        {
          name: "평가원 킬러 조건 해석 훈련",
          detail: "낯선 신유형 문항을 익숙한 개념 도구로 치환하는 발상 프로세스 체화"
        },
        {
          name: "100분 실전 봉투 모의고사",
          detail: "매주 실전과 동일한 환경에서 타임어택 시험 진행 및 원장 심층 해설 직강"
        },
        {
          name: "주요 대학별 수리논술 특강",
          detail: "자연계열 논술 기출 정밀 분석 및 단계별 논리 서술 1:1 대면 첨삭"
        }
      ]
    }
  };

  const curriContent = document.getElementById('curri-content');
  const curriButtons = document.querySelectorAll('.curri-tab-btn');

  function renderCurri(key) {
    const data = curriData[key];
    if (!data || !curriContent) return;

    curriContent.innerHTML = `
      <div style="margin-bottom: 28px;">
        <h3 style="font-size: 1.6rem; color: #ffffff; margin-bottom: 8px;">${data.title}</h3>
        <p style="font-size: 1.05rem; color: #38bdf8; font-weight: 600; margin-bottom: 12px;">${data.sub}</p>
        <p style="font-size: 0.95rem; color: #94a3b8; line-height: 1.7; word-break: keep-all;">${data.desc}</p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
        ${data.courses.map((c, i) => `
          <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 22px; transition: all 0.3s ease;">
            <div style="font-family: var(--font-num); font-size: 0.8rem; font-weight: 800; color: #3b82f6; margin-bottom: 8px;">MODULE 0${i + 1}</div>
            <h4 style="font-size: 1.1rem; color: #f8fafc; margin-bottom: 10px;">${c.name}</h4>
            <p style="font-size: 0.88rem; color: #cbd5e1; line-height: 1.6;">${c.detail}</p>
          </div>
        `).join('')}
      </div>
    `;
  }

  // Initial load
  renderCurri('pre-high');

  curriButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      curriButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const curriKey = btn.getAttribute('data-curri');
      renderCurri(curriKey);
    });
  });

  // ==========================================
  // 7. FAQ Accordion Interaction
  // ==========================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // ==========================================
  // 8. Consultation Form Submission & Modal
  // ==========================================
  const consultForm = document.getElementById('consultation-form');
  const successModal = document.getElementById('success-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalDesc = document.getElementById('modal-desc');

  if (consultForm && successModal) {
    consultForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const studentName = document.getElementById('student-name').value.trim();
      const schoolName = document.getElementById('school-name').value;
      const gradeLevel = document.getElementById('grade-level').value;
      const phoneNumber = document.getElementById('phone-number').value.trim();
      const consultType = document.getElementById('consult-type').value;
      const notes = document.getElementById('notes').value.trim();

      // Simple phone format check
      if (!phoneNumber || phoneNumber.length < 9) {
        alert('연락처를 정확히 입력해 주세요.');
        return;
      }

      // Save submission data in localStorage for persistence
      const consultationRecord = {
        name: studentName,
        school: schoolName,
        grade: gradeLevel,
        phone: phoneNumber,
        type: consultType,
        notes: notes,
        date: new Date().toLocaleString()
      };

      try {
        const existing = JSON.parse(localStorage.getItem('kangmath_consultations') || '[]');
        existing.push(consultationRecord);
        localStorage.setItem('kangmath_consultations', JSON.stringify(existing));
      } catch (err) {
        console.error('Storage error:', err);
      }

      // Update modal text
      if (modalDesc) {
        modalDesc.innerHTML = `
          <strong>${studentName}</strong> 학생(${schoolName} ${gradeLevel})의 <strong>[${consultType}]</strong> 신청이 정상 접수되었습니다.<br><br>
          입력하신 학부모 연락처(<strong>${phoneNumber}</strong>)로 이강석 원장 연구실에서 24시간 이내에 직접 확인 전화 또는 안내 문자를 발송해 드립니다.
        `;
      }

      // Show modal
      successModal.classList.add('active');
      consultForm.reset();
    });

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', () => {
        successModal.classList.remove('active');
      });
    }

    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) {
        successModal.classList.remove('active');
      }
    });
  }

});
