function setup() {
  noCanvas();
  let submit = document.getElementById('submit');

  submit.addEventListener('click', () => {
      // Get the value from the input field
      let userInput = document.getElementById('userinput').value;

      // Prepare the data to send in the request body
      let data = {
          userInput: userInput
      };

      console.log("Submitting data:", data);

      // Make a POST request to the API
      fetch('https://c759ln1v-5002.euw.devtunnels.ms/predict_text', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok ' + response.statusText);
          }
          return response.json();
      })
      .then(data => {
          console.log('Success:', data);
          // Display the response data to the user
          let predict=JSON.stringify(data, null, 2)
          console.log(data)
          document.getElementById('response').innerText =data.prediction;
      })
      .catch((error) => {
          console.error('Error:', error);
          // Display error message to the user
          document.getElementById('response').innerText = 'Error: ' + error.message;
      });
  });
}
