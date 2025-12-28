// JavaScript for the contact page
document.addEventListener('DOMContentLoaded', function() {
    initializeContactPage();
});

function initializeContactPage() {
    setupContactForm();
    updateCartCount();
}

function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactSubmission();
        });
    }
}

function handleContactSubmission() {
    const formData = collectContactFormData();
    
    if (!validateContactForm(formData)) {
        return;
    }

    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';
    submitBtn.disabled = true;

    // Simulate form submission
    setTimeout(() => {
        // In a real app, this would send to a server
        console.log('Contact form submitted:', formData);
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show success message
        DOMUtils.showToast('Thank you for your message! We\'ll get back to you soon.', 'success');
        
        // Reset form
        document.getElementById('contactForm').reset();
        
    }, 2000);
}

function collectContactFormData() {
    return {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: document.getElementById('email').value.trim(),
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value.trim(),
        timestamp: new Date().toISOString()
    };
}

function validateContactForm(data) {
    // Required fields validation
    if (!data.firstName) {
        DOMUtils.showToast('First name is required', 'error');
        document.getElementById('firstName').focus();
        return false;
    }

    if (!data.lastName) {
        DOMUtils.showToast('Last name is required', 'error');
        document.getElementById('lastName').focus();
        return false;
    }

    if (!data.email) {
        DOMUtils.showToast('Email address is required', 'error');
        document.getElementById('email').focus();
        return false;
    }

    if (!isValidEmail(data.email)) {
        DOMUtils.showToast('Please enter a valid email address', 'error');
        document.getElementById('email').focus();
        return false;
    }

    if (!data.subject) {
        DOMUtils.showToast('Please select a subject', 'error');
        document.getElementById('subject').focus();
        return false;
    }

    if (!data.message) {
        DOMUtils.showToast('Message is required', 'error');
        document.getElementById('message').focus();
        return false;
    }

    if (data.message.length < 10) {
        DOMUtils.showToast('Message must be at least 10 characters long', 'error');
        document.getElementById('message').focus();
        return false;
    }

    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function updateCartCount() {
    FavoritesManager.updateCartCount();
}