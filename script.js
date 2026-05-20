const API_URL = 'https://script.google.com/macros/s/AKfycbygUuJmXcVU6ahLeBcSX-ZFoytE1pneaxZ2NJKH6mBQKCKgkc9uOaC1D8n1iyf5FwTR/exec';

function saveToken(token) {
  localStorage.setItem('ADMIN_TOKEN', token);
}

function getToken() {
  return localStorage.getItem('ADMIN_TOKEN') || '';
}

function logout() {
  localStorage.removeItem('ADMIN_TOKEN');
  window.location.href = 'monitoring.html';
}

async function api(action, data = {}) {
  const formData = new URLSearchParams();

  formData.append('action', action);
  formData.append('token', getToken());

  Object.keys(data).forEach(key => {
    if (data[key] !== undefined && data[key] !== null) {
      formData.append(key, data[key]);
    }
  });

  const res = await fetch(API_URL, {
    method: 'POST',
    body: formData
  });

  return await res.json();
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function statusBadge(status) {
  const safe = escapeHtml(status);

  if (status === 'On Progress') {
    return `<span class="badge badge-progress">${safe}</span>`;
  }

  if (status === 'Pending') {
    return `<span class="badge badge-pending">${safe}</span>`;
  }

  if (status === 'Done') {
    return `<span class="badge badge-done">${safe}</span>`;
  }

  return `<span class="badge">${safe}</span>`;
}

function priorityBadge(priority) {
  const safe = escapeHtml(priority);

  if (priority === 'Urgent') {
    return `<span class="badge badge-urgent">${safe}</span>`;
  }

  if (priority === 'Low') {
    return `<span class="badge badge-low">${safe}</span>`;
  }

  return `<span class="badge badge-normal">${safe}</span>`;
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve('');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function showLoading(button, text = 'Memproses...') {
  if (!button) return;

  button.dataset.oldText = button.textContent;
  button.disabled = true;
  button.textContent = text;
}

function hideLoading(button) {
  if (!button) return;

  button.disabled = false;
  button.textContent = button.dataset.oldText || 'Submit';
}
