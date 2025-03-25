class AuthSystem {
    static STORAGE_KEY = "streamflix_users";
    
    static getUsers() {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    }
    
    static saveUsers(users) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
    }
    
    static async register(name, email, password) {
        const response = await fetch('php/register_user.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message);
        }
    }

    static async login(email, password) {
        const response = await fetch('php/check_credentials.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message);
        }

        sessionStorage.setItem("current_user", JSON.stringify(result.user));
        return true;
    }
    
    static logout() {
        sessionStorage.removeItem("current_user");
    }
    
    static getCurrentUser() {
        return JSON.parse(sessionStorage.getItem("current_user"));
    }
}

// Initialize auth forms
document.addEventListener('DOMContentLoaded', function() {
    // Signup form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            try {
                const name = document.getElementById('signupName')?.value;
                const email = document.getElementById('signupEmail')?.value;
                const password = document.getElementById('signupPassword')?.value;

                if (!name || !email || !password) {
                    alert("All fields are required.");
                    return;
                }

                await AuthSystem.register(name, email, password);
                alert("Account created successfully! Please login.");
                window.location.href = "auth.html";
            } catch (error) {
                alert(error.message);
            }
        });
    }

    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            try {
                const email = document.getElementById('loginEmail')?.value;
                const password = document.getElementById('loginPassword')?.value;

                if (!email || !password) {
                    alert("Both email and password are required.");
                    return;
                }

                await AuthSystem.login(email, password);
                window.location.href = "home.html";
            } catch (error) {
                alert(error.message);
            }
        });
    }

    // Form switchers
    const showSignup = document.getElementById('showSignup');
    const showLogin = document.getElementById('showLogin');
    if (showSignup) {
        showSignup.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('loginFormContainer').style.display = 'none';
            document.getElementById('signupFormContainer').style.display = 'block';
        });
    }
    if (showLogin) {
        showLogin.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('signupFormContainer').style.display = 'none';
            document.getElementById('loginFormContainer').style.display = 'block';
        });
    }
});