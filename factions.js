import { app, db, push, onValue, remove } from '/firebaseConfig.js';
import { set, ref } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

let clientInput, addClientButton, clientList;

// Load the clients array from localStorage or initialize it as an empty array
let clients = JSON.parse(localStorage.getItem('clients')) || [];

function addClient() {
    const clientName = clientInput.value;
    const clientCreditsInput = document.getElementById('client-credits');
    const clientCredits = clientCreditsInput.value;
    if (clientName && clientCredits) {
        bleep17.play();
        // Add the client name and credits to the list on the HTML page
        const listItem = document.createElement('li');
        listItem.textContent = `${clientName} - ₹${clientCredits}`;
        clientList.appendChild(listItem);

        // Upload the client name and credits to Firebase
        const clientsRef = ref(db, 'factions/clients');
        const newClientRef = push(clientsRef);
        set(newClientRef, { name: clientName, credits: clientCredits })
            .then(() => {
                console.log('Client data uploaded successfully.');  // Log a success message
                displayClients();  // Call displayClients after the client data has been uploaded
            })
            .catch((error) => {
                console.error('Error uploading client data: ', error);
            });

        // Clear the input fields
        clientInput.value = '';
        clientCreditsInput.value = '';
    }
}



function displayClients() {
    // Get the clients from Firebase
    const clientsRef = ref(db, 'factions/clients');
    onValue(clientsRef, (snapshot) => {
        // Clear the old list
        clientList.innerHTML = '';

        const clients = snapshot.val();
        for (const key in clients) {
            const clientName = clients[key].name;
            const clientCredits = clients[key].credits;

            // Add each client name and credits to the list on the HTML page
            const listItem = document.createElement('li');

            // Create a div for the client data
            const clientDiv = document.createElement('div');
            clientDiv.textContent = `${clientName} - ₹${clientCredits}`;
            listItem.appendChild(clientDiv);

            // Create an "Adjust Credits" button
           const adjustButton = document.createElement('button');
            adjustButton.textContent = 'Adjust Credits';
            adjustButton.addEventListener('click', function() {
                bleep17.play();
                let newCredits = prompt('Enter the new amount of credits:');
                // Check if the input is a positive integer
                if (newCredits && Number.isInteger(+newCredits) && +newCredits >= 0) {
                    // Update the client's credits in Firebase
                    const clientRef = ref(db, `factions/clients/${key}`);
                    set(clientRef, { name: clientName, credits: newCredits });
                } else {
                    alert('Invalid input. Please enter a positive integer.');
                }
            });
            listItem.appendChild(adjustButton);

            // Create a "Delete" button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', function() {
                bleep17.play();
                // Remove the client name from Firebase
                const clientRef = ref(db, `factions/clients/${key}`);
                remove(clientRef);

                // Remove the list item from the HTML page
                listItem.remove();
            });
            listItem.appendChild(deleteButton);

            // Add the list item to the list
            clientList.appendChild(listItem);
        }
    });
}




if (window.location.pathname.toLowerCase().includes('faction')) {
        clientInput = document.getElementById('client-input');
        addClientButton = document.getElementById('add-client-button');
        clientList = document.getElementById('client-list');
        addClientButton.addEventListener('click', addClient);
        displayClients();
}

