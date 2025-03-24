// DOM Elements
const loginForm = document.getElementById('authForm');
const signupForm = document.getElementById('signupForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const newEmailInput = document.getElementById('new-email');
const newPasswordInput = document.getElementById('new-password');
const nameInput = document.getElementById('name');
const authError = document.getElementById('auth-error');

// Check URL for action parameter
const urlParams = new URLSearchParams(window.location.search);
const action = urlParams.get('action');

// Show appropriate form based on URL
if (action === 'signup') {
    showSignupForm();
}

// Form switchers
document.getElementById('switch-to-signup')?.addEventListener('click', (e) => {
    e.preventDefault();
    showSignupForm();
});

document.getElementById('switch-to-login')?.addEventListener('click', (e) => {
    e.preventDefault();
    showLoginForm();
});

// Password strength indicator
passwordInput?.addEventListener('input', updatePasswordStrength);
newPasswordInput?.addEventListener('input', updatePasswordStrength);

// Form submissions
loginForm?.addEventListener('submit', handleLogin);
signupForm?.addEventListener('submit', handleSignup);

// Functions
function showLoginForm() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('signup-form').style.display = 'none';
    history.pushState(null, '', 'auth.html?action=login');
}

function showSignupForm() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'block';
    history.pushState(null, '', 'auth.html?action=signup');
}

function updatePasswordStrength(e) {
    const password = e.target.value;
    const strengthBar = e.target.id === 'password' ? 
        document.getElementById('password-strength') : 
        document.getElementById('signup-password-strength');
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    strengthBar.style.width = `${strength * 25}%`;
    strengthBar.className = `progress-bar ${
        strength < 2 ? 'bg-danger' : 
        strength < 4 ? 'bg-warning' : 'bg-success'
    }`;
}

async function handleLogin(e) {
    e.preventDefault();
    authError.classList.add('d-none');
    
    try {
        await firebase.auth().signInWithEmailAndPassword(
            emailInput.value, 
            passwordInput.value
        );
        window.location.href = 'home.html';
    } catch (error) {
        showError(error);
    }
}

async function handleSignup(e) {
    e.preventDefault();
    authError.classList.add('d-none');
    
    try {
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(
            newEmailInput.value, 
            newPasswordInput.value
        );
        
        await userCredential.user.updateProfile({
            displayName: nameInput.value
        });
        
        window.location.href = 'home.html';
    } catch (error) {
        showError(error);
    }
}

function showError(error) {
    const errorMap = {
        'auth/wrong-password': 'Incorrect password',
        'auth/user-not-found': 'No account with this email',
        'auth/email-already-in-use': 'Email already registered',
        'auth/weak-password': 'Password should be at least 6 characters'
    };
    
    authError.textContent = errorMap[error.code] || error.message;
    authError.classList.remove('d-none');
}