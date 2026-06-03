// ── SMS conversation animation ──
const conversation = [
    {type: 'recv', text: 'Hey! Can you send the OTP code?', delay: 800},
    {type: 'sent', text: 'Your code is 847291 🔐', delay: 2400},
    {type: 'recv', text: 'Thanks! Got it ✓', delay: 4200},
    {type: 'sent', text: 'Campaign sent to 4,200 contacts 🚀', delay: 5800},
    {type: 'recv', text: 'Delivery rate: 99.7% 🎯', delay: 7400},
];
const messagesArea = document.getElementById('messagesArea');
const typingIndicator = document.getElementById('typingIndicator');
const composeInput = document.getElementById('composeText');
const sendBtn = document.getElementById('sendBtn');

function formatTime() {
    const now = new Date();
    return now.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'});
}

function createMsg(item) {
    const div = document.createElement('div');
    div.className = `msg msg-${item.type}`;
    div.innerHTML = `${item.text}<span class="msg-time">${formatTime()}</span>`;
    return div;
}

let composeMessages = [
    'Your code is 847291 🔐',
    'Campaign sent to 4,200 contacts 🚀',
    'Hey! Your order has shipped 📦',
    'Reminder: Appointment at 3pm ⏰',
];
let composeIdx = 0;

function typeIntoCompose(text, callback) {
    let i = 0;
    composeInput.textContent = '';
    const interval = setInterval(() => {
        composeInput.textContent += text[i++];
        if (i >= text.length) {
            clearInterval(interval);
            setTimeout(callback, 400);
        }
    }, 40);
}

function animateSend(callback) {
    sendBtn.style.animation = 'sendPulse 0.4s ease';
    sendBtn.addEventListener('animationend', () => {
        sendBtn.style.animation = '';
    }, {once: true});

    // ripple
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    sendBtn.style.position = 'relative';
    sendBtn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);

    setTimeout(callback, 300);
}

function showFloatingParticle() {
    const particles = document.getElementById('particles');
    const texts = ['Delivered ✓', '4,200 sent', 'Message queued', 'SMS dispatched', '+1 (555) 0192'];
    const rotations = ['-6deg', '4deg', '-3deg', '7deg', '-5deg'];

    const p = document.createElement('div');
    p.className = 'msg-particle particle';
    p.style.cssText = `
            --rot: ${rotations[Math.floor(Math.random() * rotations.length)]};
            top: ${30 + Math.random() * 40}%;
            ${Math.random() > 0.5 ? 'left: -140px;' : 'right: -140px;'}
            animation: floatCard ${3 + Math.random() * 2}s ease-in-out forwards;
          `;
    p.textContent = texts[Math.floor(Math.random() * texts.length)];
    particles.appendChild(p);
    setTimeout(() => p.remove(), 5500);
}

async function runConversation() {
    for (const item of conversation) {
        await new Promise(resolve => setTimeout(resolve, item.delay));
        if (item.type === 'sent') {
            const msgText = composeMessages[composeIdx++ % composeMessages.length];
            await new Promise(resolve => typeIntoCompose(item.text.length > 5 ? item.text : msgText, resolve));
            await new Promise(resolve => animateSend(resolve));
            composeInput.textContent = 'Type a message…';
        } else {
            typingIndicator.classList.add('show');
            await new Promise(resolve => setTimeout(resolve, 900));
            typingIndicator.classList.remove('show');
        }

        const msgEl = createMsg(item);
        messagesArea.insertBefore(msgEl, typingIndicator);
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                msgEl.classList.add('visible');
            });
        });

        if (item.type === 'sent')
            showFloatingParticle();
    }

    // Loop
    setTimeout(() => {
        // clear and restart
        const msgs = messagesArea.querySelectorAll('.msg');
        msgs.forEach((m, i) => {
            setTimeout(() => m.style.opacity = '0', i * 150);
        });
        setTimeout(() => {
            msgs.forEach(m => m.remove());
            runConversation();
        }, msgs.length * 150 + 600);
    }, 3000);
}

// start after page load
setTimeout(runConversation, 1200);

// Periodic floating particles
setInterval(showFloatingParticle, 3500);

// ── Scroll-triggered feature cards ──
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting)
            e.target.classList.add('in-view');
    });
}, {threshold: 0.2});

document.querySelectorAll('.feature-card').forEach(el => observer.observe(el));