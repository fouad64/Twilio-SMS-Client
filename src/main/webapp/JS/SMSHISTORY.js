const loader = document.getElementById("page-loader");

function showLoader()
{
    loader.classList.remove("hidden");
}

function hideLoader()
{
    loader.classList.add("hidden");
}

// ── CLOCK ──
function tick() {
    document.getElementById('clock').textContent = new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'});
}
tick();
setInterval(tick, 1000);

// ── INPUT HANDLER ──
function onSearchInput() {
    const val = document.getElementById('searchInput').value;
    document.getElementById('inputClearBtn').classList.toggle('show', val.length > 0);
    document.getElementById('searchError').classList.remove('show');
}

// ── CLEAR INSIDE INPUT ──
function clearSearch() {
    document.getElementById('searchInput').value = '';
    document.getElementById('inputClearBtn').classList.remove('show');
    document.getElementById('searchError').classList.remove('show');
    document.getElementById('searchInput').focus();
}

function normalizePhone(phone)
{
    return phone
            .replace(/[\s()+-]/g, '')
            .toLowerCase();
}
// ── HANDLE SEARCH ──
function handleSearch() {

    const query =
            document.getElementById('searchInput')
            .value
            .trim();

    const btn = document.getElementById('searchBtn');

    btn.classList.add('loading');
    btn.disabled = true;

    setTimeout(() => {

        const smsData =
                JSON.parse(
                        localStorage.getItem('customer_sms')
                        ) || [];

        const searchValue = normalizePhone(query);

        const results = smsData.filter(sms =>
            normalizePhone(sms.toNumber)
                    .includes(searchValue)
        );

        renderSmsResults(results);

        btn.classList.remove('loading');
        btn.disabled = false;

    }, 700);
}

// ── RESET ──
function handleReset() {
    document.getElementById('searchInput').value = '';
    document.getElementById('inputClearBtn').classList.remove('show');
    document.getElementById('searchError').classList.remove('show');
    document.getElementById('resultsBar').style.display = 'none';
    document.getElementById('hintState').style.display = 'flex';
    document.getElementById('emptyState').style.display = 'none';
    document.getElementById('tableWrap').style.display = 'none';
    filteredData = [];
    lastQuery = '';
}

// ── RENDER ──
function renderSmsResults(data) {

    const hint = document.getElementById('hintState');
    const empty = document.getElementById('emptyState');
    const tableWrap = document.getElementById('tableWrap');
    const tbody = document.getElementById('resultsBody');

    hint.style.display = 'none';

    tbody.innerHTML = '';

    if (!data || data.length === 0) {

        empty.style.display = 'flex';
        tableWrap.style.display = 'none';

        return;
    }

    empty.style.display = 'none';
    tableWrap.style.display = 'block';

    data.forEach(row => {

        const tr = document.createElement('tr');
        const deleted_at = new Date(row.deletedDate);

        const datePart = deleted_at.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        const timePart = deleted_at.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        tr.innerHTML = `
            <td>
                <div class="td-id-badge">
                    SMS  -  ${row.smsId}
                </div>
            </td>

            <td>
                <div class="td-to">
                    <div class="to-icon">
                        <svg viewBox="0 0 13 13" fill="none"
                             stroke-width="1.5"
                             stroke-linecap="round"
                             stroke-linejoin="round">
                            <rect x="3" y="1" width="7" height="11" rx="1.2"></rect>
                            <path d="M5.5 9.5h2"></path>
                        </svg>
                    </div>

                    <span class="to-num">
                        ${row.toNumber}
                    </span>
                </div>
            </td>

            <td class="td-body">
                <div class="body-text">
                    ${row.body}
                </div>
            </td>

            <td class="td-date">
                <div class="date-primary">
                    ${datePart}
                </div>

                <div class="date-secondary">
                    ${timePart}
                </div>
            </td>
            <td class="td-actions">
                <button class="delete-btn" onclick="showDeleteModal(${row.deleted_Id})">
                    <svg viewBox="0 0 16 16" fill="none"
                         stroke-width="1.8"
                         stroke-linecap="round"
                         stroke-linejoin="round">
                        <path d="M2 4h12"/>
                        <path d="M6 1h4"/>
                        <rect x="3" y="4" width="10" height="11" rx="1"/>
                        <path d="M6.5 7v5M9.5 7v5"/>
                    </svg>
                    Forever
                </button>
            </td>
                    `;

        tbody.appendChild(tr);
    });
}

// ── HELPERS ──
function highlightText(text, query) {
    if (!query)
        return escHtml(text);
    const escaped = escHtml(text);
    const q = escHtml(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    return escaped.replace(new RegExp(q, 'gi'), m => `<span class="highlight">${m}</span>`);
}
function escHtml(t) {
    return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function formatDate(d) {
    const dt = new Date(d);
    return dt.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'});
}

// ── FLOATING PARTICLES ──
const pf = document.createElement('div');
pf.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden;';
document.body.appendChild(pf);
const pt = ['Searching… 🔍', 'Found SMS ✓', 'Filter active', 'To: +1 555', 'Results ready', 'SMS found'];
function spawnP() {
    const p = document.createElement('div');
    p.style.cssText = `position:absolute;background:rgba(20,8,14,0.8);border:1px solid rgba(232,23,60,0.2);border-radius:8px;padding:4px 10px;font-size:0.6rem;color:rgba(255,255,255,0.35);font-family:'DM Sans',sans-serif;white-space:nowrap;top:${10 + Math.random() * 80}%;right:-150px;`;
    p.textContent = pt[Math.floor(Math.random() * pt.length)];
    pf.appendChild(p);
    const dur = 8000 + Math.random() * 5000;
    p.animate([{opacity: 0, transform: 'translateX(0)'}, {opacity: 0.5, transform: 'translateX(-40px)', offset: 0.1}, {opacity: 0.2, transform: `translateX(-${40 + Math.random() * 20}vw)`, offset: 0.85}, {opacity: 0, transform: `translateX(-${50 + Math.random() * 20}vw)`}], {duration: dur, easing: 'ease-in-out', fill: 'forwards'});
    setTimeout(() => p.remove(), dur + 100);
}
spawnP();
setInterval(spawnP, 4000);

window.onload = function ()
{
    showLoader();
    loadCustomerData();
    loadSMStoCustomer();



};

function loadSMStoCustomer()
{
    return fetch('../GetDeletedHistoryByCustomerIDServlet')
            .then(response => response.json())
            .then(data =>
            {
                localStorage.setItem(
                        "customer_sms",
                        JSON.stringify(data)
                        );
                 console.log(data);
                renderSmsResults(data);

                hideLoader();
            })
            .catch(error =>
            {
                console.error(error);
            });
}

let selectedSmsId = null;

function showDeleteModal(id) {

    selectedSmsId = id;

    document
            .getElementById("deleteModal")
            .classList.add("show");
}

function closeDeleteModal() {

    selectedSmsId = null;

    document
            .getElementById("deleteModal")
            .classList.remove("show");
}

async function confirmDelete()
{
    if (selectedSmsId === null)
        return;
     document
            .getElementById("deleteModal")
            .classList.remove("show");
    try
    {
        const response = await fetch(
            "../DeleteSmsHistoryServlet",
            {
                method: "POST",
                headers:
                {
                    "Content-Type":
                        "application/x-www-form-urlencoded"
                },
                body:
                    "id=" +
                    encodeURIComponent(selectedSmsId)
            });

        if (!response.ok)
            throw new Error(
                "HTTP Error: " + response.status
            );

        closeDeleteModal();

        location.reload();
    }
    catch(error)
    {
        console.error(error);
    }
}

let user_avatar = document.getElementById("user-avatar");
let user_fullname = document.getElementById("user-name");
let usertopbar_avatar = document.getElementById("topbar-avatar");
let span_user_fullname = document.getElementById("span-fullname");

function loadCustomerData()
{

    fetch('../CustomerGetParametersServlet')
            .then(response => response.json())
            .then(data =>
            {
                const fullName = data.fullName ?? "";
                user_avatar.innerHTML = fullName ? fullName.charAt(0).toUpperCase() : "";
                usertopbar_avatar.innerHTML = fullName ? fullName.charAt(0).toUpperCase() : "";
                span_user_fullname.innerHTML = fullName;
                user_fullname.innerHTML = fullName;
            })
            .catch(error =>
            {
                console.log(error);
            });
}