document.getElementById('complaintForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    fetch('/api/send-message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ subject, message })
    })
    .then(response => response.text())
    .then(data => {
        document.getElementById('responseMessage').textContent = data;
        document.getElementById('complaintForm').reset();
    })
    .catch(error => {
        document.getElementById('responseMessage').textContent = 'Error: ' + error.message;
    });
});
document.getElementById('main-page-button').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default anchor click behavior

    // Check authentication status
    fetch('/api/check-auth')
        .then(response => response.json())
        .then(data => {
            if (data.isAuthenticated) {
                // Redirect to success.html if authenticated
                window.location.href = 'success.html';
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