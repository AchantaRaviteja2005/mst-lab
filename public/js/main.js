// Common JavaScript functionality for the application

// Global utility functions that can be used with or without Angular

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

// Angular-specific utilities will be defined in the Angular app
// These functions are kept for backward compatibility with non-Angular parts of the app
function isLoggedIn() {
    return localStorage.getItem('loggedIn') === 'true';
}

function requireLogin(redirectUrl = '/login') {
    if (!isLoggedIn()) {
        window.location.href = redirectUrl;
        return false;
    }
    return true;
}