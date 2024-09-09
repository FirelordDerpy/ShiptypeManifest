import { app, db, push, getDatabase, set, ref, onValue, get } from '/firebaseConfig.js';

function displayClients() {
    // Define clientList
    const clientList = document.getElementById('client-list');

    const clientsRef = ref(db, 'factions/clients');
    onValue(clientsRef, (snapshot) => {
        clientList.innerHTML = '';

        const clients = snapshot.val();
        for (const key in clients) {
            const clientName = clients[key].name;
            const clientPasscode = clients[key].passcode; // Use the saved passcode

            // Add each client name to the list on the HTML page
            const listItem = document.createElement('li');
            listItem.className = 'client-list-item'; // Add class

            // Create a div for the client data
            const clientDiv = document.createElement('div');
            clientDiv.className = 'client-div'; // Add class
            clientDiv.innerHTML = `<h2>${clientName}</h2> - Passcode: ${clientPasscode}`;
            listItem.appendChild(clientDiv);

            // Create a div for the input field
            const inputDiv = document.createElement('div');
            const passcodeInput = document.createElement('input');
            passcodeInput.type = 'password'; // Corrected input type
            passcodeInput.className = 'passcode-input'; // Add class
            inputDiv.appendChild(passcodeInput);
            listItem.appendChild(inputDiv);

            // Create a div for the "Submit" button
            const buttonDiv = document.createElement('div');
            const submitButton = document.createElement('button');
            submitButton.textContent = 'Submit';
            submitButton.className = 'submit-button'; // Add class
            submitButton.addEventListener('click', function() {
                // Check if the entered passcode is correct
                if (passcodeInput.value === clientPasscode) {
                    // Save the passcode to localStorage
                    localStorage.setItem(clientName, clientPasscode);

                    // Change the background color of the list item to green
                    listItem.style.backgroundColor = 'green';

                    // Add "Passcode correct" text below the button
                    const passcodeCorrectText = document.createElement('p');
                    passcodeCorrectText.textContent = 'Passcode correct';
                    listItem.appendChild(passcodeCorrectText);

                    // Log the clients and their passcode statuses
                    console.log(`Client: ${clientName}, Passcode Status: Correct`);

                    // Hide the submit button and the input field
                    submitButton.style.display = 'none';
                    passcodeInput.style.display = 'none';
                } else {
                    listItem.style.backgroundColor = 'red';
                    const passcodeIncorrectText = document.createElement('p');
                    passcodeIncorrectText.textContent = 'Passcode incorrect';
                    listItem.appendChild(passcodeIncorrectText);

                    // Log the clients and their passcode statuses
                    console.log(`Client: ${clientName}, Passcode Status: Incorrect`);
                }
            });
            buttonDiv.appendChild(submitButton);
            listItem.appendChild(buttonDiv);

            // Check if the correct passcode is saved in localStorage
            if (localStorage.getItem(clientName) === clientPasscode) {
                // Change the background color of the list item to green
                listItem.style.backgroundColor = 'green';

                // Add "Passcode correct" text below the button
                const passcodeCorrectText = document.createElement('p');
                passcodeCorrectText.textContent = 'Passcode correct';
                listItem.appendChild(passcodeCorrectText);

                // Log the clients and their passcode statuses
                console.log(`Client: ${clientName}, Passcode Status: Correct`);

                // Hide the submit button and the input field
                submitButton.style.display = 'none';
                passcodeInput.style.display = 'none';
            } else {
                // Log the clients and their passcode statuses
                console.log(`Client: ${clientName}, Passcode Status: Not Entered`);
            }

            clientList.appendChild(listItem);
        }
    });
}

// Check if the correct passcode is saved in localStorage
if (localStorage.getItem('passcode') === 'yourPasscode') {
    // Change the background color of the list item to green
    document.getElementById('client-list').style.backgroundColor = 'green';
}

if (window.location.pathname.toLowerCase().includes('index')) {
    displayClients();
}

if (window.location.pathname.toLowerCase() === '/index' || window.location.pathname === '/') {
    displayClients();
}

// Ensure the DOM is fully loaded before accessing the reset button
document.addEventListener('DOMContentLoaded', function() {
    const resetButton = document.getElementById('reset-button');

    // Add an event listener to the reset button
    resetButton.addEventListener('click', function() {
        // Get all the list items
        const listItems = document.getElementsByClassName('client-list-item');

        // Loop through each list item and reset its state
        for (let i = 0; i < listItems.length; i++) {
            const listItem = listItems[i];

            // Reset the background color
            listItem.style.backgroundColor = 'blue';

            // Remove the "Passcode correct" or "Passcode incorrect" text
            const passcodeStatusText = listItem.querySelector('p');
            if (passcodeStatusText) {
                listItem.removeChild(passcodeStatusText);
            }

            // Show the submit button and the input field
            const submitButton = listItem.querySelector('.submit-button');
            const passcodeInput = listItem.querySelector('.passcode-input');
            submitButton.style.display = 'block';
            passcodeInput.style.display = 'block';

            // Clear the input field
            passcodeInput.value = '';

            // Set the passcode to null in localStorage
            const clientName = listItem.querySelector('.client-div h2').textContent;
            localStorage.setItem(clientName, null);
        }

        // Log the clients and their passcode statuses
        console.log('All clients have been reset to default.');
    });
});

function checkPasscodeStatus() {
    // Get the clients data from Firebase
    const clientsRef = ref(db, 'factions/clients');
    get(clientsRef)
        .then((snapshot) => {
            // Create a new unordered list
            const ul = document.createElement('ul');
            ul.style.display = 'none'; // Initially hide the unordered list

            const clients = snapshot.val();
            for (const key in clients) {
                const clientName = clients[key].name;
                const clientPasscode = clients[key].passcode;

                // Create a new list item
                const li = document.createElement('li');

                // Check if the passcode is saved in localStorage
                if (localStorage.getItem(clientName)) {
                    // Set the text of the list item
                    li.textContent = `Client: ${clientName}, Passcode Status: Unlocked`;
                } else {
                    // Set the text of the list item
                    li.textContent = `Client: ${clientName}, Passcode Status: Locked`;
                }

                // Append the list item to the unordered list
                ul.appendChild(li);
            }

            // Append the unordered list to the body of the HTML document
            document.body.appendChild(ul);

            // Get the "Your Passcodes" element
            const yourPasscodes = document.getElementById('client-status-list');

            // Add a click event listener to the "Your Passcodes" element
            yourPasscodes.addEventListener('click', function() {
                // Toggle the visibility of the unordered list
                if (ul.style.display === 'none') {
                    ul.style.display = 'block';
                } else {
                    ul.style.display = 'none';
                }
            });
        })
        .catch((error) => {
            console.error(`Failed to retrieve clients data: ${error}`);
        });
}

// Call the function to check the passcode status for all clients
checkPasscodeStatus();
