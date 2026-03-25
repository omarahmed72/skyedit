import sys
import re

file_path = r'd:\latest sky\Sky-main\dashboard.html'
try:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Replace Sidebar Links
    sidebar_old = """          <a href="#" class="dash-link active">
            <i class="fas fa-th-large"></i> <span>Dashboard</span>
          </a>
          <a href="#" class="dash-link">
            <i class="fas fa-building"></i> <span>Properties</span>
          </a>
          <a href="#" class="dash-link">
            <i class="far fa-user"></i> <span>Contacts</span>
          </a>
          <a href="#" class="dash-link">
            <i class="fas fa-list-ul"></i> <span>Listing</span>
          </a>
          <a href="#" class="dash-link">
            <i class="fas fa-users"></i> <span>Clients</span>
          </a>
          <a href="#" class="dash-link">
            <i class="fas fa-chart-line"></i> <span>Reports</span>
          </a>
          <a href="#" class="dash-link">
            <i class="fas fa-cog"></i> <span>Settings</span>
          </a>"""

    sidebar_new = """          <a href="#" class="dash-link active" onclick="switchTab('dashboard')">
            <i class="fas fa-th-large"></i> <span>Dashboard</span>
          </a>
          <a href="#" class="dash-link" onclick="switchTab('projects')">
            <i class="fas fa-building"></i> <span>Projects</span>
          </a>
          <a href="#" class="dash-link" onclick="switchTab('units')">
            <i class="fas fa-cube"></i> <span>Units</span>
          </a>
          <a href="#" class="dash-link" onclick="switchTab('accounts')">
            <i class="fas fa-user-shield"></i> <span>Accounts</span>
          </a>
          <a href="#" class="dash-link" onclick="switchTab('clients')">
            <i class="fas fa-users"></i> <span>Clients</span>
          </a>"""

    content = content.replace(sidebar_old, sidebar_new)

    # 2. Extract and Wrap Main Content
    main_pattern = re.compile(r'(<main class="flex flex-col gap-6">\s*<!-- Header -->\s*<div class="flex justify-between items-center">\s*<h1 class="text-2xl font-bold text-\[var\(--text-color\)\]">.*?</h1>\s*<div class="flex gap-3">.*?</div>\s*</div>)(.*?)(</main>)', re.DOTALL)

    match = main_pattern.search(content)
    if match:
        header_part = match.group(1).replace('class="text-2xl font-bold text-[var(--text-color)]"', 'class="text-2xl font-bold text-[var(--text-color)]" id="dashboard-title"')
        body_part = match.group(2)
        
        new_main = f'''{header_part}

          <!-- Dashboard Tab -->
          <div id="tab-dashboard" class="tab-content flex flex-col gap-6">{body_part}</div>

          <!-- Projects Tab -->
          <div id="tab-projects" class="tab-content hidden flex-col gap-6">
             <div class="dash-card">
                <div class="flex justify-between items-center mb-4">
                  <h3 class="font-bold text-[var(--text-color)]">Projects Management</h3>
                  <button onclick="openModal('projectModal')" class="bg-[var(--accent-gold)] text-white px-4 py-2 rounded text-xs font-bold hover:bg-yellow-600 transition">
                    + Add Project
                  </button>
                </div>
                <div class="overflow-x-auto">
                  <table class="w-full text-left border-collapse">
                    <thead>
                      <tr class="text-[var(--text-muted)] text-xs border-b border-[var(--nav-border)]">
                        <th class="py-3 font-medium">Project Name</th>
                        <th class="py-3 font-medium">Location</th>
                        <th class="py-3 font-medium">Status</th>
                        <th class="py-3 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody class="text-sm text-[var(--text-color)]" id="projects-table-body">
                    </tbody>
                  </table>
                </div>
             </div>
          </div>

          <!-- Units Tab -->
          <div id="tab-units" class="tab-content hidden flex-col gap-6">
             <div class="dash-card">
                <div class="flex justify-between items-center mb-4">
                  <h3 class="font-bold text-[var(--text-color)]">Units Management</h3>
                  <button onclick="openModal('unitModal')" class="bg-[var(--accent-gold)] text-white px-4 py-2 rounded text-xs font-bold hover:bg-yellow-600 transition">
                    + Add Unit
                  </button>
                </div>
                <div class="overflow-x-auto">
                  <table class="w-full text-left border-collapse">
                    <thead>
                      <tr class="text-[var(--text-muted)] text-xs border-b border-[var(--nav-border)]">
                        <th class="py-3 font-medium">Unit Type</th>
                        <th class="py-3 font-medium">Project</th>
                        <th class="py-3 font-medium">Price</th>
                        <th class="py-3 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody class="text-sm text-[var(--text-color)]" id="units-table-body">
                    </tbody>
                  </table>
                </div>
             </div>
          </div>

          <!-- Accounts Tab -->
          <div id="tab-accounts" class="tab-content hidden flex-col gap-6">
             <div class="dash-card">
                <div class="flex justify-between items-center mb-4">
                  <h3 class="font-bold text-[var(--text-color)]">Accounts Management</h3>
                  <button onclick="openModal('accountModal')" class="bg-[var(--accent-gold)] text-white px-4 py-2 rounded text-xs font-bold hover:bg-yellow-600 transition">
                    + Add Account
                  </button>
                </div>
                <div class="overflow-x-auto">
                  <table class="w-full text-left border-collapse">
                    <thead>
                      <tr class="text-[var(--text-muted)] text-xs border-b border-[var(--nav-border)]">
                        <th class="py-3 font-medium">Name</th>
                        <th class="py-3 font-medium">Email</th>
                        <th class="py-3 font-medium">Role</th>
                        <th class="py-3 font-medium">Can Edit Dashboard</th>
                        <th class="py-3 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody class="text-sm text-[var(--text-color)]" id="accounts-table-body">
                    </tbody>
                  </table>
                </div>
             </div>
          </div>

          <!-- Clients Tab -->
          <div id="tab-clients" class="tab-content hidden flex-col gap-6">
             <div class="dash-card">
                <div class="flex justify-between items-center mb-4">
                  <h3 class="font-bold text-[var(--text-color)]">Clients Management</h3>
                  <button onclick="openModal('clientModal')" class="bg-[var(--accent-gold)] text-white px-4 py-2 rounded text-xs font-bold hover:bg-yellow-600 transition">
                    + Add Client
                  </button>
                </div>
                <div class="overflow-x-auto">
                  <table class="w-full text-left border-collapse">
                    <thead>
                      <tr class="text-[var(--text-muted)] text-xs border-b border-[var(--nav-border)]">
                        <th class="py-3 font-medium">Name</th>
                        <th class="py-3 font-medium">Contact Email</th>
                        <th class="py-3 font-medium">Assigned Project(s)</th>
                        <th class="py-3 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody class="text-sm text-[var(--text-color)]" id="clients-table-body">
                    </tbody>
                  </table>
                </div>
             </div>
          </div>
        </main>'''
        
        content = content[:match.start()] + new_main + content[match.end():]
    else:
        print("warn: could not find main content block.")

    # 3. Add Modals and Scripts
    modals_and_scripts = '''

    <!-- Manage Entities Modals -->
    <!-- Project Modal -->
    <div id="projectModal" class="hidden fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-[var(--bg-color)] rounded-lg p-6 w-full max-w-md border border-[var(--nav-border)]">
        <h3 class="text-xl font-bold text-[var(--text-color)] mb-4" id="projectModalTitle">Add Project</h3>
        <form id="projectForm" onsubmit="saveProject(event)" class="flex flex-col gap-4">
          <input type="hidden" id="projectId">
          <div>
            <label class="block text-xs text-[var(--text-muted)] mb-1">Project Name</label>
            <input type="text" id="projectName" class="w-full bg-transparent border border-[var(--nav-border)] rounded px-3 py-2 text-[var(--text-color)] outline-none focus:border-[var(--accent-gold)]" required>
          </div>
          <div>
            <label class="block text-xs text-[var(--text-muted)] mb-1">Location</label>
            <input type="text" id="projectLocation" class="w-full bg-transparent border border-[var(--nav-border)] rounded px-3 py-2 text-[var(--text-color)] outline-none focus:border-[var(--accent-gold)]" required>
          </div>
          <div>
            <label class="block text-xs text-[var(--text-muted)] mb-1">Status</label>
            <select id="projectStatus" class="w-full bg-transparent border border-[var(--nav-border)] rounded px-3 py-2 text-[var(--text-color)] outline-none focus:border-[var(--accent-gold)]" style="background-color: var(--bg-color);">
              <option value="Active">Active</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div class="flex justify-end gap-2 mt-2">
            <button type="button" onclick="closeModal('projectModal')" class="px-4 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-color)] transition">Cancel</button>
            <button type="submit" class="bg-[var(--accent-gold)] text-white px-4 py-2 rounded text-sm font-bold hover:scale-105 transition">Save</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Unit Modal -->
    <div id="unitModal" class="hidden fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-[var(--bg-color)] rounded-lg p-6 w-full max-w-md border border-[var(--nav-border)]">
        <h3 class="text-xl font-bold text-[var(--text-color)] mb-4" id="unitModalTitle">Add Unit</h3>
        <form id="unitForm" onsubmit="saveUnit(event)" class="flex flex-col gap-4">
          <input type="hidden" id="unitId">
          <div>
            <label class="block text-xs text-[var(--text-muted)] mb-1">Unit Type</label>
            <input type="text" id="unitType" placeholder="e.g., 3 Bedroom Apartment" class="w-full bg-transparent border border-[var(--nav-border)] rounded px-3 py-2 text-[var(--text-color)] outline-none focus:border-[var(--accent-gold)]" required>
          </div>
          <div>
            <label class="block text-xs text-[var(--text-muted)] mb-1">Project</label>
            <select id="unitProject" class="w-full bg-transparent border border-[var(--nav-border)] rounded px-3 py-2 text-[var(--text-color)] outline-none focus:border-[var(--accent-gold)]" style="background-color: var(--bg-color);"></select>
          </div>
          <div>
            <label class="block text-xs text-[var(--text-muted)] mb-1">Price</label>
            <input type="number" id="unitPrice" class="w-full bg-transparent border border-[var(--nav-border)] rounded px-3 py-2 text-[var(--text-color)] outline-none focus:border-[var(--accent-gold)]" required>
          </div>
          <div class="flex justify-end gap-2 mt-2">
            <button type="button" onclick="closeModal('unitModal')" class="px-4 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-color)] transition">Cancel</button>
            <button type="submit" class="bg-[var(--accent-gold)] text-white px-4 py-2 rounded text-sm font-bold hover:scale-105 transition">Save</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Account Modal -->
    <div id="accountModal" class="hidden fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-[var(--bg-color)] rounded-lg p-6 w-full max-w-md border border-[var(--nav-border)]">
        <h3 class="text-xl font-bold text-[var(--text-color)] mb-4" id="accountModalTitle">Add Account</h3>
        <form id="accountForm" onsubmit="saveAccount(event)" class="flex flex-col gap-4">
          <input type="hidden" id="accountId">
          <div>
            <label class="block text-xs text-[var(--text-muted)] mb-1">Name</label>
            <input type="text" id="accountName" class="w-full bg-transparent border border-[var(--nav-border)] rounded px-3 py-2 text-[var(--text-color)] outline-none focus:border-[var(--accent-gold)]" required>
          </div>
          <div>
            <label class="block text-xs text-[var(--text-muted)] mb-1">Email</label>
            <input type="email" id="accountEmail" class="w-full bg-transparent border border-[var(--nav-border)] rounded px-3 py-2 text-[var(--text-color)] outline-none focus:border-[var(--accent-gold)]" required>
          </div>
          <div>
            <label class="block text-xs text-[var(--text-muted)] mb-1">Role</label>
            <select id="accountRole" class="w-full bg-transparent border border-[var(--nav-border)] rounded px-3 py-2 text-[var(--text-color)] outline-none focus:border-[var(--accent-gold)]" style="background-color: var(--bg-color);">
              <option value="Admin">Admin</option>
              <option value="Client">Client</option>
              <option value="Agent">Agent</option>
            </select>
          </div>
          <div class="flex items-center gap-2 mt-2">
            <input type="checkbox" id="accountCanEdit" class="w-4 h-4 accent-[var(--accent-gold)]">
            <label for="accountCanEdit" class="text-sm text-[var(--text-color)]">Grant Dashboard Edit Permissions</label>
          </div>
          <div class="flex justify-end gap-2 mt-2">
            <button type="button" onclick="closeModal('accountModal')" class="px-4 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-color)] transition">Cancel</button>
            <button type="submit" class="bg-[var(--accent-gold)] text-white px-4 py-2 rounded text-sm font-bold hover:scale-105 transition">Save</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Client Modal -->
    <div id="clientModal" class="hidden fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-[var(--bg-color)] rounded-lg p-6 w-full max-w-md border border-[var(--nav-border)]">
        <h3 class="text-xl font-bold text-[var(--text-color)] mb-4" id="clientModalTitle">Add Client</h3>
        <form id="clientForm" onsubmit="saveClient(event)" class="flex flex-col gap-4">
          <input type="hidden" id="clientId">
          <div>
            <label class="block text-xs text-[var(--text-muted)] mb-1">Name</label>
            <input type="text" id="clientName" class="w-full bg-transparent border border-[var(--nav-border)] rounded px-3 py-2 text-[var(--text-color)] outline-none focus:border-[var(--accent-gold)]" required>
          </div>
          <div>
            <label class="block text-xs text-[var(--text-muted)] mb-1">Contact Email</label>
            <input type="email" id="clientEmail" class="w-full bg-transparent border border-[var(--nav-border)] rounded px-3 py-2 text-[var(--text-color)] outline-none focus:border-[var(--accent-gold)]" required>
          </div>
          <div>
            <label class="block text-xs text-[var(--text-muted)] mb-1">Assigned Project(s)</label>
            <input type="text" id="clientProjects" placeholder="e.g., Redgewood Street" class="w-full bg-transparent border border-[var(--nav-border)] rounded px-3 py-2 text-[var(--text-color)] outline-none focus:border-[var(--accent-gold)]" required>
          </div>
          <div class="flex justify-end gap-2 mt-2">
            <button type="button" onclick="closeModal('clientModal')" class="px-4 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-color)] transition">Cancel</button>
            <button type="submit" class="bg-[var(--accent-gold)] text-white px-4 py-2 rounded text-sm font-bold hover:scale-105 transition">Save</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Dashboard Scripts -->
    <script>
       // Tab Switcher
       function switchTab(tabId) {
         document.querySelectorAll('.tab-content').forEach(el => {
           el.classList.add('hidden');
           el.classList.remove('flex');
         });
         const target = document.getElementById('tab-' + tabId);
         if(target) {
           target.classList.remove('hidden');
           target.classList.add('flex');
         }

         document.querySelectorAll('.dash-sidebar .dash-link').forEach(el => {
           el.classList.remove('active');
         });
         const activeLink = document.querySelector(`.dash-sidebar .dash-link[onclick="switchTab('${tabId}')"]`);
         if(activeLink) activeLink.classList.add('active');

         const titleMap = {
           'dashboard': 'Good Morning Omar Faruk 👋',
           'projects': 'Manage Projects',
           'units': 'Manage Units',
           'accounts': 'Manage Accounts & Permissions',
           'clients': 'Manage Clients'
         };
         document.getElementById('dashboard-title').innerText = titleMap[tabId] || 'Dashboard';
       }

       // Modal Logic
       function openModal(modalId) {
         document.getElementById(modalId).classList.remove('hidden');
       }
       function closeModal(modalId) {
         document.getElementById(modalId).classList.add('hidden');
         const form = document.querySelector(`#${modalId} form`);
         if(form) form.reset();
       }

       // State Management (Mock DB)
       let projects = [
         { id: 1, name: 'Redgewood Street', location: '4578 Ridge, Westmount', status: 'Active' },
         { id: 2, name: 'Main Street', location: '7864 Main St, Laurent', status: 'Upcoming' }
       ];
       let units = [
         { id: 1, type: '3 Bedroom Apartment', project: 'Redgewood Street', price: 456000 },
         { id: 2, type: 'Office Space', project: 'Main Street', price: 243000 }
       ];
       let accounts = [
         { id: 1, name: 'Omar Faruk', email: 'omar@skypioneers.com', role: 'Admin', canEdit: true },
         { id: 2, name: 'John Doe', email: 'john@skypioneers.com', role: 'Agent', canEdit: false }
       ];
       let clients = [
         { id: 1, name: 'Esard award', email: 'esard.award@gmail.com', projects: 'Redgewood Street' },
         { id: 2, name: 'Micale vandar', email: 'micale@gmail.com', projects: 'Main Street' }
       ];

       // Render Functions
       function renderProjects() {
         const tbody = document.getElementById('projects-table-body');
         if(!tbody) return;
         tbody.innerHTML = projects.map(p => `
           <tr class="hover:bg-[var(--pill-bg)] transition border-b border-[var(--nav-border)]">
             <td class="py-3 font-medium">${p.name}</td>
             <td class="py-3 text-[var(--text-muted)]">${p.location}</td>
             <td class="py-3"><span class="status-badge bg-green-500/10 text-green-500 px-2 py-1 rounded-full text-[10px]">${p.status}</span></td>
             <td class="py-3 text-right">
               <button onclick="editProject(${p.id})" class="text-blue-500 hover:text-blue-400 mr-2"><i class="fas fa-edit"></i></button>
               <button onclick="deleteProject(${p.id})" class="text-red-500 hover:text-red-400"><i class="fas fa-trash"></i></button>
             </td>
           </tr>
         `).join('');
         
         const unitProjectSelect = document.getElementById('unitProject');
         if(unitProjectSelect) {
             unitProjectSelect.innerHTML = projects.map(p => `<option value="${p.name}">${p.name}</option>`).join('');
         }
       }

       function renderUnits() {
         const tbody = document.getElementById('units-table-body');
         if(!tbody) return;
         tbody.innerHTML = units.map(u => `
           <tr class="hover:bg-[var(--pill-bg)] transition border-b border-[var(--nav-border)]">
             <td class="py-3 font-medium">${u.type}</td>
             <td class="py-3 text-[var(--text-muted)]">${u.project}</td>
             <td class="py-3 font-bold">$${u.price.toLocaleString()}</td>
             <td class="py-3 text-right">
               <button onclick="editUnit(${u.id})" class="text-blue-500 hover:text-blue-400 mr-2"><i class="fas fa-edit"></i></button>
               <button onclick="deleteUnit(${u.id})" class="text-red-500 hover:text-red-400"><i class="fas fa-trash"></i></button>
             </td>
           </tr>
         `).join('');
       }

       function renderAccounts() {
         const tbody = document.getElementById('accounts-table-body');
         if(!tbody) return;
         tbody.innerHTML = accounts.map(a => `
           <tr class="hover:bg-[var(--pill-bg)] transition border-b border-[var(--nav-border)]">
             <td class="py-3 font-medium">${a.name}</td>
             <td class="py-3 text-[var(--text-muted)]">${a.email}</td>
             <td class="py-3">
                <span class="px-2 py-1 bg-[var(--nav-border)] text-[var(--text-color)] rounded-full text-[10px]">${a.role}</span>
             </td>
             <td class="py-3">${a.canEdit ? '<i class="fas fa-check text-green-500"></i>' : '<i class="fas fa-times text-red-500"></i>'}</td>
             <td class="py-3 text-right">
               <button onclick="editAccount(${a.id})" class="text-blue-500 hover:text-blue-400 mr-2"><i class="fas fa-edit"></i></button>
               <button onclick="deleteAccount(${a.id})" class="text-red-500 hover:text-red-400"><i class="fas fa-trash"></i></button>
             </td>
           </tr>
         `).join('');
       }

       function renderClients() {
         const tbody = document.getElementById('clients-table-body');
         if(!tbody) return;
         tbody.innerHTML = clients.map(c => `
           <tr class="hover:bg-[var(--pill-bg)] transition border-b border-[var(--nav-border)]">
             <td class="py-3 font-medium">${c.name}</td>
             <td class="py-3 text-[var(--text-muted)]">${c.email}</td>
             <td class="py-3 text-xs">${c.projects}</td>
             <td class="py-3 text-right">
               <button onclick="editClient(${c.id})" class="text-blue-500 hover:text-blue-400 mr-2"><i class="fas fa-edit"></i></button>
               <button onclick="deleteClient(${c.id})" class="text-red-500 hover:text-red-400"><i class="fas fa-trash"></i></button>
             </td>
           </tr>
         `).join('');
       }

       // CRUD Actions
       window.saveProject = function(e) {
         e.preventDefault();
         const id = document.getElementById('projectId').value;
         const obj = {
           id: id ? parseInt(id) : Date.now(),
           name: document.getElementById('projectName').value,
           location: document.getElementById('projectLocation').value,
           status: document.getElementById('projectStatus').value
         };
         if(id) {
           const index = projects.findIndex(p => p.id === obj.id);
           if(index !== -1) projects[index] = obj;
         } else {
           projects.push(obj);
         }
         renderProjects();
         closeModal('projectModal');
       }
       window.editProject = function(id) {
         const obj = projects.find(p => p.id === id);
         if(!obj) return;
         document.getElementById('projectId').value = obj.id;
         document.getElementById('projectName').value = obj.name;
         document.getElementById('projectLocation').value = obj.location;
         document.getElementById('projectStatus').value = obj.status;
         document.getElementById('projectModalTitle').innerText = 'Edit Project';
         openModal('projectModal');
       }
       window.deleteProject = function(id) {
         if(confirm('Are you sure you want to remove this project?')) {
           projects = projects.filter(p => p.id !== id);
           renderProjects();
         }
       }

       window.saveUnit = function(e) {
         e.preventDefault();
         const id = document.getElementById('unitId').value;
         const obj = {
           id: id ? parseInt(id) : Date.now(),
           type: document.getElementById('unitType').value,
           project: document.getElementById('unitProject').value,
           price: parseFloat(document.getElementById('unitPrice').value)
         };
         if(id) {
           const index = units.findIndex(u => u.id === obj.id);
           if(index !== -1) units[index] = obj;
         } else {
           units.push(obj);
         }
         renderUnits();
         closeModal('unitModal');
       }
       window.editUnit = function(id) {
         const obj = units.find(u => u.id === id);
         if(!obj) return;
         document.getElementById('unitId').value = obj.id;
         document.getElementById('unitType').value = obj.type;
         document.getElementById('unitProject').value = obj.project;
         document.getElementById('unitPrice').value = obj.price;
         document.getElementById('unitModalTitle').innerText = 'Edit Unit';
         openModal('unitModal');
       }
       window.deleteUnit = function(id) {
         if(confirm('Are you sure you want to remove this unit?')) {
           units = units.filter(u => u.id !== id);
           renderUnits();
         }
       }

       window.saveAccount = function(e) {
         e.preventDefault();
         const id = document.getElementById('accountId').value;
         const obj = {
           id: id ? parseInt(id) : Date.now(),
           name: document.getElementById('accountName').value,
           email: document.getElementById('accountEmail').value,
           role: document.getElementById('accountRole').value,
           canEdit: document.getElementById('accountCanEdit').checked
         };
         if(id) {
           const index = accounts.findIndex(a => a.id === obj.id);
           if(index !== -1) accounts[index] = obj;
         } else {
           accounts.push(obj);
         }
         renderAccounts();
         closeModal('accountModal');
       }
       window.editAccount = function(id) {
         const obj = accounts.find(a => a.id === id);
         if(!obj) return;
         document.getElementById('accountId').value = obj.id;
         document.getElementById('accountName').value = obj.name;
         document.getElementById('accountEmail').value = obj.email;
         document.getElementById('accountRole').value = obj.role;
         document.getElementById('accountCanEdit').checked = obj.canEdit;
         document.getElementById('accountModalTitle').innerText = 'Edit Account';
         openModal('accountModal');
       }
       window.deleteAccount = function(id) {
         if(confirm('Are you sure you want to remove this account?')) {
           accounts = accounts.filter(a => a.id !== id);
           renderAccounts();
         }
       }

       window.saveClient = function(e) {
         e.preventDefault();
         const id = document.getElementById('clientId').value;
         const obj = {
           id: id ? parseInt(id) : Date.now(),
           name: document.getElementById('clientName').value,
           email: document.getElementById('clientEmail').value,
           projects: document.getElementById('clientProjects').value
         };
         if(id) {
           const index = clients.findIndex(c => c.id === obj.id);
           if(index !== -1) clients[index] = obj;
         } else {
           clients.push(obj);
         }
         renderClients();
         closeModal('clientModal');
       }
       window.editClient = function(id) {
         const obj = clients.find(c => c.id === id);
         if(!obj) return;
         document.getElementById('clientId').value = obj.id;
         document.getElementById('clientName').value = obj.name;
         document.getElementById('clientEmail').value = obj.email;
         document.getElementById('clientProjects').value = obj.projects;
         document.getElementById('clientModalTitle').innerText = 'Edit Client';
         openModal('clientModal');
       }
       window.deleteClient = function(id) {
         if(confirm('Are you sure you want to remove this client?')) {
           clients = clients.filter(c => c.id !== id);
           renderClients();
         }
       }

       // Initialization
       document.addEventListener('DOMContentLoaded', () => {
         renderProjects();
         renderUnits();
         renderAccounts();
         renderClients();
         
         // Fix CSS to prevent hidden items displaying incorrectly
         const style = document.createElement('style');
         style.innerHTML = `
           .tab-content { display: none; }
           .tab-content.flex { display: flex; }
         `;
         document.head.appendChild(style);
       });
    </script>
'''

    content = content.replace('    <!-- Scripts -->', modals_and_scripts + '\n    <!-- Scripts -->')

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print("Dashboard updated successfully.")

except Exception as e:
    print(f"Error: {str(e)}")
