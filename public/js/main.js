// Common JavaScript functionality for the application

// Check if user is logged in (based on localStorage)
function isLoggedIn() {
    return localStorage.getItem('loggedIn') === 'true';
}

// Redirect to login page if not logged in
function requireLogin(redirectUrl = '/login') {
    if (!isLoggedIn()) {
        window.location.href = redirectUrl;
        return false;
    }
    return true;
}

// Format date to readable string
function formatDate(date) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(date).toLocaleDateString(undefined, options);
}

// Handle API errors
function handleApiError(error, defaultMessage = 'An error occurred') {
    console.error('API Error:', error);
    return defaultMessage;
}

// Show notification
function showNotification(message, type = 'info') {
    // Implementation depends on your UI design
    alert(message);
}