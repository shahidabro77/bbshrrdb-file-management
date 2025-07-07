// Load Header
fetch('header.html')
    .then(res => res.text())
    .then(data => {
        document.getElementById('header-container').innerHTML = data;

        // After loading header, re-bind any header-specific JS (like dropdown toggle)
        const userBtn = document.getElementById('user-dropdown-btn');
        const userMenu = document.getElementById('user-dropdown-menu');

        userBtn.addEventListener('click', () => {
            userMenu.classList.toggle('hidden');
        });

        document.addEventListener('click', (e) => {
            if (!userBtn.contains(e.target) && !userMenu.contains(e.target)) {
                userMenu.classList.add('hidden');
            }
        });

        // Call this after loading the header
        function adjustLayoutForFixedHeader() {
            const fixedPadding = '60px';
            const sidebar = document.querySelector('aside');
            const mainContentContainer = document.querySelector('.flex-1');
            const main = document.querySelector('main');

            if (sidebar) sidebar.style.paddingTop = fixedPadding;
            if (mainContentContainer) mainContentContainer.style.paddingTop = fixedPadding;

            if (window.innerWidth < 768) {
                main?.classList.remove('ml-64');
                main?.classList.add('ml-0');
            } else {
                main?.classList.add('ml-64');
                main?.classList.remove('ml-0');
            }
        }

        // Initial layout adjustment and on resize
        adjustLayoutForFixedHeader();
        window.addEventListener('resize', adjustLayoutForFixedHeader);

        document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
            e.preventDefault(); // prevent default link behavior
            localStorage.removeItem('token'); // clear JWT
            window.location.href = 'index.html'; // redirect to login
        });

    });