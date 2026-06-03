// Clock
function updateClock() {
    document.getElementById('clock').textContent = new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'});
}
updateClock();
setInterval(updateClock, 1000);

// Date
document.getElementById('welcomeDate').textContent = new Date().toLocaleDateString('en-US', {weekday: 'long', month: 'long', day: 'numeric'});

// Floating particles
const field = document.createElement('div');
field.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden;';
document.body.appendChild(field);
const txts = ['84 customers', '48k SMS ✓', 'Admin active 👑', 'System OK', 'Stats ready', 'Twilio ✓'];
function spawnP() {
    const p = document.createElement('div');
    p.style.cssText = `position:absolute;background:rgba(14,10,4,0.85);border:1px solid rgba(245,158,11,0.2);border-radius:8px;padding:4px 10px;font-size:0.6rem;color:rgba(255,255,255,0.4);font-family:'DM Sans',sans-serif;white-space:nowrap;top:${10 + Math.random() * 80}%;right:-150px;`;
    p.textContent = txts[Math.floor(Math.random() * txts.length)];
    field.appendChild(p);
    const dur = 8000 + Math.random() * 5000;
    p.animate([{opacity: 0, transform: 'translateX(0)'}, {opacity: 0.6, transform: 'translateX(-40px)', offset: 0.1}, {opacity: 0.3, transform: `translateX(-${40 + Math.random() * 20}vw)`, offset: 0.85}, {opacity: 0, transform: `translateX(-${50 + Math.random() * 20}vw)`}], {duration: dur, easing: 'ease-in-out', fill: 'forwards'});
    setTimeout(() => p.remove(), dur + 100);
}
spawnP();
setInterval(spawnP, 4000);