const API_URL = 'http://localhost:5000';

// DOM elements
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const profileContainer = document.getElementById('profile-container');
const formsContainer = document.getElementById('forms-container');
const messagesDiv = document.getElementById('messages');
const logoutButton = document.getElementById('logout-button');
const welcomeMessage = document.getElementById('welcome-message');

// Show messages (success or error)
function showMessage(type, message) {
  messagesDiv.innerHTML = `<div class="${type}-message">${message}</div>`;
  setTimeout(() => messagesDiv.innerHTML = '', 3000);
}

// Save JWT token
function saveToken(token) {
  localStorage.setItem('token', token);
}

// Get JWT token
function getToken() {
  return localStorage.getItem('token');
}

// Remove JWT token
function removeToken() {
  localStorage.removeItem('token');
}

// Check if user is logged in
function checkLoginStatus() {
  const token = getToken();
  if (token) {
    loadProfile();
  } else {
    profileContainer.style.display = 'none';
    formsContainer.style.display = 'block';
  }
}

// Load profile from server
async function loadProfile() {
  const token = getToken();
  if (!token) return;

  const res = await fetch(`${API_URL}/profile`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (res.ok) {
    const data = await res.json();
    welcomeMessage.textContent = `Welcome, ${data.user.username}!`;
    profileContainer.style.display = 'block';
    formsContainer.style.display = 'none';
  } else {
    removeToken();
    checkLoginStatus();
  }
}

// Register Form
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('register-username').value;
  const password = document.getElementById('register-password').value;

  const res = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  if (res.ok) {
    showMessage('success', data.message);
  } else {
    showMessage('error', data.message);
  }
});

// Login Form
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  if (res.ok) {
    saveToken(data.token);
    showMessage('success', 'Login successful!');
    loadProfile();
  } else {
    showMessage('error', data.message);
  }
});

// Logout
logoutButton.addEventListener('click', () => {
  removeToken();
  checkLoginStatus();
});

// On page load, check if user is logged in
checkLoginStatus();
