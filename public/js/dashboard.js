const token = localStorage.getItem('token');

if (!token) {
  alert('You are not logged in');
  window.location.href = 'index.html';
}

function getUserFromToken(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    return JSON.parse(jsonPayload).user || {};
  } catch (e) {
    return {};
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Role-based filtering
  const user = getUserFromToken(token);
  document.querySelectorAll('#sidebar a[data-role]').forEach(link => {
    const allowedRoles = link.getAttribute('data-role').split(',').map(r => r.trim());
    if (!allowedRoles.includes(user.role)) {
      link.style.display = 'none';
    }
  });

  // Dashboard cards
  fetch('/api/dashboard')
    .then(res => res.json())
    .then(data => {
      document.querySelectorAll('.text-2xl.font-bold')[0].innerText = data.totalFiles;
      document.querySelectorAll('.text-2xl.font-bold')[1].innerText = data.received;
      document.querySelectorAll('.text-2xl.font-bold')[2].innerText = data.sent;
      document.querySelectorAll('.text-2xl.font-bold')[3].innerText = data.users;
    });

  // Recent files table
  fetch('/api/dashboard/files')
    .then(res => res.json())
    .then(files => {
      const tbody = document.getElementById('fileTable');
      tbody.innerHTML = '';
      files.forEach(file => {
        const row = `
          <tr>
            <td class="px-4 py-2">${file.file_number}</td>
            <td class="px-4 py-2">${file.file_subject}</td>
            <td class="px-4 py-2">${file.received_from}</td>
            <td class="px-4 py-2">${file.received_on}</td>
            <td class="px-4 py-2 text-blue-600 font-medium">${file.remarks || 'Unknown'}</td>
          </tr>`;
        tbody.insertAdjacentHTML('beforeend', row);
      });
    });

  // Charts
  fetch('/api/dashboard/charts')
    .then(res => res.json())
    .then(data => {
      const pieCtx = document.getElementById('filePieChart').getContext('2d');
      new Chart(pieCtx, {
        type: 'pie',
        data: {
          labels: Object.keys(data.pie),
          datasets: [{
            data: Object.values(data.pie),
            backgroundColor: ['#4CAF50', '#FFC107', '#2196F3', '#F44336', '#9C27B0']
          }]
        }
      });

      const barCtx = document.getElementById('fileBarChart').getContext('2d');
      new Chart(barCtx, {
        type: 'bar',
        data: {
          labels: Object.keys(data.bar),
          datasets: [{
            label: 'Files by Section',
            data: Object.values(data.bar),
            backgroundColor: '#3B82F6'
          }]
        }
      });
    });
});

// Logout
document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
  e.preventDefault();
  localStorage.removeItem('token');
  window.location.href = 'index.html';
});
