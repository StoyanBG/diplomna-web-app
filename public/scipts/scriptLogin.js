document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const formData = new FormData(this);

  fetch('../api/login.js', {  // Make sure this points to your Vercel login endpoint
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: formData.get('email'),
      password: formData.get('password') // Password is typically not handled here
    })
  })
  .then(response => {
    if (!response.ok) {
      if (response.status === 404) {
        window.location.href = 'registration.html'; // Redirect if user not found
        return;
      }
      return response.json().then(data => {
        throw new Error(data.error);
      });
    }
    window.location.href = 'fl.html'; // Redirect to your success page
  })
  .catch(error => {
    alert(error.message);
  });
});
