// JavaScript for the login page
document.addEventListener('DOMContentLoaded', function() {
    initializeLoginPage();
});

function initializeLoginPage() {
    setupLoginForm();
    setupSocialLogin();
}

function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
}

function setupSocialLogin() {
    // Google login button
    const googleBtn = document.querySelector('.btn-outline-danger');
    if (googleBtn) {
        googleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleSocialLogin('google');
        });
    }

    // Facebook login button
    const facebookBtn = document.querySelector('.btn-outline-primary');
    if (facebookBtn) {
        facebookBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleSocialLogin('facebook');
        });
    }
}

function handleLogin() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    // Basic validation
    if (!email || !password) {
        showLoginError('Please fill in all fields');
        return;
    }

    if (!isValidEmail(email)) {
        showLoginError('Please enter a valid email address');
        return;
    }

    // Show loading state
    const submitBtn = document.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Signing In...';
    submitBtn.disabled = true;

    // Simulate login process
    setTimeout(() => {
        // Check demo credentials
        if (email === 'demo@example.com' && password === 'demo123') {
            handleSuccessfulLogin(email, rememberMe);
        } else {
            // In a real app, this would make an API call
            // For demo purposes, accept any valid email/password combination
            if (password.length >= 6) {
                handleSuccessfulLogin(email, rememberMe);
            } else {
                showLoginError('Password must be at least 6 characters long');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        }
    }, 1500);
}

function handleSocialLogin(provider) {
    // Show loading state
    const button = event.target.closest('button');
    const originalText = button.innerHTML;
    button.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Connecting...`;
    button.disabled = true;

    // Simulate social login
    setTimeout(() => {
        // In a real app, this would integrate with OAuth providers
        const email = `user@${provider}.com`;
        handleSuccessfulLogin(email, false);
    }, 2000);
}

function handleSuccessfulLogin(email, rememberMe) {
    // Store user session
    const userData = {
        email: email,
        name: email.split('@')[0],
        loginTime: new Date().toISOString(),
        rememberMe: rememberMe
    };

    if (rememberMe) {
        StorageUtils.setItem('userSession', userData);
    } else {
        sessionStorage.setItem('userSession', JSON.stringify(userData));
    }

    // Show success message
    DOMUtils.showToast('Login successful! Redirecting...', 'success');

    // Redirect after short delay
    setTimeout(() => {
        const returnUrl = new URLSearchParams(window.location.search).get('return') || 'index.html';
        window.location.href = returnUrl;
    }, 1500);
}

function showLoginError(message) {
    // Remove any existing error messages
    const existingError = document.querySelector('.alert-danger');
    if (existingError) {
        existingError.remove();
    }

    // Create error alert
    const errorAlert = document.createElement('div');
    errorAlert.className = 'alert alert-danger alert-dismissible fade show mt-3';
    errorAlert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    // Insert after the form
    const form = document.getElementById('loginForm');
    form.parentNode.insertBefore(errorAlert, form.nextSibling);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (errorAlert.parentNode) {
            errorAlert.remove();
        }
    }, 5000);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Check if user is already logged in
function checkExistingSession() {
    const userSession = StorageUtils.getItem('userSession') || 
                       JSON.parse(sessionStorage.getItem('userSession') || 'null');
    
    if (userSession) {
        // User is already logged in, redirect to home
        window.location.href = 'index.html';
    }
}

// Run session check on page load
checkExistingSession();