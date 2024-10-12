document.getElementById('main-page-button').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default anchor click behavior

    // Check authentication status
    fetch('../../api/check-auth.js')
        .then(response => response.json())
        .then(data => {
            if (data.isAuthenticated) {
                // Redirect to success.html if authenticated
                window.location.href = 'cl.html';
            } else {
                // Redirect to login.html if not authenticated
                window.location.href = 'login.html';
            }
        })
        .catch(error => {
            console.error('Error checking authentication:', error);
            // Handle error, maybe redirect to login or show a message
            window.location.href = 'login.html';
        });
});