// 04 '내 컴퓨터에서 하는 작업' 경로 버튼: 누르면 클립보드에 복사하고 1.5초 동안 '복사됨' 표시
(() => {
  const status = document.getElementById('copy-status');

  function fallbackCopy(text) {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.top = '-1000px';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (error) { ok = false; }
    area.remove();
    return ok;
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try { await navigator.clipboard.writeText(text); return true; } catch (error) { /* 아래 방법으로 */ }
    }
    return fallbackCopy(text);
  }

  document.querySelectorAll('.copy-path').forEach((button) => {
    const hint = button.querySelector('.copy-hint');
    let timer;
    button.addEventListener('click', async () => {
      const path = button.dataset.path;
      const ok = await copyText(path);
      window.clearTimeout(timer);
      button.classList.remove('copied', 'failed');
      button.classList.add(ok ? 'copied' : 'failed');
      hint.textContent = ok ? '복사됨' : '복사 안 됨';
      if (status) status.textContent = ok ? `${path} 복사됨` : '복사하지 못했습니다. 경로를 직접 선택해 주세요.';
      if (!ok) {
        // 복사가 막힌 환경: 경로 글자를 선택해 두어 Ctrl+C 로 바로 복사할 수 있게
        const range = document.createRange();
        range.selectNodeContents(button.querySelector('code'));
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
      }
      timer = window.setTimeout(() => {
        button.classList.remove('copied', 'failed');
        hint.textContent = '복사';
        if (status) status.textContent = '';
      }, 1500);
    });
  });
})();
