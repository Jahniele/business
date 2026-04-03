const SUPABASE_URL = "YOUR_URL_HERE";
const SUPABASE_KEY = "YOUR_KEY_HERE";

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Load apps from localStorage
let apps = JSON.parse(localStorage.getItem('apps') || '[]');

// Show a specific page
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
  document.getElementById(id).style.display = 'block';
  window.location.hash = id;
  renderApps();
}

// Initialize page based on URL hash
showPage(window.location.hash ? window.location.hash.substring(1) : 'home');

// Create a new app
function createApp() {
  const nameEl = document.getElementById('appName');
  const categoryEl = document.getElementById('appCategory');

  const name = nameEl.value.trim();
  const category = categoryEl.value.trim() || "General";

  if (!name) return alert("⚠️ Please enter an app name!");

  // Prevent duplicate app names
  if (apps.some(a => a.name.toLowerCase() === name.toLowerCase())) {
    return alert(`⚠️ App "${name}" already exists!`);
  }

  const app = { name, category, id: Date.now() };
  apps.push(app);
  localStorage.setItem('apps', JSON.stringify(apps));

  // Clear inputs
  nameEl.value = '';
  categoryEl.value = '';

  renderApps();
  alert(`🎉 App "${name}" created!`);
}

// Render apps list
function renderApps(filterCategory = '') {
  const list = document.getElementById('appsList');
  const search = document.getElementById('searchInput').value.toLowerCase();
  list.innerHTML = '';

  const filteredApps = apps.filter(app => 
    (app.name.toLowerCase().includes(search) || app.category.toLowerCase().includes(search)) &&
    (filterCategory ? app.category === filterCategory : true)
  );

  if(filteredApps.length === 0){
    list.innerHTML = `<p>No apps found.</p>`;
    return;
  }

  filteredApps.forEach(app => {
    const div = document.createElement('div');
    div.className = 'app-card';
    div.innerHTML = `
      <strong>${app.name}</strong> [${app.category}]
      <div>
        <button onclick="editApp(${app.id})">✏️ Edit</button>
        <button onclick="deleteApp(${app.id})">🗑️ Delete</button>
      </div>
    `;
    list.appendChild(div);
  });

  // Update app count
  const countEl = document.getElementById('appCount');
  if(countEl) countEl.textContent = `Total Apps: ${filteredApps.length}`;
}

// Delete an app
function deleteApp(id) {
  if(confirm("Are you sure you want to delete this app? 🗑️")) {
    apps = apps.filter(a => a.id !== id);
    localStorage.setItem('apps', JSON.stringify(apps));
    renderApps();
  }
}

// Edit an app
function editApp(id) {
  const app = apps.find(a => a.id === id);
  const newName = prompt("Edit app name:", app.name);
  if(newName) {
    app.name = newName.trim();
    localStorage.setItem('apps', JSON.stringify(apps));
    renderApps();
  }
}

// Filter apps on search
function filterApps() {
  renderApps();
}

// Filter by category buttons (optional)
function filterByCategory(category) {
  renderApps(category);
}

// Dark mode toggle
function toggleDarkMode() {
  document.body.classList.toggle('dark');
}

// Initial render
renderApps();
