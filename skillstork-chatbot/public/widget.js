(function () {
  // ---- Configuration ---------------------------------------------------
  // If you host the backend on a different domain than the website itself,
  // change API_BASE to that full URL, e.g. "https://your-backend.onrender.com"
  const API_BASE = window.SKILLSTORK_CHAT_API || '';
  // -----------------------------------------------------------------------

  const NAVY = '#1F3B57';
  const GOLD = '#D9A441';
  const CREAM = '#FBF7EF';
  const INK = '#20303F';

  const style = document.createElement('style');
  style.textContent = `
    .ss-launcher {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: ${NAVY};
      box-shadow: 0 6px 20px rgba(31,59,87,0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 999999;
      transition: transform 0.15s ease;
      border: none;
    }
    .ss-launcher:hover { transform: scale(1.06); }
    .ss-launcher svg { width: 28px; height: 28px; }

    .ss-panel {
      position: fixed;
      bottom: 96px;
      right: 24px;
      width: 360px;
      max-width: calc(100vw - 32px);
      height: 520px;
      max-height: calc(100vh - 140px);
      background: ${CREAM};
      border-radius: 16px;
      box-shadow: 0 12px 40px rgba(20,30,40,0.25);
      display: none;
      flex-direction: column;
      overflow: hidden;
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .ss-panel.open { display: flex; }

    .ss-header {
      background: ${NAVY};
      color: ${CREAM};
      padding: 16px 18px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .ss-header .ss-dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: ${GOLD};
    }
    .ss-header h3 { margin: 0; font-size: 15px; font-weight: 600; }
    .ss-header p { margin: 0; font-size: 11.5px; opacity: 0.75; }
    .ss-header-text { flex: 1; }
    .ss-close {
      background: none; border: none; color: ${CREAM};
      opacity: 0.8; cursor: pointer; font-size: 18px; line-height: 1;
      padding: 4px;
    }
    .ss-close:hover { opacity: 1; }

    .ss-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .ss-msg {
      max-width: 82%;
      padding: 9px 13px;
      border-radius: 14px;
      font-size: 13.5px;
      line-height: 1.45;
      white-space: pre-wrap;
    }
    .ss-msg.bot {
      background: #ffffff;
      color: ${INK};
      align-self: flex-start;
      border-bottom-left-radius: 4px;
      border: 1px solid #E9E1D2;
    }
    .ss-msg.user {
      background: ${NAVY};
      color: ${CREAM};
      align-self: flex-end;
      border-bottom-right-radius: 4px;
    }
    .ss-typing {
      align-self: flex-start;
      display: flex;
      gap: 4px;
      padding: 10px 13px;
    }
    .ss-typing span {
      width: 6px; height: 6px; border-radius: 50%;
      background: #B9AF9C;
      animation: ss-bounce 1.2s infinite ease-in-out;
    }
    .ss-typing span:nth-child(2) { animation-delay: 0.15s; }
    .ss-typing span:nth-child(3) { animation-delay: 0.3s; }
    @keyframes ss-bounce {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
      30% { transform: translateY(-4px); opacity: 1; }
    }

    .ss-inputbar {
      display: flex;
      gap: 8px;
      padding: 12px;
      border-top: 1px solid #E9E1D2;
      background: ${CREAM};
    }
    .ss-inputbar input {
      flex: 1;
      border: 1px solid #D9CFB8;
      border-radius: 20px;
      padding: 9px 14px;
      font-size: 13.5px;
      outline: none;
      background: #fff;
    }
    .ss-inputbar input:focus { border-color: ${GOLD}; }
    .ss-inputbar button {
      background: ${GOLD};
      border: none;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .ss-inputbar button svg { width: 16px; height: 16px; }
    .ss-inputbar button:disabled { opacity: 0.5; cursor: default; }
  `;
  document.head.appendChild(style);

  const launcher = document.createElement('button');
  launcher.className = 'ss-launcher';
  launcher.setAttribute('aria-label', 'Open chat with Skill Stork assistant');
  launcher.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H8l-4 4V6a1 1 0 0 1 1-1z"
        fill="${CREAM}" stroke="${CREAM}" stroke-width="0.5"/>
    </svg>
  `;

  const panel = document.createElement('div');
  panel.className = 'ss-panel';
  panel.innerHTML = `
    <div class="ss-header">
      <div class="ss-dot"></div>
      <div class="ss-header-text">
        <h3>Skill Stork Assistant</h3>
        <p>AI assistant · Skill Stork International School</p>
      </div>
      <button class="ss-close" aria-label="Close chat">&times;</button>
    </div>
    <div class="ss-messages" id="ss-messages"></div>
    <div class="ss-inputbar">
      <input id="ss-input" type="text" placeholder="Ask about admissions, curriculum, facilities…" />
      <button id="ss-send" aria-label="Send message">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 11l18-8-8 18-2-8-8-2z" fill="${NAVY}"/>
        </svg>
      </button>
    </div>
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
    const div = document.createElement('div');
    div.className = 'ss-msg ' + (role === 'user' ? 'user' : 'bot');
    div.textContent = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function showTyping() {
    const div = document.createElement('div');
    div.className = 'ss-typing';
    div.id = 'ss-typing-indicator';
    div.innerHTML = '<span></span><span></span><span></span>';
    messagesEl.appendChild(div);
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
      addMessage('bot', "Sorry, something went wrong. Please try again, or contact the school office directly at +91 80088 80011.");
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
      addMessage('bot', "Hi! I'm the Skill Stork International School assistant. Ask me about admissions, curriculum (IB, Cambridge, CBSE), facilities, or anything else about the school.");
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
