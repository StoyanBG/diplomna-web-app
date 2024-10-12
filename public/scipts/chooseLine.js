function saveChoice() {
    // Get all checked checkboxes
    const l1 = document.getElementById("l1");
    const l7 = document.getElementById("l7");
    const l9 = document.getElementById("l9");
    const l11 = document.getElementById("l11");
    const l16 = document.getElementById("l16");
    const l27 = document.getElementById("l27");
    const l36 = document.getElementById("l36");


    const chosenLines = [];
    // Check if each checkbox is checked and add its value to the chosenLines array
    if (l1.checked) chosenLines.push(l1.value);
    if (l7.checked) chosenLines.push(l7.value);
    if (l9.checked) chosenLines.push(l9.value);
    if (l11.checked) chosenLines.push(l11.value);
    if (l16.checked) chosenLines.push(l16.value);
    if (l27.checked) chosenLines.push(l27.value);
    if (l36.checked) chosenLines.push(l36.value);

    // Send a POST request to save the user's choices
    fetch('../../api/save-choice.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ lineIds: chosenLines })
    })
    .then(response => {
      if (response.ok) {
        // If the response is successful, redirect to fl.html
        window.location.href = '/fl.html';
      } else {
        // Handle errors
        throw new Error('Failed to save choices');
      }
    })
    .catch(error => {
      console.error('Error:', error); // Log any errors
    });
  }