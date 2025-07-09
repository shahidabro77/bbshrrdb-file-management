const API_URL = '/api/auth';

const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.querySelector('input[name="email"]').value;
    const password = document.querySelector('input[name="password"]').value;

    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      window.location.href = 'dashboard.html';
    } else {
      if (res.status === 403) {
        alert('Your account is inactive. Please contact the administrator.');
      } else {
        alert(data.message || 'Login failed');
      }
    }

  });
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registrationForm');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Extract fields
      const full_name = form.full_name.value.trim();
      const cnic = form.cnic.value.trim();
      const email = form.email.value.trim();
      const mobile = form.mobile.value.trim();
      const password = form.password.value;
      const confirmPassword = form.password_confirmation.value;
      const confirmation = form.confirmation.checked;

      // Reset errors
      document.querySelectorAll('[id$="-top-error"]').forEach(el => el.classList.add('hidden'));

      let hasError = false;

      // Validation (frontend only — still validate on backend too!)
      if (!/^[a-zA-Z\s]+$/.test(full_name)) {
        document.getElementById('name-top-error').classList.remove('hidden');
        hasError = true;
      }

      if (!/^4\d{4}-\d{7}-\d{1}$/.test(cnic)) {
        document.getElementById('cnic-top-error').classList.remove('hidden');
        hasError = true;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.getElementById('email-top-error').classList.remove('hidden');
        hasError = true;
      }

      if (!/^03\d{9}$/.test(mobile)) {
        document.getElementById('mobile-top-error').classList.remove('hidden');
        hasError = true;
      }

      if (password.length < 8 || password !== confirmPassword) {
        document.getElementById('password-top-error').classList.remove('hidden');
        hasError = true;
      }

      if (!confirmation) {
        document.getElementById('checkbox-top-error').classList.remove('hidden');
        hasError = true;
      }

      if (hasError) return;

      try {
        const res = await fetch('http://localhost:3000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email,         // using email as username
            password,
            role: 'user',           // default role
            full_name,
            cnic,
            mobile
          })
        });

        const data = await res.json();

        if (res.ok) {
          alert('Registration successful! Redirecting to login...');
          window.location.href = 'index.html';
        } else {
          alert(data.message || 'Registration failed');
        }
      } catch (error) {
        console.error(error);
        alert('An error occurred while registering');
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const cnicInput = document.getElementById("cnic");

  cnicInput.addEventListener("input", function () {
    let raw = this.value.replace(/\D/g, "");

    // Only allow input starting with 4
    if (raw && raw.charAt(0) !== '4') {
      raw = '4' + raw.replace(/^./, ''); // Replace first digit with 4
    }

    // Max 13 digits
    raw = raw.slice(0, 13);

    // Format: 5 digits - 7 digits - 1 digit
    let formatted = raw;
    if (raw.length > 5 && raw.length <= 12) {
      formatted = raw.slice(0, 5) + '-' + raw.slice(5);
    }
    if (raw.length > 12) {
      formatted = raw.slice(0, 5) + '-' + raw.slice(5, 12) + '-' + raw.slice(12);
    }

    this.value = formatted;
  });
});
