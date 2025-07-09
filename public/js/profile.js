const API_URL = '/api/users';

document.addEventListener('DOMContentLoaded', async () => {
  const form = document.querySelector('form');
  const nameInput = form.querySelector('input[type="text"]');
  const emailInput = form.querySelector('input[type="email"]');
  const passwordInput = form.querySelector('input[type="password"]');
  const confirmPasswordInput = form.querySelectorAll('input[type="password"]')[1];
  const fileInput = form.querySelector('input[type="file"]');
  const roleInput = form.querySelector('input[disabled]');

  const token = localStorage.getItem('token');
  if (!token) return window.location.href = '/index.html';

  // ✅ Fetch current user settings
  try {
    const res = await fetch(`${API_URL}/settings`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const user = await res.json();

    if (res.ok) {
      nameInput.value = user.full_name || '';
      emailInput.value = user.email || '';
      roleInput.value = user.role || 'User';
    } else {
      alert(user.error || 'Failed to load profile');
    }
  } catch (err) {
    console.error(err);
    alert('Error loading profile');
  }

  // ✅ Handle form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const full_name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const photoFile = fileInput.files[0];

    if (password && password !== confirmPassword) {
      return alert('Passwords do not match');
    }

    const formData = new FormData();
    formData.append('full_name', full_name);
    formData.append('email', email);
    if (password) formData.append('password', password);
    if (photoFile) formData.append('photo', photoFile);

    try {
      const res = await fetch(`${API_URL}/settings`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        alert('Profile updated successfully!');
        location.reload();
      } else {
        alert(data.error || 'Update failed');
      }

    } catch (err) {
      console.error(err);
      alert('Error updating profile');
    }
  });
});
