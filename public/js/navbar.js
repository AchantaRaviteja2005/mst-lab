document.addEventListener('DOMContentLoaded', function() {
    // Get the profile dropdown element
    const profileDropdown = document.querySelector('.profile-dropdown');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const profileIcon = document.querySelector('.profile-icon');
    
    if (profileDropdown && dropdownMenu && profileIcon) {
        // Toggle dropdown on click
        profileIcon.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Toggle the dropdown
            const isVisible = dropdownMenu.style.display === 'block';
            dropdownMenu.style.display = isVisible ? 'none' : 'block';
            
            // Add active state to the icon when dropdown is open
            if (!isVisible) {
                profileIcon.classList.add('active');
            } else {
                profileIcon.classList.remove('active');
            }
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!profileDropdown.contains(e.target)) {
                dropdownMenu.style.display = 'none';
                profileIcon.classList.remove('active');
            }
        });
        
        // Prevent dropdown from closing when clicking inside it
        dropdownMenu.addEventListener('click', function(e) {
            // Only prevent propagation if not clicking on a link
            if (!e.target.closest('a')) {
                e.stopPropagation();
            }
        });
    }
});