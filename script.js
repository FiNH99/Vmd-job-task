const API_URL = 'https://script.google.com/macros/s/AKfycbygUuJmXcVU6ahLeBcSX-ZFoytE1pneaxZ2NJKH6mBQKCKgkc9uOaC1D8n1iyf5FwTR/exec';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

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

  let res;

  try {
    res = await fetch(API_URL, {
      method: 'POST',
      body: formData
    });
  } catch (err) {
    throw new Error('Tidak bisa terhubung ke server.');
  }

  if (!res.ok) {
    throw new Error('Server error: ' + res.status);
  }

  try {
    return await res.json();
  } catch (err) {
    throw new Error('Response server tidak valid.');
  }
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function validateImageFile(file) {
  if (!file) return true;

  if (!file.type.startsWith('image/')) {
    alert('File harus berupa gambar.');
    return false;
  }

  if (file.size > MAX_FILE_SIZE) {
    alert('Ukuran file maksimal 5 MB.');
    return false;
  }

  return true;
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve('');
      return;
    }

    if (!validateImageFile(file)) {
      reject(new Error('File tidak valid.'));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Gagal membaca file.'));
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

setInterval(function() {
  if (!getToken()) {
    alert('Sesi login habis. Silakan login ulang.');
    logout();
  }
}, 10000);
