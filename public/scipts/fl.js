// Fetch selected lines for the current user from the server
fetch('../api/selected-lines.js')
.then(response => response.json()) // Parse the response as JSON
.then(lineIds => {
  // Ensure that lineIds is an array
  if (Array.isArray(lineIds)) {
    // Display selected lines as buttons
    const lineButtonsContainer = document.getElementById('lineButtons');
    lineIds.forEach(line => {
      const buttonDiv = document.createElement('div');
      buttonDiv.className = 'button-div';

      const aTag = document.createElement('a');
      aTag.style.color = 'red';
      aTag.href = `lines/liniq${line}.html`;

      const button = document.createElement('button');
      button.className = 'btn btn-warning';

      const image = document.createElement('img');
      image.src = `lines/img/${line}.jpg`;

      const h5 = document.createElement('h5');
      h5.textContent = `линия ${line}`;

      button.appendChild(image);
      button.appendChild(h5);
      aTag.appendChild(button);
      buttonDiv.appendChild(aTag);
      lineButtonsContainer.appendChild(buttonDiv);
    });
  }
})
.catch(error => {
  console.error('Error:', error); // Log any errors
});
document.getElementById('main-page-button').addEventListener('click', function(event) {
      event.preventDefault(); // Prevent the default anchor click behavior

      // Check authentication status
      fetch('../api/check-auth.js')
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