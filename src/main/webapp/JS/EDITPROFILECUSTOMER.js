// ── CLOCK ──
function tick() {
    const clockEl = document.getElementById('clock');
    if (clockEl)
        clockEl.textContent = new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'});
}
tick();
setInterval(tick, 1000);

// ── EYE TOGGLE ──
const eyeState = {};
function toggleEye(inputId, iconId) {
    eyeState[inputId] = !eyeState[inputId];
    const inp = document.getElementById(inputId);
    const ico = document.getElementById(iconId);
    if (inp && ico) {
        inp.type = eyeState[inputId] ? 'text' : 'password';
        ico.innerHTML = eyeState[inputId]
                ? `<path d="M2 2l11 11M6.3 6.5a2 2 0 002.9 2.7M1 7.5s2.5-5 6.5-5c1.2 0 2.3.3 3.2.8M14 7.5s-.8 1.8-2.5 3.2M11 11.2c-1 .8-2.2 1.3-3.5 1.3-4 0-6.5-5-6.5-5"/>`
                : `<path d="M1 7.5s2.5-5 6.5-5 6.5 5 6.5 5-2.5 5-6.5 5-6.5-5-6.5-5z"/><circle cx="7.5" cy="7.5" r="2"/>`;
    }
}

// ── PASSWORD STRENGTH ──
function onPasswordInput() {
    const pw = document.getElementById('password').value;
    const el = document.getElementById('pwStrength');
    const fill = document.getElementById('strengthFill');
    const label = document.getElementById('strengthLabel');
    if (!pw) {
        if (el)
            el.classList.remove('show');
        return;
    }
    if (el)
        el.classList.add('show');
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
    const colors = ['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a'];
    const labels = ['', 'Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
    if (fill)
        fill.style.width = (score / 5 * 100) + '%';
    if (fill)
        fill.style.background = colors[score] || '#ef4444';
    if (label) {
        label.textContent = 'Strength: ' + (labels[score] || 'Very Weak');
        label.style.color = colors[score] || '#ef4444';
    }
    clearErr('password');
    if (document.getElementById('confirmPw') && document.getElementById('confirmPw').value)
        liveVal('confirmPw');
}

// ── VALIDATION RULES ──
const rules = {
    fullName: v => !v.trim() ? 'Full name is required' : v.trim().length < 2 ? 'At least 2 characters' : null,
    dob: v => !v ? 'Date of birth is required' : null,
    jobTitle: v => !v.trim() ? 'Job title is required' : null,
    email: v => !v.trim() ? 'Email is required' : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? 'Enter a valid email' : null,
    phone: v => !v.trim() ? 'Phone is required' : !/^\+?[\d\s\-().]{7,}$/.test(v.trim()) ? 'Enter a valid phone number' : null,
    address: v => !v.trim() ? 'Address is required' : null,
    password: v => v && v.length < 8 ? 'Minimum 8 characters' : null,
    confirmPw: v => {
        const pw = document.getElementById('password').value;
        return pw && v !== pw ? 'Passwords do not match' : null;
    },
    twilioSid: v => !v.trim() ? 'Account SID is required' : !v.trim().startsWith('AC') ? 'Must start with AC' : null,
    twilioToken: v => !v.trim() ? 'Auth token is required' : null,
    twilioSender: v => {
        if (!v.trim())
            return 'Sender ID is required';

        if (!/^\+\d+$/.test(v.trim()))
            return 'Format must be like: +16624957872';

        return null;
    }
};

function setErr(id, msg) {
    const inp = document.getElementById(id);
    const err = document.getElementById(id + 'Error');
    const msg_el = document.getElementById(id + 'Msg');
    const tick = document.getElementById(id + 'Tick');
    if (inp)
        inp.classList.add('error');
    if (inp)
        inp.classList.remove('valid');
    if (msg_el)
        msg_el.textContent = msg;
    if (err)
        err.classList.add('show');
    if (tick)
        tick.classList.remove('show');
    if (inp) {
        inp.classList.add('shake');
        inp.addEventListener('animationend', () => inp.classList.remove('shake'), {once: true});
    }
}
function setOk(id) {
    const inp = document.getElementById(id);
    const err = document.getElementById(id + 'Error');
    const tick = document.getElementById(id + 'Tick');
    if (inp)
        inp.classList.remove('error');
    if (inp)
        inp.classList.add('valid');
    if (err)
        err.classList.remove('show');
    if (tick)
        tick.classList.add('show');
}
function clearErr(id) {
    const inp = document.getElementById(id);
    const err = document.getElementById(id + 'Error');
    const tick = document.getElementById(id + 'Tick');
    if (inp)
        inp.classList.remove('error', 'valid');
    if (err)
        err.classList.remove('show');
    if (tick)
        tick.classList.remove('show');
}
function hideBanner() {
    const banner = document.getElementById('errorBanner');
    if (banner)
        banner.classList.remove('show');
}

function liveVal(id) {
    const inp = document.getElementById(id);
    if (!inp)
        return;
    const err = rules[id] ? rules[id](inp.value) : null;
    if (!inp.value && id !== 'password' && id !== 'confirmPw') {
        clearErr(id);
        hideBanner();
        return;
    }
    err ? setErr(id, err) : setOk(id);
    hideBanner();
}

// ── SAVE with form submission after validation ──
function handleSave() {
    const fields = ['fullName', 'dob', 'jobTitle', 'email', 'phone', 'address', 'twilioSid', 'twilioToken', 'twilioSender'];
    const errors = [];
    let first = null;

    fields.forEach(id => {
        const inp = document.getElementById(id);
        if (inp) {
            const err = rules[id](inp.value);
            if (err) {
                errors.push(err);
                setErr(id, err);
                if (!first)
                    first = inp;
            } else
                setOk(id);
        }
    });

    const pw = document.getElementById('password').value;
    const cpw = document.getElementById('confirmPw').value;
    if (pw) {
        const e1 = rules.password(pw);
        if (e1) {
            errors.push(e1);
            setErr('password', e1);
            if (!first)
                first = document.getElementById('password');
        } else
            clearErr('password');

        const e2 = rules.confirmPw(cpw);
        if (e2) {
            errors.push(e2);
            setErr('confirmPw', e2);
            if (!first)
                first = document.getElementById('confirmPw');
        } else
            setOk('confirmPw');
    } else {
        clearErr('password');
        clearErr('confirmPw');
    }

    if (errors.length) {
        const banner = document.getElementById('errorBanner');
        const errorList = document.getElementById('errorList');
        if (banner && errorList) {
            errorList.innerHTML = errors.slice(0, 5).map(e => `<li>${e}</li>`).join('');
            banner.classList.add('show');
        }
        if (first)
            first.scrollIntoView({behavior: 'smooth', block: 'center'});
        return;
    }

    // If validation passes, submit the form to EditServlet
    const form = document.getElementById('editProfileForm');
    if (form) {
        // Show loading state on button
        const btn = document.getElementById('saveBtn');
        if (btn) {
            btn.classList.add('loading');
            btn.disabled = true;
        }
        // Submit form
        form.submit();
    }
}

// ── RESET (clear fields and errors, but stay on same page) ──
function handleReset() {
    const defaultValues = {
        fullName: '',
        dob: '',
        jobTitle: '',
        email: '',
        phone: '',
        address: '',
        twilioSid: '',
        twilioToken: '',
        twilioSender: '',
        password: '',
        confirmPw: ''
    };
    for (let [id, val] of Object.entries(defaultValues)) {
        const el = document.getElementById(id);
        if (el)
            el.value = val;
        clearErr(id);
    }
    const pwStrength = document.getElementById('pwStrength');
    if (pwStrength)
        pwStrength.classList.remove('show');
    hideBanner();
    const btn = document.getElementById('saveBtn');
    if (btn) {
        btn.classList.remove('loading');
        btn.disabled = false;
    }
}

// Attach live validation to all required inputs
document.querySelectorAll('#fullName, #dob, #jobTitle, #email, #phone, #address, #twilioSid, #twilioToken, #twilioSender').forEach(inp => {
    inp.addEventListener('input', function () {
        liveVal(this.id);
    });
});
document.getElementById('confirmPw')?.addEventListener('input', function () {
    liveVal('confirmPw');
});

// Pre-run validation to set initial ticks
setTimeout(() => {
    ['fullName', 'dob', 'jobTitle', 'email', 'phone', 'address', 'twilioSid', 'twilioToken', 'twilioSender'].forEach(id => liveVal(id));
}, 100);

let usrheadname = document.getElementById("usr-head-name");
let pageheaderavatar = document.getElementById("page-header-avatar");
let useravatar = document.getElementById("user-avatar");
let topbaravatar = document.getElementById("topbar-avatar");
let userfullname = document.getElementById("user-name");
let fullNameValue = document.getElementById("fullName");
let dobValue = document.getElementById("dob");
let jobTitleValue = document.getElementById("jobTitle");
let emailValue = document.getElementById("email");
let phoneValue = document.getElementById("phone");
let addressValue = document.getElementById("address");

let twilioSidValue = document.getElementById("twilioSid");
let twilioTokenValue = document.getElementById("twilioToken");
let twilioSenderValue = document.getElementById("twilioSender");

let status_card = document.getElementById("status_card");

const loader = document.getElementById("page-loader");

function showLoader()
{
    loader.classList.remove("hidden");
}

function hideLoader()
{
    loader.classList.add("hidden");
}

function loadUserData()
{
    showLoader();
    fetch('../CustomerGetDataServlet').then(response => response.json()).then(data=>
    {
        const date = new Date(data.dob);

        fullNameValue.value = data.fullName;
        userfullname.innerHTML = data.fullName;
        usrheadname.innerHTML = data.fullName;
        useravatar.innerHTML = data.fullName[0];
        topbaravatar.innerHTML = data.fullName[0];
        pageheaderavatar.innerHTML = data.fullName[0];
        if (!isNaN(date))
        {
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            dobValue.value = `${yyyy}-${mm}-${dd}`;
        }
        jobTitleValue.value = data.jobTitle;
        emailValue.value = data.email;
        phoneValue.value = data.phoneNumber;
        addressValue.value = data.address;
        twilioSidValue.value = data.twilioAccountSID;
        twilioTokenValue.value = data.twilioAuthToken;
        twilioSenderValue.value = data.twilioSenderId;
        hideLoader();
    })
    .catch(error =>{
        console.log(error);
        hideLoader();
    });
}

window.onload = loadUserData();
