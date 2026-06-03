// ── OTP INPUT LOGIC ──
const inputs = Array.from({length: 6}, (_, i) => document.getElementById('otp' + i));
const verifyBtn = document.getElementById('verifyBtn');

inputs.forEach((input, idx) => {
    input.addEventListener('keydown', e => {
        if (e.key === 'Backspace') {
            if (input.value) {
                input.value = '';
                input.classList.remove('filled');
            } else if (idx > 0) {
                inputs[idx - 1].focus();
                inputs[idx - 1].value = '';
                inputs[idx - 1].classList.remove('filled');
            }
            e.preventDefault();
            return;
        }
        if (e.key === 'ArrowLeft'  && idx > 0) { inputs[idx - 1].focus(); return; }
        if (e.key === 'ArrowRight' && idx < 5) { inputs[idx + 1].focus(); return; }
        if (e.key === 'Enter') { submitCode(); return; }
    });

    input.addEventListener('input', e => {
        const val = e.target.value.replace(/\D/g, '');
        input.value = val ? val[0] : '';
        clearMessages();
        resetOtpStyle();
        if (val) {
            input.classList.add('filled');
            if (idx < 5) inputs[idx + 1].focus();
        } else {
            input.classList.remove('filled');
        }
        // Auto-submit when all 6 digits are filled
        if (getCode().length === 6) setTimeout(submitCode, 300);
    });

    input.addEventListener('paste', e => {
        e.preventDefault();
        const paste = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '');
        paste.split('').slice(0, 6).forEach((ch, i) => {
            if (inputs[i]) { inputs[i].value = ch; inputs[i].classList.add('filled'); }
        });
        inputs[Math.min(paste.length - 1, 5)].focus();
        if (paste.length >= 6) setTimeout(submitCode, 300);
    });
});

inputs[0].focus();

function getCode() {
    return inputs.map(i => i.value).join('');
}

function resetOtpStyle() {
    inputs.forEach(i => i.classList.remove('error-state', 'valid-state'));
}

// ── MESSAGES ──
function showError(msg) {
    document.getElementById('msgSuccess').classList.remove('show');
    document.getElementById('msgErrorText').textContent = msg;
    document.getElementById('msgError').classList.add('show');
}
function showSuccess() {
    document.getElementById('msgError').classList.remove('show');
    document.getElementById('msgSuccess').classList.add('show');
}
function clearMessages() {
    document.getElementById('msgError').classList.remove('show');
    document.getElementById('msgSuccess').classList.remove('show');
}

// ── VERIFY BUTTON → calls submitCode() ──
function handleVerify() {
    submitCode();
}

// ── SUBMIT CODE TO SERVLET ──
function submitCode() {
    const code = getCode();

    if (code.length < 6) {
        showError('Please enter all 6 digits of your verification code.');
        inputs.forEach(i => { if (!i.value) i.classList.add('error-state'); });
        return;
    }

    // Create a hidden form and submit it directly to the servlet
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '../UserAccountVerifyServlet';

    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'verificationCode';
    input.value = code;

    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
}

// ── CONFETTI ──
function spawnConfetti() {
    const wrap = document.getElementById('confettiWrap');
    const colors = ['#E8173C', '#ff6b6b', '#fbbf24', '#4ade80', '#60a5fa', '#f472b6', '#a78bfa'];
    for (let i = 0; i < 28; i++) {
        const dot = document.createElement('div');
        dot.className = 'confetti-dot';
        const angle = (i / 28) * 2 * Math.PI;
        const dist = 60 + Math.random() * 90;
        dot.style.cssText = `left:50%;top:50%;background:${colors[i % colors.length]};--tx:${Math.cos(angle) * dist}px;--ty:${Math.sin(angle) * dist}px;animation-delay:${Math.random() * 0.3}s;animation-duration:${0.8 + Math.random() * 0.7}s;width:${4 + Math.random() * 5}px;height:${4 + Math.random() * 5}px;`;
        wrap.appendChild(dot);
        setTimeout(() => dot.remove(), 2000);
    }
}

// ── FLOATING PARTICLES ──
const smsTexts = ['Verifying… ✓', 'Code sent 📲', 'OTP: ••••••', 'Auth secure 🔐', 'SMS active', 'Twilio ✓', '6-digit code', 'Account verify', 'Activating…', 'Servlet ready'];
function spawnParticle() {
    const field = document.getElementById('particleField');
    const p = document.createElement('div');
    p.className = 'sms-particle';
    p.textContent = smsTexts[Math.floor(Math.random() * smsTexts.length)];
    const fromLeft = Math.random() > 0.5;
    p.style.cssText = `top:${10 + Math.random() * 80}%;${fromLeft ? 'left:-160px;' : 'right:-160px;'}opacity:0;`;
    field.appendChild(p);
    const dur = 7000 + Math.random() * 4000;
    const endX = fromLeft ? (40 + Math.random() * 30) + 'vw' : (-40 - Math.random() * 30) + 'vw';
    p.animate([
        {opacity: 0, transform: 'translateX(0)'},
        {opacity: 0.7, transform: `translateX(${fromLeft ? '30px' : '-30px'})`, offset: 0.08},
        {opacity: 0.4, transform: `translateX(${endX}) translateY(${-15 + Math.random() * 30}px)`, offset: 0.85},
        {opacity: 0, transform: `translateX(${endX}) translateY(${-25 + Math.random() * 50}px)`}
    ], {duration: dur, easing: 'ease-in-out', fill: 'forwards'});
    setTimeout(() => p.remove(), dur + 100);
}
spawnParticle();
setInterval(spawnParticle, 3000);