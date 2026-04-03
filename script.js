// 🔑 CONNECT TO SUPABASE
const SUPABASE_URL = "https://grhpgvqtgbaevzuyeidu.supabase.co";
const SUPABASE_KEY = "sb_secret_69f-SSYKMg1YGRvzik7jmw_0Ltzp55g";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let currentUser = null;

// 🔐 CHECK USER SESSION ON LOAD
async function checkUser() {
  const { data } = await supabaseClient.auth.getUser();
  currentUser = data.user;

  if (currentUser) {
    renderApps();
  }
}
checkUser();


// 📄 SHOW PAGE
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
  document.getElementById(id).style.display = 'block';
  window.location.hash = id;
}


// INIT PAGE
showPage(window.location.hash ? window.location.hash.substring(1) : 'home');


// 🔐 SIGN UP
async function signUp() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const { error } = await supabaseClient.auth.signUp({ email, password });

  if (error) alert(error.message);
  else alert("Check your email!");
}


// 🔐 LOGIN
async function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });

  if (error) alert(error.message);
  else {
    currentUser = data.user;
    alert("Logged in!");
    renderApps();
  }
}


// 🔐 LOGOUT
async function logout() {
  await supabaseClient.auth.signOut();
  currentUser = null;
  document.getElementById('appsList').innerHTML = "";
  alert("Logged out!");
}


// 🚀 CREATE APP (USER-SPECIFIC)
async function createApp() {
  if (!currentUser) return alert("⚠️ Login first!");

  const nameEl = document.getElementById('appName');
  const name = nameEl.value.trim();

  if (!name) return alert("Enter app name!");

  const { error } = await supabaseClient
    .from('apps')
    .insert([{
      name,
      user_id: currentUser.id
    }]);

  if (error) {
    alert("Error saving app");
    console.error(error);
  } else {
    nameEl.value = '';
    renderApps();
  }
}


// 📦 LOAD ONLY USER APPS
async function renderApps() {
  if (!currentUser) return;

  const list = document.getElementById('appsList');
  list.innerHTML = "Loading...";

  const { data, error } = await supabaseClient
    .from('apps')
    .select('*')
    .eq('user_id', currentUser.id)
    .order('id', { ascending: false });

  if (error) {
    list.innerHTML = "Error loading";
    console.error(error);
    return;
  }

  list.innerHTML = '';

  if (data.length === 0) {
    list.innerHTML = "<p>No apps yet</p>";
    return;
  }

  data.forEach(app => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${app.name}
      <button onclick="editApp(${app.id}, '${app.name}')">✏️</button>
      <button onclick="deleteApp(${app.id})">🗑️</button>
    `;
    list.appendChild(li);
  });
}


// 🗑️ DELETE
async function deleteApp(id) {
  const { error } = await supabaseClient
    .from('apps')
    .delete()
    .eq('id', id);

  if (error) console.error(error);
  else renderApps();
}


// ✏️ EDIT
async function editApp(id, oldName) {
  const newName = prompt("Edit app name:", oldName);
  if (!newName) return;

  const { error } = await supabaseClient
    .from('apps')
    .update({ name: newName.trim() })
    .eq('id', id);

  if (error) console.error(error);
  else renderApps();
}


// 🌙 DARK MODE
function toggleDarkMode() {
  document.body.classList.toggle('dark');
}
