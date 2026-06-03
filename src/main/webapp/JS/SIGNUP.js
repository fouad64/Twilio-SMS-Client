// ── TAKEN USERNAMES (simulate existing users) ──
const TAKEN_USERNAMES = ['admin', 'john_doe', 'customer', 'test', 'user123'];

// ── PASSWORD VISIBILITY ──
const pwState = {};
function togglePw(inputId, iconId) {
    pwState[inputId] = !pwState[inputId];
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    input.type = pwState[inputId] ? 'text' : 'password';
    if (pwState[inputId]) {
        icon.innerHTML = `<path d="M2 2l11 11M6.3 6.5a2 2 0 002.9 2.7M1 7.5s2.5-5 6.5-5c1.2 0 2.3.3 3.2.8M14 7.5s-.8 1.8-2.5 3.2M11 11.2C9.9 12 8.7 12.5 7.5 12.5c-4 0-6.5-5-6.5-5"/>`;
    } else {
        icon.innerHTML = `<path d="M1 7.5s2.5-5 6.5-5 6.5 5 6.5 5-2.5 5-6.5 5-6.5-5-6.5-5z"/><circle cx="7.5" cy="7.5" r="2"/>`;
    }
}

// ── PASSWORD STRENGTH ──
function getStrength(pw) {
    if (!pw)
        return 0;
    let score = 0;
    if (pw.length >= 8)
        score++;
    if (pw.length >= 12)
        score++;
    if (/[A-Z]/.test(pw))
        score++;
    if (/[0-9]/.test(pw))
        score++;
    if (/[^A-Za-z0-9]/.test(pw))
        score++;
    return score;
}

function onPasswordInput() {
    const pw = document.getElementById('password').value;
    const strengthEl = document.getElementById('pwStrength');
    const fill = document.getElementById('strengthFill');
    const label = document.getElementById('strengthLabel');

    if (pw.length > 0) {
        strengthEl.classList.add('show');
        const score = getStrength(pw);
        const pct = (score / 5) * 100;
        const colors = ['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a'];
        const labels = ['', 'Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
        fill.style.width = pct + '%';
        fill.style.background = colors[score] || colors[1];
        label.textContent = 'Strength: ' + (labels[score] || 'Very Weak');
        label.style.color = colors[score] || '#ef4444';
    } else {
        strengthEl.classList.remove('show');
    }

    clearFieldError('password');
    if (document.getElementById('confirmPassword').value)
        liveValidate('confirmPassword');
}

// ── VALIDATION RULES ──
const rules = {
    fullName: v => {
        if (!v.trim())
            return 'Full name is required';
        if (v.trim().length < 2)
            return 'Name must be at least 2 characters';
        return null;
    },
    dob: v => {
        if (!v)
            return 'Date of birth is required';
        const d = new Date(v);
        const age = (Date.now() - d) / (365.25 * 24 * 60 * 60 * 1000);
        if (age < 13)
            return 'You must be at least 13 years old';
        if (age > 120)
            return 'Please enter a valid date';
        return null;
    },
    jobTitle: v => !v.trim() ? 'Job title is required' : null,
    email: v => {
        if (!v.trim())
            return 'Email address is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()))
            return 'Enter a valid email address';
        return null;
    },
    phone: v => {
        if (!v.trim())
            return 'Phone number is required';

        if (!/^\+\d{1,3}( \d+)+$/.test(v.trim()))
            return 'Format must be like: +20 1126165494';

        return null;
    },
    address: v => !v.trim() ? 'Home address is required' : null,
    username: v => {
        if (!v.trim())
            return 'Username is required';
        if (v.length < 3)
            return 'Username must be at least 3 characters';
        if (!/^[a-zA-Z0-9_]+$/.test(v))
            return 'Username can only contain letters, numbers, underscores';
        if (TAKEN_USERNAMES.includes(v.toLowerCase()))
            return 'This username is already taken';
        return null;
    },
    password: v => {
        if (!v)
            return 'Password is required';
        if (v.length < 8)
            return 'Password must be at least 8 characters';
        return null;
    },
    confirmPassword: v => {
        if (!v)
            return 'Please confirm your password';
        if (v !== document.getElementById('password').value)
            return 'Passwords do not match';
        return null;
    },
    twilioSid: v => {
        if (!v.trim())
            return 'Account SID is required';
        if (!v.trim().startsWith('AC') && v.trim().length > 0)
            return 'Account SID must start with "AC"';
        if (v.trim().length < 10)
            return 'Enter a valid Account SID';
        return null;
    },
    twilioToken: v => !v.trim() ? 'Auth token is required' : null,
    twilioSender: v => {
        if (!v.trim())
            return 'Sender ID is required';

        if (!/^\+\d+$/.test(v.trim()))
            return 'Format must be like: +16624957872';

        return null;
    }
};

const ALL_FIELDS = Object.keys(rules);

function setFieldState(id, state, msg) {
    const input = document.getElementById(id);
    const errorEl = document.getElementById(id + 'Error');
    const errorMsg = document.getElementById(id + 'Msg');
    const tick = document.getElementById(id + 'Tick');

    input.classList.remove('error', 'valid');

    if (state === 'error') {
        input.classList.add('error');
        if (errorMsg)
            errorMsg.textContent = msg;
        if (errorEl)
            errorEl.classList.add('show');
        if (tick)
            tick.classList.remove('show');
        input.classList.add('shake');
        input.addEventListener('animationend', () => input.classList.remove('shake'), {once: true});
    } else if (state === 'valid') {
        input.classList.add('valid');
        if (errorEl)
            errorEl.classList.remove('show');
        if (tick)
            tick.classList.add('show');
    } else {
        if (errorEl)
            errorEl.classList.remove('show');
        if (tick)
            tick && tick.classList.remove('show');
    }
}

function clearFieldError(id) {
    const input = document.getElementById(id);
    const errorEl = document.getElementById(id + 'Error');
    const tick = document.getElementById(id + 'Tick');
    input && input.classList.remove('error');
    errorEl && errorEl.classList.remove('show');
    tick && tick.classList.remove('show');
}

function liveValidate(id) {
    const input = document.getElementById(id);
    if (!input)
        return;
    const val = input.value;
    const rule = rules[id];
    if (!rule)
        return;
    const err = rule(val);
    if (err) {
        // Only show inline error after user has interacted
        if (val.length > 0) {
            setFieldState(id, 'error', err);
        } else {
            clearFieldError(id);
        }
    } else {
        setFieldState(id, 'valid', null);
    }
    hideBanner();
}

function hideBanner() {
    document.getElementById('errorBanner').classList.remove('show');
}

function handleRegister() {

    const errors = [];
    let firstError = null;

    ALL_FIELDS.forEach(id => {

        const input = document.getElementById(id);

        if (!input)
            return;

        const err = rules[id](input.value);

        if (err) {

            errors.push(err);

            setFieldState(id, 'error', err);

            if (!firstError)
                firstError = input;

        } else {

            setFieldState(id, 'valid', null);
        }
    });

    if (errors.length > 0) {

        const banner = document.getElementById('errorBanner');
        const list = document.getElementById('errorList');

        list.innerHTML = errors
                .slice(0, 5)
                .map(e => `<li>${e}</li>`)
                .join('');

        if (errors.length > 5)
            list.innerHTML += `<li>...and ${errors.length - 5} more</li>`;

        banner.classList.add('show');

        if (firstError) {

            firstError.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }

        return false;
    }

    // Disable Register Button
    const btn = document.getElementById('registerBtn');

    btn.disabled = true;

    btn.classList.add('loading');

    // Show Loading Overlay
    document
            .getElementById('signupLoading')
            .classList
            .add('show');

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Create Form
    const form = document.createElement('form');

    form.method = 'POST';

    form.action = '../UserRegisterServlet';

    // Add All Fields
    ALL_FIELDS.forEach(id => {

        const input = document.getElementById(id);

        if (!input)
            return;

        const hidden = document.createElement('input');

        hidden.type = 'hidden';

        hidden.name = id;

        hidden.value = input.value;

        form.appendChild(hidden);
    });

    // Add OTP
    const otpField = document.createElement('input');

    otpField.type = 'hidden';

    otpField.name = 'otp';

    otpField.value = otp;

    form.appendChild(otpField);

    document.body.appendChild(form);

    // Give user time to see loading animation
    setTimeout(() => {

        form.submit();

    }, 300);

    return false;
}

// ── RESET ──
function handleReset() {
    ALL_FIELDS.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.value = '';
            input.type = id.includes('assword') || id === 'twilioToken' ? 'password' : input.type;
        }
        clearFieldError(id);
    });
    hideBanner();
    document.getElementById('pwStrength').classList.remove('show');
    document.getElementById('strengthFill').style.width = '0%';

    // Reset register btn
    const btn = document.getElementById('registerBtn');
    btn.classList.remove('loading');
    btn.style.background = '';
    btn.innerHTML = `<span class="btn-label"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="6" r="3"/><path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M12 3h3M13.5 1.5v3"/></svg>Create Account</span><div class="spinner"></div>`;
}

// ── ENTER KEY ──
document.addEventListener('keydown', e => {
    if (e.key === 'Enter')
        handleRegister();
});

// ── FLOATING PARTICLES ──
const smsTexts = ['Account created ✓', 'Verifying identity…', 'SMS active 🚀', 'Twilio connected', '+1 (555) 0192', 'Secure session', 'Register →', '180+ countries', 'OTP sending…', 'Campaign ready ⚡'];
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
        {opacity: 0.8, transform: `translateX(${fromLeft ? '30px' : '-30px'})`, offset: 0.08},
        {opacity: 0.5, transform: `translateX(${endX}) translateY(${-15 + Math.random() * 30}px)`, offset: 0.85},
        {opacity: 0, transform: `translateX(${endX}) translateY(${-25 + Math.random() * 50}px)`}
    ], {duration: dur, easing: 'ease-in-out', fill: 'forwards'});
    setTimeout(() => p.remove(), dur + 100);
}
spawnParticle();
setInterval(spawnParticle, 2500);