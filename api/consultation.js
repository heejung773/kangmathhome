const ALLOWED_ORIGIN = 'https://www.kangmath.com';

const SCHOOLS = new Set(['동화고', '다산고', '도농고', '와부고', '인창고', '가운고', '평내고', '중학교', '기타']);
const GRADES = new Set(['예비고1(중3)', '고1', '고2', '고3/N수']);
const CONSULT_TYPES = new Set([
  '내신 1등급 대비반',
  '입학 레벨테스트 신청',
  '자물쇠반 (Lock & Study) 문의',
  '예비고1 고교선택 및 선행 전략',
  '수능/모의고사 심화 클리닉'
]);

function clean(value, maxLength) {
  return typeof value === 'string' ? value.trim().replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').slice(0, maxLength) : '';
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Vary', 'Origin');
  const origin = req.headers.origin;
  if (origin && origin !== ALLOWED_ORIGIN) return res.status(403).json({ error: '허용되지 않은 요청입니다.' });

  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: '지원하지 않는 요청입니다.' });
  if (!req.headers['content-type']?.toLowerCase().includes('application/json')) {
    return res.status(415).json({ error: '올바른 요청 형식이 아닙니다.' });
  }

  const { RESEND_API_KEY, CONSULTATION_TO_EMAIL, CONSULTATION_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !CONSULTATION_TO_EMAIL || !CONSULTATION_FROM_EMAIL) {
    console.error('Consultation email environment variables are not configured.');
    return res.status(503).json({ error: '상담 접수 기능을 준비 중입니다. 전화로 문의해 주세요.' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { return res.status(400).json({ error: '요청 내용을 확인해 주세요.' }); }
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return res.status(400).json({ error: '요청 내용을 확인해 주세요.' });

  const studentName = clean(body.studentName, 40);
  const schoolName = clean(body.schoolName, 30);
  const gradeLevel = clean(body.gradeLevel, 20);
  const phoneNumber = clean(body.phoneNumber, 20);
  const consultType = clean(body.consultType, 60);
  const notes = clean(body.notes, 1000);
  const phoneDigits = phoneNumber.replace(/\D/g, '');

  if (!studentName || !SCHOOLS.has(schoolName) || !GRADES.has(gradeLevel) || !/^01[016789]\d{7,8}$/.test(phoneDigits) || !CONSULT_TYPES.has(consultType) || body.privacyConsent !== true) {
    return res.status(400).json({ error: '필수 입력 또는 개인정보 동의를 확인해 주세요.' });
  }

  const fields = [
    ['학생 이름', studentName],
    ['학교', schoolName],
    ['학년', gradeLevel],
    ['학부모 연락처', phoneNumber],
    ['희망 상담', consultType],
    ['상담 메모', notes || '(없음)']
  ];
  const text = fields.map(([label, value]) => `${label}: ${value}`).join('\n');
  const html = `<h2>강석수학 상담 신청</h2><dl>${fields.map(([label, value]) => `<dt><strong>${escapeHtml(label)}</strong></dt><dd>${escapeHtml(value).replace(/\n/g, '<br>')}</dd>`).join('')}</dl>`;

  try {
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: CONSULTATION_FROM_EMAIL,
        to: [CONSULTATION_TO_EMAIL],
        subject: `[강석수학 상담] ${studentName} 학생 · ${schoolName} ${gradeLevel}`,
        text,
        html
      })
    });
    if (!emailResponse.ok) {
      const errorBody = await emailResponse.text();
      console.error('Consultation email provider rejected the request:', emailResponse.status, errorBody.slice(0, 500));
      return res.status(502).json({ error: '상담 전송에 실패했습니다. 잠시 후 다시 시도하거나 전화로 문의해 주세요.' });
    }
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Consultation email delivery failed:', error.message);
    return res.status(502).json({ error: '상담 전송에 실패했습니다. 잠시 후 다시 시도하거나 전화로 문의해 주세요.' });
  }
};
