// Clock
function updateClock() {
    const now = new Date();
    document.getElementById('clock').textContent = now.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'});
}
updateClock();
setInterval(updateClock, 1000);

// Date
document.getElementById('welcomeDate').textContent = new Date().toLocaleDateString('en-US', {weekday: 'long', month: 'long', day: 'numeric'});

// Floating particles
const field = document.createElement('div');
field.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden;';
document.body.appendChild(field);
const txts = ['SMS sent ✓', 'Delivered 📲', 'Twilio ✓', '1,247 sent', 'Active ⚡', 'Dashboard'];
function spawnP() {
    const p = document.createElement('div');
    p.style.cssText = `position:absolute;background:rgba(20,8,14,0.8);border:1px solid rgba(232,23,60,0.25);border-radius:8px;padding:4px 10px;font-size:0.6rem;color:rgba(255,255,255,0.45);font-family:'DM Sans',sans-serif;white-space:nowrap;top:${10 + Math.random() * 80}%;right:-150px;`;
    p.textContent = txts[Math.floor(Math.random() * txts.length)];
    field.appendChild(p);
    const dur = 8000 + Math.random() * 5000;
    p.animate([{opacity: 0, transform: 'translateX(0)'}, {opacity: 0.6, transform: 'translateX(-40px)', offset: 0.1}, {opacity: 0.3, transform: `translateX(-${40 + Math.random() * 20}vw)`, offset: 0.85}, {opacity: 0, transform: `translateX(-${50 + Math.random() * 20}vw)`}], {duration: dur, easing: 'ease-in-out', fill: 'forwards'});
    setTimeout(() => p.remove(), dur + 100);
}
spawnP();
setInterval(spawnP, 4000);


// loading data
//===========================

let user_avatar = document.getElementById("user-avatar");
let user_fullname = document.getElementById("user-name");
let usertopbar_avatar = document.getElementById("topbar-avatar");
let span_user_fullname = document.getElementById("span-fullname");
let account_status = document.getElementById("status-pill-dot");
let total_sms_sent = document.getElementById("Total-SMS-Sent");
let last_sms_sent = document.getElementById("Last-SMS-Sent");
let number_to = document.getElementById("number-to");
let card_account_status = document.getElementById("card-account-status");
let sms_to = document.getElementById("sms-to");
let sms_body = document.getElementById("sms-body");
let sms_time = document.getElementById("sms-time");
let sms_status = document.getElementById("sms-status");
let dott = document.getElementById("dott");

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

function loadCustomerData()
{
    showLoader();
    fetch('../CustomerGetParametersServlet')
            .then(response => response.json())
            .then(data =>
            {
                const fullName = data.fullName ?? "";
                const isActive = data.isActive ?? false;

                user_avatar.innerHTML = fullName ? fullName.charAt(0).toUpperCase() : "";
                usertopbar_avatar.innerHTML = fullName ? fullName.charAt(0).toUpperCase() : "";

                user_fullname.innerHTML = fullName;
                span_user_fullname.innerHTML = fullName;

                if (isActive)
                {
                    account_status.innerHTML += "Active";
                    account_status.style.cssText = "background:rgba(22,163,74,0.12);border:1px solid rgba(22,163,74,0.25);color:#86efac;";
                    card_account_status.innerHTML = "Active";
                    card_account_status.style.cssText = "color:#86efac;";
                } else
                {
                    account_status.innerHTML += "Inactive";
                    account_status.style.cssText = "background:rgba(232,23,60,0.1);border:1px solid rgba(232,23,60,0.22);color:#ff8a9a;";
                    card_account_status.innerHTML = "Inactive";
                    card_account_status.style.cssText = "color:#ff8a9a;";
                }

                total_sms_sent.innerHTML = data.customerTotalSentSms ?? "";


                const date = new Date(data.customerLastSmsSendAt);

                last_sms_sent.innerHTML =
                        isNaN(date.getTime())
                        ? "No SMS yet"
                        : `${date.getDate()} ${date.toLocaleString('en-US', {month: 'short'})} ${date.getFullYear()}`;

                sms_time.innerHTML = data.customerLastSmsSendAt ?? "";

                number_to.innerHTML = data.customerToNumber
                        ? "To : " + data.customerToNumber
                        : "";

                sms_to.innerHTML = data.customerToNumber
                        ? "To : " + data.customerToNumber
                        : "";

                sms_body.innerHTML = data.customerLastSmsBody ?? "";
                sms_status.innerHTML = data.customerLastSmsStatus ?? "";
                hideLoader();
            })
            .catch(error =>
            {
                console.log(error);
                hideLoader();
            });
}

window.onload = loadCustomerData;
