// Clock only
function tick() {
    document.getElementById('clock').textContent =
            new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'});
}
tick();
setInterval(tick, 1000);

// Floating particles — design only
const field = document.createElement('div');
field.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden;';
document.body.appendChild(field);
const txts = ['Profile ✓', 'Verified 🔐', 'Twilio linked', 'SMS active', 'John Doe', 'Account OK'];
function spawnP() {
    const p = document.createElement('div');
    p.style.cssText = `position:absolute;background:rgba(20,8,14,0.8);border:1px solid rgba(232,23,60,0.22);border-radius:8px;padding:4px 10px;font-size:0.6rem;color:rgba(255,255,255,0.4);font-family:'DM Sans',sans-serif;white-space:nowrap;top:${10 + Math.random() * 80}%;right:-150px;`;
    p.textContent = txts[Math.floor(Math.random() * txts.length)];
    field.appendChild(p);
    const dur = 8000 + Math.random() * 5000;
    p.animate([
        {opacity: 0, transform: 'translateX(0)'},
        {opacity: 0.55, transform: 'translateX(-40px)', offset: 0.1},
        {opacity: 0.25, transform: `translateX(-${40 + Math.random() * 20}vw)`, offset: 0.85},
        {opacity: 0, transform: `translateX(-${50 + Math.random() * 20}vw)`}
    ], {duration: dur, easing: 'ease-in-out', fill: 'forwards'});
    setTimeout(() => p.remove(), dur + 100);
}
spawnP();
setInterval(spawnP, 4000);

let user_avatar = document.getElementById("user-avatar");
let user_name = document.getElementById("user-name");
let topbar_user_avatar = document.getElementById("topbar-avatar");
let user_avatar_ring = document.getElementById("avatar-ring");
let user_hero_name = document.getElementById("hero-name");
let user_name_and_job = document.getElementById("username-job");
let user_pill_dot_status = document.getElementById("pill-dot-status");
let info_value_name = document.getElementById("info-value-name");
let info_value_dob = document.getElementById("info-value-dob");
let info_value_job = document.getElementById("info-value-job");
let info_value_address = document.getElementById("info-value-address");
let info_value_user_name = document.getElementById("info-value-user-name");
let info_value_email = document.getElementById("info-value-email");
let info_value_phone_number = document.getElementById("info-value-phone-number");
let Account_SID = document.getElementById("Account-SID");
let Allowed_Sender_ID = document.getElementById("Allowed-Sender-ID");
let status_pill_big_user = document.getElementById("status-pill-big-user");
let user_createdAt = document.getElementById("Since");
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

function LoaddUserData()
{
    showLoader();
    fetch('../CustomerGetDataServlet').then(response => response.json()).then(data =>
    {
        user_avatar.innerHTML = data.fullName[0];
        topbar_user_avatar.innerHTML = data.fullName[0];
        user_avatar_ring.innerHTML = data.fullName[0];
        user_name.innerHTML = data.username;
        user_hero_name.innerHTML = data.fullName;
        info_value_name.innerHTML = data.fullName;
        info_value_user_name.innerHTML = data.username;
        user_name_and_job.innerHTML = "@" + data.username + " - " + data.jobTitle;
        info_value_dob.innerHTML = data.dob;
        info_value_job.innerHTML = data.jobTitle;
        info_value_address.innerHTML = data.address;
        info_value_email.innerHTML = data.email;
        info_value_phone_number.innerHTML = data.phoneNumber;
        Account_SID.innerHTML = data.twilioAccountSID;
        Allowed_Sender_ID.innerHTML = data.twilioSenderId;
        user_createdAt.innerHTML = data.createdAt;
        if (data.isActive)
        {
            status_pill_big_user.innerHTML = "Active";
            user_pill_dot_status.innerHTML = "Active";
            status_pill_big_user.style.cssText = "background:rgba(22,163,74,0.12);border:1px solid rgba(22,163,74,0.25);color:#86efac;";
            user_pill_dot_status.style.cssText = "background:rgba(22,163,74,0.12);border:1px solid rgba(22,163,74,0.25);color:#86efac;";
            status_card.style.cssText  = "background:rgba(22,163,74,0.12);";

        }
        else
        {
            status_pill_big_user.innerHTML = "Inactive";
            user_pill_dot_status.innerHTML = "Inactive";
            status_pill_big_user.style.cssText = "background:rgba(232,23,60,0.1);border:1px solid rgba(232,23,60,0.22);color:#ff8a9a;";
            user_pill_dot_status.style.cssText = "background:rgba(232,23,60,0.1);border:1px solid rgba(232,23,60,0.22);color:#ff8a9a;";
            status_card.style.cssText  = "background:rgba(232,23,60,0.1 );";
        }
        console.log(data);
        hideLoader();
    })
    .catch(error =>
    {
        console.log(error);
         hideLoader();
    });
}

window.onload = LoaddUserData();