function loadLayout() {
  // Load header
  fetch('header.html')
    .then(res => res.text())
    .then(data => {
      document.getElementById('header-container').innerHTML = data;
      updateDateTime(); // You can call this here if needed
    });

  // Load sidebar and highlight active
  fetch('sidebar.html')
    .then(res => res.text())
    .then(data => {
      document.getElementById('sidebar-container').innerHTML = data;
      const current = window.location.pathname.split('/').pop();
      document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === current) {
          link.classList.add('bg-blue-600', 'font-bold');
        }
      });
    });
}

window.addEventListener('DOMContentLoaded', loadLayout);
