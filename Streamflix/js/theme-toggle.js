document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle?.querySelector('i');
    
    // Check for saved theme preference
    const currentTheme = localStorage.getItem('streamflixTheme') || 'dark';
    document.body.classList.add(`bg-${currentTheme}`);
    
    // Update button icon
    if (icon) {
        icon.className = currentTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }
    
    // Toggle theme
    themeToggle?.addEventListener('click', function() {
        if (document.body.classList.contains('bg-dark')) {
            document.body.classList.remove('bg-dark');
            document.body.classList.add('bg-light');
            localStorage.setItem('streamflixTheme', 'light');
            if (icon) icon.className = 'fas fa-sun';
        } else {
            document.body.classList.remove('bg-light');
            document.body.classList.add('bg-dark');
            localStorage.setItem('streamflixTheme', 'dark');
            if (icon) icon.className = 'fas fa-moon';
        }
    });
});