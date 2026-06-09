// ─── DATA STORE ───────────────────────────────────────────────
let customers = [];
let currentTab = 'all';
let deleteTargetUserId = null; 
let editMode = false;          

// ─── FETCH CUSTOMERS FROM SERVER ──────────────────────────────
function loadCustomersFromServer() {
  // Uses ../ to jump out of the /HTML/ subfolder down to the application root context
  fetch('../AdminGetCustomersServlet')
    .then(res => {
      if (!res.ok) throw new Error("Failed to pull system profiles.");
      return res.json();
    })
    .then(data => {
      customers = data;
      renderTable();
    })
    .catch(err => {
      console.error(err);
      showToast("Error connecting to server logs.", "error");
    });
}

// ─── CLOCK ────────────────────────────────────────────────────
function updateClock(){
  const now = new Date();
  document.getElementById('clock').textContent =
    now.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'});
}
setInterval(updateClock,1000); updateClock();

// ─── STATS ────────────────────────────────────────────────────
function updateStats(){
  const total = customers.length;
  const active = customers.filter(c => c.isActive).length;
  document.getElementById('statTotal').textContent = total;
  document.getElementById('statActive').textContent = active;
  document.getElementById('statInactive').textContent = total - active;
}

// ─── RENDER TABLE ─────────────────────────────────────────────
function initials(name){ return name ? name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2) : "??" }

function renderTable(){
  const q = document.getElementById('searchInput').value.toLowerCase();
  const filtered = customers.filter(c => {
    const matchTab = currentTab === 'all' || (currentTab === 'active' && c.isActive) || (currentTab === 'inactive' && !c.isActive);
    const matchQ = !q || 
                   (c.fullName && c.fullName.toLowerCase().includes(q)) || 
                   (c.username && c.username.toLowerCase().includes(q)) || 
                   (c.email && c.email.toLowerCase().includes(q));
    return matchTab && matchQ;
  });

  const tbody = document.getElementById('tableBody');
  if(filtered.length === 0){
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state">
      <svg viewBox="0 0 15 15" fill="none" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="7.5" cy="7.5" r="6.5"/><path d="M5 5l5 5M10 5l-5 5"/></svg>
      <p>No customers found</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(c => `
    <tr>
      <td>
        <div class="profile-cell">
          <div class="cust-avatar">${initials(c.fullName)}</div>
          <div>
            <div class="profile-name">${esc(c.fullName)}</div>
            <div class="profile-user">@${esc(c.username)}</div>
          </div>
        </div>
      </td>
      <td>
        <div style="font-size:.82rem">${esc(c.email)}</div>
        <div style="font-size:.72rem;color:var(--text-muted);margin-top:2px">${esc(c.phoneNumber)}</div>
      </td>
      <td>
        <div style="font-family:monospace;font-size:.72rem;color:var(--text-dim)">${esc(c.twilioAccountSID ? c.twilioAccountSID.slice(0,18) : '')}…</div>
        <div style="font-size:.7rem;color:var(--text-muted);margin-top:2px">${esc(c.twilioSenderId)}</div>
      </td>
      <td>
        <span class="status-badge ${c.isActive ? 'status-active' : 'status-inactive'}">
          <span class="status-dot"></span>${c.isActive ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td style="font-size:.78rem;color:var(--text-muted)">${c.createdAt ? c.createdAt.substring(0,10) : ''}</td>
      <td>
        <div class="action-btns">
          <button class="btn-edit" title="Edit" onclick="openEditModal(${c.customer_id})">
            <svg viewBox="0 0 15 15" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10.5 1.5l3 3-9 9H1.5v-3l9-9z"/></svg>
          </button>
          <button class="btn-toggle" title="${c.isActive ? 'Deactivate' : 'Activate'}" onclick="toggleActive(${c.customer_id})">
            <svg viewBox="0 0 15 15" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              ${c.isActive
                ? '<circle cx="7.5" cy="7.5" r="6.5"/><path d="M5 5l5 5M10 5l-5 5"/>'
                : '<circle cx="7.5" cy="7.5" r="6.5"/><path d="M5 7.5l2 2 3-3"}'}
            </svg>
          </button>
          <button class="btn-delete" title="Delete" onclick="openDelModal(${c.userId})">
            <svg viewBox="0 0 15 15" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 3 12 3"/><path d="M5 3V2h5v1"/><path d="M4 3l.5 9h6l.5-9"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');

  updateStats();
}

function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}

// ─── TABS / FILTER ────────────────────────────────────────────
function switchTab(t){
  currentTab = t;
  ['All','Active','Inactive'].forEach(x => {
    document.getElementById('tab' + x).classList.toggle('active', x.toLowerCase() === t);
  });
  renderTable();
}
function filterCustomers(){ renderTable() }

// ─── TOGGLE ACTIVE STATUS ────────────────────────────────────
function toggleActive(customerId){
  const target = customers.find(x => x.customer_id === customerId);
  if (!target) return;

  const u = new URLSearchParams();
  u.append("customerId", target.customer_id);
  u.append("userId", target.userId);
  u.append("fullName", target.fullName);
  u.append("dob", target.dob || '');
  u.append("jobTitle", target.jobTitle || '');
  u.append("email", target.email);
  u.append("phone", target.phoneNumber);
  u.append("address", target.address || '');
  u.append("username", target.username);
  u.append("password", ""); 
  u.append("twilioSid", target.twilioAccountSID || '');
  u.append("twilioToken", target.twilioAuthToken || '');
  u.append("twilioSender", target.twilioSenderId || '');
  u.append("isActive", !target.isActive); 

  fetch('../AdminEditCustomerServlet', {
     method: 'POST',
     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
     body: u
  })
  .then(res => res.json())
  .then(data => {
     if (data.status === "success") {
       showToast(`${target.fullName} status updated`, 'success');
       loadCustomersFromServer();
     } else {
       throw new Error(data.message);
     }
  })
  .catch(() => showToast("Failed to alter account state.", "error"));
}

// ─── PASSWORD TOGGLE ──────────────────────────────────────────
function togglePw(inputId, iconId){
  const inp = document.getElementById(inputId);
  const visible = inp.type === 'text';
  inp.type = visible ? 'password' : 'text';
  const svg = document.getElementById(iconId);
  svg.innerHTML = visible
    ? '<path d="M1 7.5s2.5-5 6.5-5 6.5 5 6.5 5-2.5 5-6.5 5-6.5-5-6.5-5z"/><circle cx="7.5" cy="7.5" r="2"/>'
    : '<path d="M1 7.5s2.5-5 6.5-5 6.5 5 6.5 5-2.5 5-6.5 5-6.5-5-6.5-5z"/><circle cx="7.5" cy="7.5" r="2"/><path d="M2 2l11 11" stroke-width="1.6"/>';
}

// ─── MODAL HELPERS ────────────────────────────────────────────
function openEditModal(customerId){
  editMode = true;
  const c = customers.find(x => x.customer_id === customerId);
  if (!c) return;
  
  document.getElementById('modalTitle').textContent = 'Edit Customer Profile';
  document.getElementById('modalSubtitle').textContent = 'Modify customer details, security settings, or Twilio configuration';
  document.getElementById('pwReqLabel').style.display = 'none';
  document.getElementById('pwOptLabel').style.display = '';
  document.getElementById('fPassword').required = false;

  document.getElementById('editId').value = c.customer_id;
  document.getElementById('fName').value = c.fullName || '';
  document.getElementById('fDob').value = c.dob || '';
  document.getElementById('fJob').value = c.jobTitle || '';
  document.getElementById('fEmail').value = c.email || '';
  document.getElementById('fPhone').value = c.phoneNumber || '';
  document.getElementById('fAddress').value = c.address || '';
  document.getElementById('fUsername').value = c.username || '';
  document.getElementById('fPassword').value = '';
  document.getElementById('fActive').checked = c.isActive;
  document.getElementById('fSid').value = c.twilioAccountSID || '';
  document.getElementById('fToken').value = c.twilioAuthToken || '';
  document.getElementById('fSender').value = c.twilioSenderId || '';

  document.getElementById('editModal').classList.add('open');
}

function openAddModal(){
  editMode = false;
  document.getElementById('modalTitle').textContent = 'Add New Customer';
  document.getElementById('modalSubtitle').textContent = 'Fill in the details below to register a new customer';
  document.getElementById('pwReqLabel').style.display = '';
  document.getElementById('pwOptLabel').style.display = 'none';
  document.getElementById('fPassword').required = true;

  document.getElementById('editId').value = '';
  document.getElementById('editForm').reset();
  document.getElementById('fActive').checked = true;

  document.getElementById('editModal').classList.add('open');
}

function closeEditModal(){
  document.getElementById('editModal').classList.remove('open');
}

function openDelModal(userId){
  deleteTargetUserId = userId;
  const c = customers.find(x => x.userId === userId);
  document.getElementById('delSubText').textContent =
    `Permanently remove "${c ? c.fullName : 'this customer'}" and all associated logs? This action cannot be undone.`;
  document.getElementById('delModal').classList.add('open');
}

function closeDelModal(){
  document.getElementById('delModal').classList.remove('open');
  deleteTargetUserId = null;
}

// ─── SAVE OR CREATE SUBMIT HANDLER ────────────────────────────
function saveCustomer(){
  const form = document.getElementById('editForm');
  if (!form.checkValidity()){ form.reportValidity(); return; }

  const btn = document.getElementById('saveBtn');
  btn.classList.add('loading');

  const customerId = document.getElementById('editId').value;
  const target = customers.find(x => x.customer_id == customerId);

  const u = new URLSearchParams();
  u.append("customerId", customerId);
  u.append("userId", target ? target.userId : '');
  u.append("fullName", document.getElementById('fName').value.trim());
  u.append("dob", document.getElementById('fDob').value);
  u.append("jobTitle", document.getElementById('fJob').value.trim());
  u.append("email", document.getElementById('fEmail').value.trim());
  u.append("phone", document.getElementById('fPhone').value.trim());
  u.append("address", document.getElementById('fAddress').value.trim());
  u.append("username", document.getElementById('fUsername').value.trim());
  u.append("password", document.getElementById('fPassword').value);
  u.append("isActive", document.getElementById('fActive').checked);
  u.append("twilioSid", document.getElementById('fSid').value.trim());
  u.append("twilioToken", document.getElementById('fToken').value.trim());
  u.append("twilioSender", document.getElementById('fSender').value.trim());

  fetch('../AdminEditCustomerServlet', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: u
  })
  .then(res => res.json())
  .then(data => {
     if (data.status === "success") {
       showToast('Customer profile processed successfully', 'success');
       closeEditModal();
       loadCustomersFromServer();
     } else {
       throw new Error(data.message);
     }
  })
  .catch(err => showToast(err.message || "Operation encountered an error", "error"))
  .finally(() => btn.classList.remove('loading'));
}

// ─── REMOVE USER PERMANENTLY FROM DATABASE ───────────────────
function confirmDelete(){
  if (deleteTargetUserId === null) return;
  
  const u = new URLSearchParams();
  u.append("userId", deleteTargetUserId);

  fetch('../AdminDeleteCustomerServlet', { 
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: u
  })
  .then(res => res.json())
  .then(data => {
      if (data.status === "success") {
        showToast('Customer deleted successfully', 'error');
        closeDelModal();
        loadCustomersFromServer();
      } else {
        throw new Error(data.message);
      }
    })
    .catch(() => showToast("Failed to fully delete customer record.", "error"));
}

// Backdrop and Escape bindings
document.getElementById('editModal').addEventListener('click', e => { if (e.target === e.currentTarget) closeEditModal() });
document.getElementById('delModal').addEventListener('click', e => { if (e.target === e.currentTarget) closeDelModal() });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeEditModal(); closeDelModal() } });

document.addEventListener("DOMContentLoaded", loadCustomersFromServer);