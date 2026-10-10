/* 강석수학 (www.kangmath.com) — 메뉴, 학교 탭, 유튜브, 하단 바, 상담 신청 */
(() => {
  const btn = document.getElementById('menuBtn'), sheet = document.getElementById('sheet');
  const setMenu = open => { sheet.classList.toggle('open', open); btn.setAttribute('aria-expanded', open); btn.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기'); document.body.style.overflow = open ? 'hidden' : ''; };
  btn.addEventListener('click', () => setMenu(!sheet.classList.contains('open')));
  sheet.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  const tabs = [...document.querySelectorAll('[role="tab"]')];
  const select = t => tabs.forEach(x => { const on = x === t; x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1; document.getElementById(x.getAttribute('aria-controls')).hidden = !on; });
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', e => { const d = ['ArrowRight','ArrowDown'].includes(e.key) ? 1 : ['ArrowLeft','ArrowUp'].includes(e.key) ? -1 : 0; if (d) { e.preventDefault(); const n = tabs[(i + d + tabs.length) % tabs.length]; select(n); n.focus(); } });
  });

  document.querySelectorAll('.yt-lite').forEach(b => b.addEventListener('click', () => {
    const f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + b.dataset.id + '?autoplay=1';
    f.title = b.getAttribute('aria-label'); f.allow = 'autoplay; encrypted-media; picture-in-picture'; f.allowFullscreen = true;
    b.replaceChildren(f);
  }, { once: true }));

  document.querySelectorAll('[data-type]').forEach(a => a.addEventListener('click', () => { document.getElementById('f-type').value = a.dataset.type; }));

  const bar = document.getElementById('bottomBar'), seen = new Set();
  const io = new IntersectionObserver(es => { es.forEach(e => e.isIntersecting ? seen.add(e.target) : seen.delete(e.target)); bar.classList.toggle('hide', seen.size > 0); }, { threshold: 0.15 });
  [document.querySelector('.hero-btns'), document.getElementById('consultation')].forEach(el => io.observe(el));

  // 상담 신청: /api/consultation 으로 전송 (값은 서버 허용 목록과 같아야 함)
  const form = document.getElementById('consultForm');
  const submitBtn = document.getElementById('consultSubmit');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const msg = document.getElementById('formMsg');
    const err = t => { msg.style.color = '#FCA5A5'; msg.textContent = t; };
    const studentName = form.studentName.value.trim();
    const gradeLevel = form.gradeLevel.value;
    const schoolName = form.schoolName.value;
    const phoneNumber = form.phoneNumber.value.trim();
    if (!studentName || !gradeLevel || !schoolName) return err('학생 이름, 학년, 학교를 입력해 주세요.');
    if (!/^01[016789]\d{7,8}$/.test(phoneNumber.replace(/\D/g, ''))) { form.phoneNumber.focus(); return err('연락처를 정확히 입력해 주세요.'); }
    if (!document.getElementById('f-agree').checked) return err('개인정보 수집·이용에 동의해 주세요.');

    const label = submitBtn.textContent;
    submitBtn.disabled = true; submitBtn.textContent = '접수 중입니다…';
    msg.style.color = ''; msg.textContent = '';
    try {
      const res = await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName, schoolName, gradeLevel, phoneNumber,
          consultType: form.consultType.value,
          notes: form.notes.value.trim(),
          privacyConsent: true
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || '전송에 실패했습니다. 잠시 후 다시 시도하거나 전화(010-3628-8315)로 문의해 주세요.');
      msg.style.color = '';
      msg.textContent = studentName + ' 학생(' + schoolName + ' ' + gradeLevel + ') 상담 신청이 접수되었습니다. 이강석 대표강사가 24시간 이내에 확인 후 연락드리겠습니다.';
      form.reset();
    } catch (error) {
      err(error.message || '전송에 실패했습니다. 전화(010-3628-8315)로 문의해 주세요.');
    } finally {
      submitBtn.disabled = false; submitBtn.textContent = label;
    }
  });
})();
