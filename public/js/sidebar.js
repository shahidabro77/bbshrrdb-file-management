async function loadSidebar() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    const res = await fetch('/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
        return;
    }

    const { user } = await res.json();
    const role = user.role;

    const coreLinks = [
        { href: "dashboard.html", icon: "fas fa-tachometer-alt", label: "Dashboard" },
        { href: "received_file.html", icon: "fas fa-inbox", label: "Received File" },
        { href: "sent_file.html", icon: "fas fa-paper-plane", label: "Sent File" },
        { href: "search_file.html", icon: "fas fa-search", label: "Search File" },
        { href: "qr_code.html", icon: "fas fa-qrcode", label: "QR Code" }
    ];

    const adminLinks = [
        { href: "activate_deactivate.html", icon: "fas fa-user-plus", label: "Activate User" },
        { href: "add_new_section.html", icon: "fas fa-plus-circle", label: "Add New Section" }
    ];

    const sectionLinks = [
        { href: "files_tracking.html", icon: "fas fa-folder-open", label: "Files Tracking" },
        { href: "secretary_office.html", icon: "fas fa-briefcase", label: "Secretary Office" },
        { href: "admin_section.html", icon: "fas fa-user-shield", label: "Admin Section" },
        { href: "accounts_section.html", icon: "fas fa-file-invoice-dollar", label: "Accounts Section" },
        { href: "training_section.html", icon: "fas fa-chalkboard-teacher", label: "Training Section" },
        { href: "private_sector.html", icon: "fas fa-building", label: "Private Sector" },
        { href: "public_sector.html", icon: "fas fa-city", label: "Public Sector" }
    ];

    let html = `<aside id="sidebar" class="w-64 bg-gradient-to-b from-blue-900 to-blue-700 text-white p-4 fixed top-[72px] bottom-0 left-0 overflow-y-auto z-40">`;

    html += `<h3 class="text-xs font-semibold uppercase text-blue-200 mb-1">Core</h3>`;
    html += coreLinks.map(link => `<a href="${link.href}" class="nav-link flex items-center gap-2 px-4 py-2 rounded hover:bg-blue-600">
    <i class="${link.icon} w-4"></i> ${link.label}
  </a>`).join("");

    if (role === 'admin') {
        html += `<h3 class="text-xs font-semibold uppercase text-blue-200 mt-4 mb-1">Administration</h3>`;
        html += adminLinks.map(link => `<a href="${link.href}" class="nav-link flex items-center gap-2 px-4 py-2 rounded hover:bg-blue-600">
      <i class="${link.icon} w-4"></i> ${link.label}
    </a>`).join("");
    }

    if (role === 'admin' || role === 'section_officer') {
        html += `<h3 class="text-xs font-semibold uppercase text-blue-200 mt-4 mb-1">Sections</h3>`;
        html += sectionLinks.map(link => `<a href="${link.href}" class="nav-link flex items-center gap-2 px-4 py-2 rounded hover:bg-blue-600">
      <i class="${link.icon} w-4"></i> ${link.label}
    </a>`).join("");
    }

    html += `</aside>`;

    document.getElementById('sidebar-container').innerHTML = html;

    // highlight active link
    const current = window.location.pathname.split('/').pop();
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === current) {
            link.classList.add('bg-blue-600', 'font-bold');
        }
    });
}
loadSidebar();