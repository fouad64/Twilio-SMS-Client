// ── CLOCK ──
function tick() {
    const el = document.getElementById('clock');
    if (el)
        el.textContent = new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'});
}
tick();
setInterval(tick, 1000);

// ── VALIDATION RULES ──
const phoneRegex = /^\+\d{7,15}$/;
const smsRules = {
    fromNumber: v => !v.trim() ? 'Sender number is required'
                : !phoneRegex.test(v.trim()) ? 'Format must be like: +16624957872' : null,
    toNumber: v => !v.trim() ? 'Recipient number is required'
                : !phoneRegex.test(v.trim()) ? 'Format must be like: +12025551234' : null,
    smsBody: v => !v.trim() ? 'Message body is required'
                : v.trim().length > 1600 ? 'Message exceeds 1600 characters' : null
};

function setErr(id, msg) {
    const inp = document.getElementById(id);
    const err = document.getElementById(id + 'Error');
    const msgEl = document.getElementById(id + 'Msg');
    const tick = document.getElementById(id + 'Tick');
    if (inp) {
        inp.classList.add('error');
        inp.classList.remove('valid');
    }
    if (msgEl)
        msgEl.textContent = msg;
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
    if (inp) {
        inp.classList.remove('error');
        inp.classList.add('valid');
    }
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
    const b = document.getElementById('errorBanner');
    if (b)
        b.classList.remove('show');
}

function liveValidate(id) {
    const inp = document.getElementById(id);
    if (!inp)
        return;
    if (!inp.value) {
        clearErr(id);
        hideBanner();
        return;
    }
    const e = smsRules[id] ? smsRules[id](inp.value) : null;
    e ? setErr(id, e) : setOk(id);
    hideBanner();
}

// ── BODY INPUT: char counter + preview + segment ──
function onBodyInput() {
    const ta = document.getElementById('smsBody');
    const val = ta ? ta.value : '';
    const len = val.length;

    // char counter
    const counter = document.getElementById('charCounter');
    if (counter) {
        const limit = len <= 160 ? 160 : Math.ceil(len / 153) * 153;
        counter.textContent = len + ' / ' + (len <= 160 ? 160 : limit);
        counter.className = 'char-counter' + (len > 1400 ? ' over' : len > 1200 ? ' warn' : '');
    }

    // segments
    const segInfo = document.getElementById('segmentInfo');
    const segCount = document.getElementById('segmentCount');
    if (len > 0) {
        segInfo.style.cssText = '';
        const segs = len <= 160 ? 1 : Math.ceil(len / 153);
        if (segCount)
            segCount.textContent = segs + ' segment' + (segs > 1 ? 's' : '');
    } else {
        segInfo.style.cssText = 'display:none!important';
    }

    // live preview bubble
    const bubble = document.getElementById('previewBubble');
    if (bubble) {
        if (!val.trim()) {
            bubble.textContent = 'Your message will appear here…';
            bubble.classList.add('empty');
        } else {
            bubble.textContent = val;
            bubble.classList.remove('empty');
        }
    }

    // preview timestamp
    const meta = document.getElementById('previewMeta');
    if (meta) {
        meta.textContent = new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'});
    }

    // validation
    if (val) {
        const e = smsRules.smsBody(val);
        e ? setErr('smsBody', e) : setOk('smsBody');
    } else {
        clearErr('smsBody');
    }
    hideBanner();
}

// ── UPDATE PREVIEW FROM NUMBER ──
document.getElementById('fromNumber')?.addEventListener('input', function () {
    const prev = document.getElementById('previewFrom');
    if (prev)
        prev.textContent = 'From: ' + (this.value || '—');
});

// ── SEND ──
function handleSend() {
    const fields = ['fromNumber', 'toNumber', 'smsBody'];
    const errors = [];
    let first = null;
    fields.forEach(id => {
        const inp = document.getElementById(id);
        if (inp) {
            const e = smsRules[id](inp.value);
            if (e) {
                errors.push(e);
                setErr(id, e);
                if (!first)
                    first = inp;
            } else
                setOk(id);
        }
    });
    if (errors.length) {
        const banner = document.getElementById('errorBanner');
        const list = document.getElementById('errorList');
        if (banner && list) {
            list.innerHTML = errors.slice(0, 5).map(e => `<li>${e}</li>`).join('');
            banner.classList.add('show');
        }
        if (first)
            first.scrollIntoView({behavior: 'smooth', block: 'center'});
        return;
    }
    const btn = document.getElementById('sendBtn');
    if (btn) {
        btn.classList.add('loading');
        btn.disabled = true;
    }
    document.getElementById('sendSmsForm').submit();
}

// ── CLEAR ──
function handleClear() {
    ['toNumber', 'smsBody'].forEach(id => {
        const el = document.getElementById(id);
        if (el)
            el.value = '';
        clearErr(id);
    });
    const counter = document.getElementById('charCounter');
    if (counter) {
        counter.textContent = '0 / 160';
        counter.className = 'char-counter';
    }
    const segInfo = document.getElementById('segmentInfo');
    if (segInfo)
        segInfo.style.cssText = 'display:none!important';
    const bubble = document.getElementById('previewBubble');
    if (bubble) {
        bubble.textContent = 'Your message will appear here…';
        bubble.classList.add('empty');
    }
    const previewFrom = document.getElementById('previewFrom');
    if (previewFrom)
        previewFrom.textContent = 'From: —';
    const btn = document.getElementById('sendBtn');
    if (btn) {
        btn.classList.remove('loading');
        btn.disabled = false;
    }
    hideBanner();
}

// ── LOAD USER DATA ──
const loader = document.getElementById('page-loader');
function showLoader() {
    loader.classList.remove('hidden');
}
function hideLoader() {
    loader.classList.add('hidden');
}

function loadUserData() {
    showLoader();
    fetch('../CustomerGetDataServlet')
            .then(r => r.json())
            .then(data => {
                document.getElementById('user-name').innerHTML = data.fullName;
                document.getElementById('usr-head-name').innerHTML = data.fullName;
                document.getElementById('user-avatar').innerHTML = data.fullName[0];
                document.getElementById('topbar-avatar').innerHTML = data.fullName[0];
                document.getElementById('page-header-avatar').innerHTML = data.fullName[0];
                // Pre-fill sender number from stored Twilio credentials
                const twilioSid = document.getElementById('twilioSid');
                const twilioToken = document.getElementById('twilioToken');
                twilioSid.value = data.twilioAccountSID;
                twilioToken.value = data.twilioAuthToken;
                const fromEl = document.getElementById('fromNumber');
                if (fromEl && data.twilioSenderId) {
                    fromEl.value = data.twilioSenderId;
                    fromEl.readOnly = true;
                    setOk('fromNumber');
                    const prev = document.getElementById('previewFrom');
                    if (prev)
                        prev.textContent = 'From: ' + data.twilioSenderId;
                }
                hideLoader();
            })
            .catch(err => {
                console.log(err);
                hideLoader();
            });
}

window.onload = loadUserData();