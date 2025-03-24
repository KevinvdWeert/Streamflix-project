document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle.querySelector('i');
    
    const currentTheme = localStorage.getItem('streamflixTheme') || 'dark';
    document.body.classList.add(`bg-${currentTheme}`);
    
    if (currentTheme === 'dark') {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
    } else {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
    }
    
    themeToggle.addEventListener('click', function() {
        if (document.body.classList.contains('bg-dark')) {
            document.body.classList.remove('bg-dark');
            document.body.classList.add('bg-light');
            localStorage.setItem('streamflixTheme', 'light');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
        } else {
            document.body.classList.remove('bg-light');
            document.body.classList.add('bg-dark');
            localStorage.setItem('streamflixTheme', 'dark');
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
        }
    });
});