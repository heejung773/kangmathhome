(() => {
  const USER_HASH = 'fecedf5b90a52f9377d2d5bb023b698c6ed90b1f2c8d857c345d70f7f76e264e';
  const loginCard = document.getElementById('login-card');
  const dashboard = document.getElementById('dashboard');
  const form = document.getElementById('login-form');
  const message = document.getElementById('login-message');
  const sessionKey = 'kangmath_admin_session';

  async function digest(value) {
    const bytes = new TextEncoder().encode(value);
    const hash = await crypto.subtle.digest('SHA-256', bytes);
    return [...new Uint8Array(hash)].map(byte => byte.toString(16).padStart(2, '0')).join('');
  }

  function showDashboard() { loginCard.hidden = true; dashboard.hidden = false; }
  function showLogin() { loginCard.hidden = false; dashboard.hidden = true; }

  if (sessionStorage.getItem(sessionKey) === 'ok') showDashboard();

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = form.username.value.trim();
    const password = form.password.value;
    const hash = await digest(`${username}:${password}`);
    if (hash === USER_HASH && username === 'teacher01') {
      sessionStorage.setItem(sessionKey, 'ok');
      message.textContent = '';
      form.reset();
      showDashboard();
    } else {
      message.textContent = '아이디 또는 비밀번호를 확인하세요.';
    }
  });

  document.getElementById('logout').addEventListener('click', () => {
    sessionStorage.removeItem(sessionKey);
    showLogin();
    form.username.focus();
  });
})();
