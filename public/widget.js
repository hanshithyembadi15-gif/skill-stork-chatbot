(function () {
  // ---- Configuration ---------------------------------------------------
  // If you host the backend on a different domain than the website itself,
  // change API_BASE to that full URL, e.g. "https://your-backend.onrender.com"
  const API_BASE = window.SKILLSTORK_CHAT_API || '';
  const LOGO_URL = 'https://skillstork.org/wp-content/uploads/2025/10/new-logo.png';
  // -----------------------------------------------------------------------

  const NAVY = '#1E3350';
  const NAVY2 = '#2A4770';
  const GOLD = '#E3A73F';
  const GOLD2 = '#EDBB63';
  const PARCHMENT = '#FAF5EA';
  const SAGE = '#6E8F7C';
  const INK = '#223142';
  const MUTED = '#8B8371';

  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,600;0,700;1,500&family=Inter:wght@400;500;600;700&display=swap';
  document.head.appendChild(fontLink);

  const style = document.createElement('style');
  style.textContent = `
    .ss-launcher {
      position: fixed; bottom: 24px; right: 24px;
      width: 62px; height: 62px; border-radius: 50%;
      background: #ffffff;
      box-shadow: 0 10px 30px rgba(30,51,80,0.3);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; z-index: 999999;
      transition: transform 0.15s ease;
      border: 2px solid ${GOLD};
      padding: 6px;
    }
    .ss-launcher:hover { transform: scale(1.06); }
    .ss-launcher img { width: 100%; height: 100%; object-fit: contain; }

    .ss-panel {
      position: fixed; bottom: 96px; right: 24px;
      width: 380px; max-width: calc(100vw - 32px);
      height: 620px; max-height: calc(100vh - 140px);
      background: #ffffff;
      border-radius: 22px;
      box-shadow: 0 28px 70px -18px rgba(30,51,80,0.4), 0 6px 16px rgba(30,51,80,0.1);
      display: none; flex-direction: column; overflow: hidden;
      z-index: 999999;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      animation: ss-panel-in 0.3s ease-out;
    }
    .ss-panel.open { display: flex; }
    @keyframes ss-panel-in {
      from { opacity: 0; transform: translateY(10px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    .ss-header {
      position: relative;
      background: #ffffff;
      padding: 16px 18px;
      display: flex; align-items: center; gap: 12px;
      border-bottom: 1px solid rgba(30,51,80,0.08);
      overflow: hidden;
    }
    .ss-header .ss-watermark {
      position: absolute; top: -16px; right: -8px; width: 100px; height: 100px;
      color: ${NAVY}; opacity: 0.045; transform: rotate(8deg); pointer-events: none;
    }
    .ss-header img.ss-logo { height: 38px; width: auto; object-fit: contain; position: relative; z-index: 1; }
    .ss-header-text { flex: 1; position: relative; z-index: 1; }
    .ss-header-text .ss-eyebrow {
      display: flex; align-items: center; gap: 6px;
      font-size: 10.5px; font-weight: 700; color: ${NAVY}; letter-spacing: 0.06em;
    }
    .ss-header-text .ss-eyebrow svg { width: 12px; height: 12px; color: ${GOLD}; }
    .ss-header-text .ss-status {
      margin: 4px 0 0; display: flex; align-items: center; gap: 5px;
      font-family: 'Fraunces', serif; font-style: italic; font-weight: 500;
      font-size: 12px; color: ${MUTED};
    }
    .ss-live-dot {
      width: 6px; height: 6px; border-radius: 50%; background: ${SAGE};
      animation: ss-pulse 2s infinite;
    }
    @keyframes ss-pulse {
      0% { box-shadow: 0 0 0 0 rgba(110,143,122,0.45); }
      70% { box-shadow: 0 0 0 5px rgba(110,143,122,0); }
      100% { box-shadow: 0 0 0 0 rgba(110,143,122,0); }
    }
    .ss-close {
      background: none; border: none; color: ${NAVY};
      opacity: 0.55; cursor: pointer; font-size: 20px; line-height: 1;
      padding: 4px; position: relative; z-index: 1;
    }
    .ss-close:hover { opacity: 1; }

    .ss-messages {
      flex: 1; overflow-y: auto; padding: 18px;
      background: ${PARCHMENT};
      display: flex; flex-direction: column; gap: 14px;
      position: relative;
    }
    .ss-messages::before {
      content: ''; position: absolute; top: 10px; right: -30px;
      width: 220px; height: 220px;
      background: radial-gradient(circle, rgba(227,167,63,0.07) 0%, rgba(227,167,63,0) 70%);
      pointer-events: none;
    }
    .ss-msg-row { display: flex; gap: 8px; align-items: flex-end; }
    .ss-msg-row.ss-user-row { justify-content: flex-end; }
    .ss-avatar {
      width: 26px; height: 26px; border-radius: 50%; background: ${NAVY};
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .ss-avatar svg { width: 13px; height: 13px; color: ${GOLD}; }
    .ss-msg {
      max-width: 78%; padding: 10px 14px; font-size: 13.5px; line-height: 1.55;
      white-space: pre-wrap; animation: ss-rise 0.25s ease-out;
    }
    @keyframes ss-rise {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .ss-msg.bot {
      background: #ffffff; color: ${INK};
      border-radius: 4px 16px 16px 16px;
      box-shadow: 0 1px 3px rgba(30,51,80,0.08);
    }
    .ss-msg.user {
      background: linear-gradient(135deg, ${NAVY} 0%, ${NAVY2} 100%);
      color: ${PARCHMENT};
      border-radius: 16px 16px 4px 16px;
    }

    .ss-typing-row { display: flex; gap: 8px; align-items: flex-end; }
    .ss-typing {
      background: #ffffff; border-radius: 4px 16px 16px 16px;
      box-shadow: 0 1px 3px rgba(30,51,80,0.08);
      display: flex; gap: 4px; padding: 12px 14px;
    }
    .ss-typing span {
      width: 6px; height: 6px; border-radius: 50%; background: #C7BCA0;
      animation: ss-bounce 1.2s infinite ease-in-out;
    }
    .ss-typing span:nth-child(2) { animation-delay: 0.15s; }
    .ss-typing span:nth-child(3) { animation-delay: 0.3s; }
    @keyframes ss-bounce {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
      30% { transform: translateY(-4px); opacity: 1; }
    }

    .ss-cta-bar { padding: 2px 16px 12px; background: ${PARCHMENT}; }
    .ss-cta-button {
      display: flex; align-items: center; justify-content: center; gap: 8px;
      width: 100%;
      background: linear-gradient(135deg, ${GOLD} 0%, ${GOLD2} 100%);
      color: ${NAVY}; font-family: 'Inter', sans-serif; font-weight: 700; font-size: 13px;
      padding: 11px 14px; border-radius: 12px; text-decoration: none;
      box-shadow: 0 4px 14px rgba(227,167,63,0.4);
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    .ss-cta-button:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(227,167,63,0.5); }
    .ss-cta-button svg { width: 15px; height: 15px; }

    .ss-inputbar {
      display: flex; gap: 10px; align-items: center;
      padding: 14px 16px 10px;
      background: #ffffff;
      border-top: 1px solid rgba(30,51,80,0.08);
    }
    .ss-inputbar input {
      flex: 1; border: 1.5px solid rgba(30,51,80,0.14); border-radius: 999px;
      padding: 10px 16px; font-family: 'Inter', sans-serif; font-size: 13.5px;
      outline: none; background: ${PARCHMENT}; color: ${INK};
      transition: border-color 0.15s ease, background 0.15s ease;
    }
    .ss-inputbar input::placeholder { color: ${MUTED}; }
    .ss-inputbar input:focus { border-color: ${GOLD}; background: #ffffff; }
    .ss-inputbar button {
      background: linear-gradient(135deg, ${GOLD} 0%, ${GOLD2} 100%);
      border: none; border-radius: 50%; width: 40px; height: 40px;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; box-shadow: 0 4px 12px rgba(227,167,63,0.4);
      transition: transform 0.15s ease;
    }
    .ss-inputbar button:hover:not(:disabled) { transform: scale(1.06); }
    .ss-inputbar button:disabled { opacity: 0.5; cursor: default; }
    .ss-inputbar button svg { width: 16px; height: 16px; color: ${NAVY}; }

    .ss-footnote {
      text-align: center; font-family: 'Fraunces', serif; font-style: italic;
      font-size: 11px; color: ${MUTED}; padding: 0 12px 14px; background: #ffffff;
    }

    @media (prefers-reduced-motion: reduce) {
      * { animation: none !important; transition: none !important; }
    }
  `;
  document.head.appendChild(style);

  const WING_ICON = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 14c4-2 8-2 10 2 2-6 6-9 10-8" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>';
  const AVATAR_ICON = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 14c4-2 8-2 10 2 2-6 6-9 10-8" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" fill="none"/></svg>';

  const launcher = document.createElement('button');
  launcher.className = 'ss-launcher';
  launcher.setAttribute('aria-label', 'Open chat with Skill Stork assistant');
  launcher.innerHTML = `<img src="${LOGO_URL}" alt="Skill Stork" />`;

  const panel = document.createElement('div');
  panel.className = 'ss-panel';
  panel.innerHTML = `
    <div class="ss-header">
      <svg class="ss-watermark" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 55c20-12 40-12 50 8 10-28 30-42 48-38" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"/>
      </svg>
      <img class="ss-logo" src="${LOGO_URL}" alt="Skill Stork International School" />
      <div class="ss-header-text">
        <div class="ss-eyebrow">${WING_ICON} OFFICIAL SCHOOL ASSISTANT</div>
        <p class="ss-status"><span class="ss-live-dot"></span>Usually replies instantly</p>
      </div>
      <button class="ss-close" aria-label="Close chat">&times;</button>
    </div>
    <div class="ss-messages" id="ss-messages"></div>
    <div class="ss-cta-bar">
      <a class="ss-cta-button" href="https://skillstork.org/school-admission-enquiry/" target="_blank" rel="noopener">
        ${WING_ICON} Start Admission Enquiry
      </a>
    </div>
    <div class="ss-inputbar">
      <input id="ss-input" type="text" placeholder="Type your question here…" />
      <button id="ss-send" aria-label="Send message">${WING_ICON}</button>
    </div>
    <div class="ss-footnote">Skill Stork International School · AI-powered</div>
  `;

  document.body.appendChild(launcher);
  document.body.appendChild(panel);

  const messagesEl = panel.querySelector('#ss-messages');
  const inputEl = panel.querySelector('#ss-input');
  const sendBtn = panel.querySelector('#ss-send');
  const closeBtn = panel.querySelector('.ss-close');

  let history = [];
  let opened = false;

  function addMessage(role, text) {
    const row = document.createElement('div');
    row.className = 'ss-msg-row' + (role === 'user' ? ' ss-user-row' : '');

    if (role !== 'user') {
      const avatar = document.createElement('div');
      avatar.className = 'ss-avatar';
      avatar.innerHTML = AVATAR_ICON;
      row.appendChild(avatar);
    }

    const div = document.createElement('div');
    div.className = 'ss-msg ' + (role === 'user' ? 'user' : 'bot');
    div.textContent = text;
    row.appendChild(div);

    messagesEl.appendChild(row);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function showTyping() {
    const row = document.createElement('div');
    row.className = 'ss-typing-row';
    row.id = 'ss-typing-indicator';
    const avatar = document.createElement('div');
    avatar.className = 'ss-avatar';
    avatar.innerHTML = AVATAR_ICON;
    const bubble = document.createElement('div');
    bubble.className = 'ss-typing';
    bubble.innerHTML = '<span></span><span></span><span></span>';
    row.appendChild(avatar);
    row.appendChild(bubble);
    messagesEl.appendChild(row);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function hideTyping() {
    const el = document.getElementById('ss-typing-indicator');
    if (el) el.remove();
  }

  async function sendMessage() {
    const text = inputEl.value.trim();
    if (!text) return;
    inputEl.value = '';
    sendBtn.disabled = true;

    addMessage('user', text);
    history.push({ role: 'user', content: text });
    showTyping();

    try {
      const res = await fetch(API_BASE + '/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });
      const data = await res.json();
      hideTyping();

      if (!res.ok) throw new Error(data.error || 'Request failed');

      addMessage('bot', data.reply);
      history.push({ role: 'assistant', content: data.reply });
    } catch (err) {
      hideTyping();
      // Remove the question we just added — it never got a reply, and leaving
      // it in would break the required user/assistant alternation on the next try.
      if (history.length && history[history.length - 1].role === 'user') {
        history.pop();
      }
      addMessage('bot', "I'm sorry, something went wrong on my end. Please try again in a moment, or feel free to call our office at +91 80088 80011 — we're always happy to help.");
      console.error(err);
    } finally {
      sendBtn.disabled = false;
      inputEl.focus();
    }
  }

  launcher.addEventListener('click', () => {
    opened = !opened;
    panel.classList.toggle('open', opened);
    if (opened && messagesEl.children.length === 0) {
      addMessage('bot', "Welcome! I'm happy to help with anything about Skill Stork International School — admissions, curriculum, activities, or campus life. What would you like to know?");
    }
    if (opened) inputEl.focus();
  });

  closeBtn.addEventListener('click', () => {
    opened = false;
    panel.classList.remove('open');
  });

  sendBtn.addEventListener('click', sendMessage);
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
})();
