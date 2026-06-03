// ── ROLE SELECTION ──
let currentRole = 'customer';

function selectRole(role) {

    currentRole = role;

    document
            .getElementById('roleCustomer')
            .classList.toggle('active', role === 'customer');

    document
            .getElementById('roleAdmin')
            .classList.toggle('active', role === 'admin');

    // 1 = admin
    // 2 = customer
    document.getElementById("userType").value =
            role === "admin" ? "1" : "2";

    clearAll();
}

// ── PASSWORD TOGGLE ──
let pwVisible = false;

function togglePassword() {

    pwVisible = !pwVisible;

    const input = document.getElementById('password');

    const icon = document.getElementById('eyeIcon');

    input.type = pwVisible ? 'text' : 'password';

    icon.innerHTML = pwVisible
            ? `<path d="M2 2l12 12M6.5 6.7a2 2 0 002.8 2.8M1 8s2.5-5 7-5c1.2 0 2.3.3 3.3.8M15 8s-.9 1.8-2.7 3.2M11.5 11.5C10.5 12.2 9.3 13 8 13c-4.5 0-7-5-7-5"/>`
            : `<path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z"/><circle cx="8" cy="8" r="2"/>`;
}

// ── FIELD VALIDATION ──
function showFieldError(fieldId) {

    const input =
            document.getElementById(fieldId);

    input.classList.add('error');

    // remove old error if exists
    const oldError =
            input.parentElement.querySelector('.validation-error');

    if (oldError) {

        oldError.remove();
    }

    // create error
    const error =
            document.createElement('div');

    error.className = 'validation-error';



    input.parentElement.appendChild(error);

    // show animation
    setTimeout(() => {

        error.classList.add('show');

    }, 10);

    // shake animation
    input.classList.add('shake');

    input.addEventListener('animationend', () => {

        input.classList.remove('shake');

    }, {once: true});
}

function clearFieldError(fieldId) {

    const input =
            document.getElementById(fieldId);

    input.classList.remove('error');

    const error =
            input.parentElement.querySelector('.validation-error');

    if (error) {

        error.remove();
    }
}

function clearAll() {

    ['username', 'password'].forEach(id => {

        clearFieldError(id);

        document.getElementById(id).value = '';
    });
}

function handleLogin(event) {

    const username = document.getElementById("username");
    const password = document.getElementById("password");
    const btn = document.getElementById("loginBtn");

    let valid = true;

    clearFieldError("username");
    clearFieldError("password");

    if (!username.value.trim()) {
        showFieldError("username");
        valid = false;
    }

    if (!password.value.trim()) {
        showFieldError("password");
        valid = false;
    }

    if (!valid) {
        event.preventDefault();
        return false;
    }

    btn.disabled = true;
    btn.classList.add("loading");

    const label = btn.querySelector(".btn-label");

    if (label) {
        label.textContent = "Signing In...";
    }

    setTimeout(() => {
        document
            .getElementById("loginLoading")
            .classList
            .add("show");
    }, 100);

    return true;
}

// ── RESET ──
function handleReset() {

    const inputs =
            document.querySelectorAll('.field-input');

    inputs.forEach(i => {

        i.value = '';

        i.style.transform = 'scale(0.98)';

        setTimeout(() => {

            i.style.transform = '';

            i.style.transition =
                    'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)';

        }, 10);
    });

    clearAll();

    const btn =
            document.getElementById('loginBtn');

    btn.classList.remove('success', 'loading');
}

// ── ENTER KEY ──
document.addEventListener('keydown', e => {

    if (e.key === 'Enter') {

        const form =
                document.getElementById('formCard');

        form.requestSubmit();
    }
});

// ── REMOVE ERROR WHEN TYPING ──
document.addEventListener('DOMContentLoaded', () => {

    const inputs =
            document.querySelectorAll('.field-input');

    inputs.forEach(input => {

        input.addEventListener('input', () => {

            clearFieldError(input.id);
        });
    });
});

// ── FLOATING SMS PARTICLES ──
const smsTexts = [
    'Msg delivered ✓',
    'OTP: 847291',
    'Bulk send active',
    '4,200 sent 🚀',
    'Auth successful',
    '+1 (555) 0192',
    'Login attempt…',
    'Secure session',
    'Rate: 99.7%',
    'Campaign live ⚡',
    'SMS queued',
    '180+ countries'
];

function spawnParticle() {

    const field =
            document.getElementById('particleField');

    const p =
            document.createElement('div');

    p.className = 'sms-particle';

    p.textContent =
            smsTexts[Math.floor(Math.random() * smsTexts.length)];

    const fromLeft =
            Math.random() > 0.5;

    const startY =
            10 + Math.random() * 80;

    p.style.cssText = `
        top:${startY}%;

        ${fromLeft ? 'left:-160px;' : 'right:-160px;'}

        opacity:0;
    `;

    field.appendChild(p);

    const duration =
            6000 + Math.random() * 4000;

    const endX =
            fromLeft
            ? (50 + Math.random() * 40) + 'vw'
            : (-50 - Math.random() * 40) + 'vw';

    p.animate([
        {
            opacity: 0,
            transform: 'translateX(0) translateY(0)'
        },
        {
            opacity: 1,
            transform: `translateX(${fromLeft ? '30px' : '-30px'}) translateY(-5px)`,
            offset: 0.08
        },
        {
            opacity: 0.7,
            transform: `translateX(${endX}) translateY(${-20 + Math.random() * 40}px)`,
            offset: 0.85
        },
        {
            opacity: 0,
            transform: `translateX(${endX}) translateY(${-30 + Math.random() * 60}px)`
        }

    ], {
        duration,
        easing: 'ease-in-out',
        fill: 'forwards'
    });

    setTimeout(() => p.remove(), duration + 100);
}

// spawn particles
spawnParticle();

setInterval(spawnParticle, 2200);