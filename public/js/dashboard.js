// const token = localStorage.getItem('token');

// if (!token) {
//   alert('You are not logged in');
//   window.location.href = 'index.html';
// }

// fetch('/api/auth/profile', {
//   headers: { Authorization: `Bearer ${token}` }
// })
//   .then(res => {
//     if (![200, 304].includes(res.status)) throw new Error('Unauthorized');
//     return res.json();
//   })
//   .then(data => {
//     console.log(data)
//     // document.getElementById('user-info').innerText = `Welcome, ${data.user.username} (${data.user.role})`;
//   })
//   .catch((err) => {
//     console.log(err)
//     alert('Unauthorized access. Redirecting...');
//     localStorage.removeItem('token');
//     window.location.href = 'index.html';
//   });

// document.getElementById('logoutBtn').addEventListener('click', () => {
//   localStorage.removeItem('token');
//   window.location.href = 'index.html';
// });


// document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
//   e.preventDefault(); // prevent default link behavior
//   localStorage.removeItem('token'); // clear JWT
//   window.location.href = 'index.html'; // redirect to login
// });

const token = localStorage.getItem('token');

if (!token) {
  alert('You are not logged in');
  window.location.href = 'index.html';
}

// Fetch and display dashboard data
async function loadDashboardData() {
  try {
    const headers = { Authorization: `Bearer ${token}` };

    const [sentRes, receivedRes, userRes] = await Promise.all([
      fetch('/api/sent-files', { headers }),
      fetch('/api/received-files', { headers }),
      fetch('/api/users', { headers }), // optional: only if admin
    ]);

    if (!sentRes.ok || !receivedRes.ok) throw new Error('Failed to load files');

    const [sentData, receivedData, userData] = await Promise.all([
      sentRes.json(),
      receivedRes.json(),
      userRes.ok ? userRes.json() : { users: [] } // fallback if not admin
    ]);

    const sentFiles = sentData.files || [];
    const receivedFiles = receivedData.files || [];
    const users = userData.users || [];

    // Update cards
    document.querySelector('.text-blue-500 ~ div p').innerText = sentFiles.length + receivedFiles.length; // Total Files
    document.querySelector('.text-green-500 ~ div p').innerText = receivedFiles.length; // Received
    document.querySelector('.text-yellow-500 ~ div p').innerText = sentFiles.length; // Sent
    document.querySelector('.text-purple-500 ~ div p').innerText = users.length; // Users

    // Populate recent files (last 5 received + sent)
    const allFiles = [
      ...receivedFiles.map(f => ({ ...f, type: 'Received' })),
      ...sentFiles.map(f => ({ ...f, type: 'Sent' }))
    ];

    const recent = allFiles
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    const tableBody = document.getElementById('fileTable');
    tableBody.innerHTML = '';

    recent.forEach(file => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="px-4 py-2">${file.file_number || '—'}</td>
        <td class="px-4 py-2">${file.file_subject || 'Untitled'}</td>
        <td class="px-4 py-2">${file.sent_to || file.received_from || '-'}</td>
        <td class="px-4 py-2">${file.sent_on || file.received_on || '-'}</td>
        <td class="px-4 py-2 font-medium ${file.type === 'Sent' ? 'text-yellow-600' : 'text-green-600'}">${file.type}</td>
      `;
      tableBody.appendChild(row);
    });

  } catch (err) {
    console.error('Dashboard load error:', err);
    alert('Failed to load dashboard data. Try again.');
  }
}

loadDashboardData();

// Logout button listener (already present but included here for clarity)
document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
  e.preventDefault();
  localStorage.removeItem('token');
  window.location.href = 'index.html';
});
