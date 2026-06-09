// Clock
function updateClock() {
    const clockEl = document.getElementById('clock');
    if (clockEl) {
        clockEl.textContent = new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'});
    }
}
updateClock();
setInterval(updateClock, 1000);

// Date
const dateEl = document.getElementById('welcomeDate');
if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('en-US', {weekday: 'long', month: 'long', day: 'numeric'});
}

// Dynamic Metrics Loader
function loadDashboardMetrics() {

    fetch('../AdminDashboardStatsServlet')
        .then(response => response.json())
        .then(data => {

            const totalEl = document.getElementById('statTotal');
            const messagesEl = document.getElementById('statMessages');
            const activeEl = document.getElementById('statMostActive');

            if (totalEl)
                totalEl.textContent = data.totalCustomers;

            if (messagesEl)
                messagesEl.textContent = data.totalMessages;

            if (activeEl)
                activeEl.textContent = data.mostActiveCustomer;
        })
        .catch(err =>
            console.error("Dashboard statistics error:", err)
        );
}

// Dynamic Admin Profile Loader
function loadAdminProfileSession() {
    fetch('../AdminGetCustomersServlet')
      .then(res => res.json())
      .then(data => {
          const nameEl = document.getElementById('adminName');
          const avatarEl = document.getElementById('adminAvatar');
          const roleEl = document.getElementById('adminRole');

          if (nameEl) nameEl.textContent = "Root Admin"; 
          if (avatarEl) avatarEl.textContent = "A";
          if (roleEl) roleEl.textContent = "System Controller";
      })
      .catch(err => {
          console.error("Profile payload map failure:", err);
          // Fallback parameters if network is interrupted
          const nameEl = document.getElementById('adminName');
          if (nameEl) nameEl.textContent = "Root Admin";
      });
}

// Floating particles
const field = document.createElement('div');
field.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden;';
document.body.appendChild(field);
const txts = ['Database connected ✓', 'System OK', 'Stats ready', 'Twilio Gateway Live ✓'];

function spawnP() {
    const p = document.createElement('div');
    p.style.cssText = `position:absolute;background:rgba(14,10,4,0.85);border:1px solid rgba(245,158,11,0.2);border-radius:8px;padding:4px 10px;font-size:0.6rem;color:rgba(255,255,255,0.4);font-family:'DM Sans',sans-serif;white-space:nowrap;top:${10 + Math.random() * 80}%;right:-150px;transition:transform 8s linear;`;
    p.textContent = txts[Math.floor(Math.random() * txts.length)];
    field.appendChild(p);
    
    setTimeout(() => {
        p.style.transform = `translateX(-${window.innerWidth + 300}px)`;
    }, 50);
    setTimeout(() => p.remove(), 8500);
}
setInterval(spawnP, 4000);

// Initialize dynamic updates once DOM renders
document.addEventListener("DOMContentLoaded", () => {
    loadDashboardMetrics();
    loadAdminProfileSession();
});