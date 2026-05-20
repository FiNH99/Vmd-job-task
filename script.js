const API_URL = 'https://script.google.com/macros/s/AKfycbygUuJmXcVU6ahLeBcSX-ZFoytE1pneaxZ2NJKH6mBQKCKgkc9uOaC1D8n1iyf5FwTR/exec';

function saveToken(token){
  localStorage.setItem('ADMIN_TOKEN', token);
}

function getToken(){
  return localStorage.getItem('ADMIN_TOKEN');
}

function logout(){
  localStorage.removeItem('ADMIN_TOKEN');
  window.location.href = 'monitoring.html';
}

async function api(action, data = {}) {

  const formData = new URLSearchParams();

  formData.append('action', action);
  formData.append('token', getToken() || '');

  Object.keys(data).forEach(key => {

    if(data[key] !== undefined && data[key] !== null){
      formData.append(key, data[key]);
    }

  });

  const res = await fetch(API_URL, {
    method: 'POST',
    body: formData
  });

  return await res.json();
}

function statusBadge(status){

  if(status === 'On Progress'){
    return `<span class="badge progress">${status}</span>`;
  }

  if(status === 'Pending'){
    return `<span class="badge pending">${status}</span>`;
  }

  if(status === 'Done'){
    return `<span class="badge done">${status}</span>`;
  }

  return status;
}

function fileToBase64(file){

  return new Promise((resolve,reject)=>{

    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);

    reader.onerror = reject;

    reader.readAsDataURL(file);

  });

}
