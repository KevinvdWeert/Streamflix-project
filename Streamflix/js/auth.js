// Check authentication status when loading any page
document.addEventListener('DOMContentLoaded', function() {
    // For login page functionality
    if (document.getElementById('loginForm')) {
        const loginForm = document.getElementById('loginForm');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        
        function validateForm() {
            let isValid = true;
            
            if (!emailInput.value || !emailInput.value.includes('@')) {
                emailInput.classList.add('is-invalid');
                isValid = false;
            } else {
                emailInput.classList.remove('is-invalid');
            }
            
            if (!passwordInput.value || passwordInput.value.length < 6) {
                passwordInput.classList.add('is-invalid');
                isValid = false;
            } else {
                passwordInput.classList.remove('is-invalid');
            }
            
            return isValid;
        }
        
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                const userData = {
                    email: emailInput.value,
                    password: passwordInput.value,
                    remember: document.getElementById('rememberMe').checked
                };
                
                localStorage.setItem('streamflixUser', JSON.stringify(userData));
                localStorage.setItem('isAuthenticated', 'true');
                window.location.href = 'index.html';
            }
        });
        
        // Check for remembered user
        const rememberedUser = localStorage.getItem('streamflixUser');
        if (rememberedUser) {
            const user = JSON.parse(rememberedUser);
            emailInput.value = user.email;
            document.getElementById('rememberMe').checked = user.remember;
        }
    }

    // For index page authentication check
    if (!window.location.pathname.includes('login.html')) {
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        
        if (!isAuthenticated) {
            window.location.href = 'login.html';
        }
        
        // Logout functionality
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                localStorage.removeItem('isAuthenticated');
                window.location.href = 'login.html';
            });
        }
    }
});