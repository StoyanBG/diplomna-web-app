 // Fetch and display complaints with responses on page load
 document.addEventListener('DOMContentLoaded', fetchComplaints);

 function fetchComplaints() {
fetch('/api/get-complaints')
 .then(response => response.json())
 .then(complaints => {
     console.log('Fetched complaints:', complaints); // Log complaints for debugging
     const complaintsList = document.getElementById('complaintsList');
     complaintsList.innerHTML = ''; // Clear existing content
     
     complaints.forEach(complaint => {
         const responsesHtml = complaint.responses && Object.keys(complaint.responses).length > 0
             ? Object.values(complaint.responses).map(res => 
                 `<p><strong>Отговор:</strong> ${res.response_message} (от ${res.responderName})</p>`).join('')
             : '<p><strong>Отговор:</strong> Все още няма отговор</p>'; // Message if no responses

         const li = document.createElement('li');
         li.innerHTML = `
             <div class="complaint-item">
                 <p><strong>${complaint.subject}</strong> - ${complaint.message} (от ${complaint.sender})</p>
                 <div class="responses">
                     ${responsesHtml}
                 </div>
                 <button class="btn btn-primary" onclick="showResponseForm('${complaint.id}')">Отговорете</button>
             </div>
         `;
         complaintsList.appendChild(li);
     });
 })
 .catch(error => console.error('Error fetching complaints:', error));
}



 // Show response form and set the message ID
 function showResponseForm(messageId) {
     document.getElementById('responseForm').style.display = 'block';
     document.getElementById('messageId').value = messageId; // Set the hidden message ID
     document.getElementById('response').focus(); // Focus on the response textarea
 }

 // Handle response form submission
 document.getElementById('responseForm').addEventListener('submit', function (e) {
     e.preventDefault();
     const messageId = document.getElementById('messageId').value;
     const response = document.getElementById('response').value;

     fetch('/api/respond-message', {
         method: 'POST',
         headers: {
             'Content-Type': 'application/json'
         },
         body: JSON.stringify({ messageId, response })
     })
     .then(response => response.text())
     .then(data => {
         document.getElementById('responseStatus').textContent = data;
         document.getElementById('responseForm').reset();
         document.getElementById('responseForm').style.display = 'none'; // Hide form after submission
         fetchComplaints(); // Reload complaints after response
     })
     .catch(error => {
         document.getElementById('responseStatus').textContent = 'Error: ' + error.message;
     });
 });

 function redirectToComplaintPage() {
     fetch('/api/check-auth', {
         method: 'GET',
         credentials: 'include'
     })
     .then(response => response.json())
     .then(data => {
         if (data.isAuthenticated) {
             window.location.href = 'service.html';
         } else {
             window.location.href = 'login.html';
         }
     });
 }

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