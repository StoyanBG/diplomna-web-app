function sendFeedback() {
    const userEmail = document.getElementById('userEmail').value;
    const message = document.getElementById('message').value;
    const subject = encodeURIComponent('Web App Feedback');
    const body = encodeURIComponent(`From: ${userEmail}\n\n${message}`);
    
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=stoyankanev01@gmail.com&su=${subject}&body=${body}`;
    
    window.open(gmailUrl, '_blank');
}
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