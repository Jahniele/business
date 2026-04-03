// 🔑 CONNECT TO SUPABASE
const SUPABASE_URL = "https://grhpgvqtgbaevzuyeidu.supabase.co";
const SUPABASE_KEY = "sb_secret_69f-SSYKMg1YGRvzik7jmw_0Ltzp55g";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// SHOW PAGE
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
  document.getElementById(id).style.display = 'block';
  window.location.hash = id;
  renderApps();
}

// INIT PAGE
showPage(window.location.hash ? window.location.hash.substring(1) : 'home');


// 🚀 CREATE APP (SAVE ONLINE)
async function createApp() {
  const nameEl = document.getElementById('appName');
  const categoryEl = document.getElementById('appCategory');

  const name = nameEl.value.trim();
  const category = categoryEl.value.trim() || "General";

  if (!name) return alert("⚠️ Enter app name!");

  const { error } = await supabaseClient
    .from('apps')
    .insert([{ name, category }]);

  if (error) {
    alert("❌ Error saving app");
    console.error(error);
  } else {
    alert("🎉 App saved ONLINE!");
    nameEl.value = '';
    categoryEl.value = '';
    renderApps();
  }
}


// 📦 LOAD + DISPLAY APPS FROM DATABASE
async function renderApps() {
  const list = document.getElementById('appsList');
  const search = document.getElementById('searchInput')?.value.toLowerCase() || '';

  list.innerHTML = "Loading...";

  const { data, error } = await supabaseClient
    .from('apps')
    .select('*')
    .order('id', { ascending: false });

  if (error) {
    list.innerHTML = "❌ Error loading apps";
    console.error(error);
    return;
  }

  list.innerHTML = '';

  const filtered = data.filter(app =>
    app.name.toLowerCase().includes(search) ||
    app.category.toLowerCase().includes(search)
  );

  if (filtered.length === 0) {
    list.innerHTML = "<p>No apps found.</p>";
    return;
  }

  filtered.forEach(app => {
    const div = document.createElement('div');
    div.className = 'app-card';
    div.innerHTML = `
      <strong>${app.name}</strong> [${app.category}]
      <div>
        <button onclick="editApp(${app.id}, '${app.name}')">✏️</button>
        <button onclick="deleteApp(${app.id})">🗑️</button>
      </div>
    `;
    list.appendChild(div);
  });

  const countEl = document.getElementById('appCount');
  if (countEl) countEl.textContent = `Total Apps: ${filtered.length}`;
}


// 🗑️ DELETE APP
async function deleteApp(id) {
  if (!confirm("Delete this app?")) return;

  const { error } = await supabaseClient
    .from('apps')
    .delete()
    .eq('id', id);

  if (error) {
    alert("Error deleting");
    console.error(error);
  } else {
    renderApps();
  }
}


// ✏️ EDIT APP
async function editApp(id, oldName) {
  const newName = prompt("Edit app name:", oldName);
  if (!newName) return;

  const { error } = await supabaseClient
    .from('apps')
    .update({ name: newName.trim() })
    .eq('id', id);

  if (error) {
    alert("Error updating");
    console.error(error);
  } else {
    renderApps();
  }
}


// 🔍 SEARCH
function filterApps() {
  renderApps();
}


// 🌙 DARK MODE
function toggleDarkMode() {
  document.body.classList.toggle('dark');
}


// 🔄 INITIAL LOAD
renderApps();
