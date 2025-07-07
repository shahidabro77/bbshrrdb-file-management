const token = localStorage.getItem('token');

if (!token) {
  alert('You are not logged in');
  window.location.href = 'index.html';
}

fetch('/api/auth/profile', {
  headers: { Authorization: `Bearer ${token}` }
})
  .then(res => {
    if (![200, 304].includes(res.status)) throw new Error('Unauthorized');
    return res.json();
  })
  .then(data => {
    console.log(data)
    // document.getElementById('user-info').innerText = `Welcome, ${data.user.username} (${data.user.role})`;
  })
  .catch((err) => {
    console.log(err)
    alert('Unauthorized access. Redirecting...');
    localStorage.removeItem('token');
    window.location.href = 'index.html';
  });

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = 'index.html';
});


document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
  e.preventDefault(); // prevent default link behavior
  localStorage.removeItem('token'); // clear JWT
  window.location.href = 'index.html'; // redirect to login
});