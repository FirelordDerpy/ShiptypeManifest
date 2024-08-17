import { app, db, push, onValue, remove } from '/firebaseConfig.js';
import { set, ref } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

let clientInput, addClientButton, clientList;

// Load the clients array from localStorage or initialize it as an empty array
let clients = JSON.parse(localStorage.getItem('clients')) || [];

function addClient() {
    const clientName = clientInput.value;
    if (clientName) {
        // Add the client name to the list on the HTML page
        const listItem = document.createElement('li');
        listItem.textContent = clientName;
        clientList.appendChild(listItem);

        // Upload the client name to Firebase
        const clientsRef = ref(db, 'factions/clients');
        const newClientRef = push(clientsRef);
        set(newClientRef, { name: clientName })
            .then(() => {
                console.log('Client name uploaded successfully.');  // Log a success message
                displayClients();  // Call displayClients after the client name has been uploaded
            })
            .catch((error) => {
                console.error('Error uploading client name: ', error);
            });

        // Clear the input field
        clientInput.value = '';
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

            // Add each client name to the list on the HTML page
            // Add each client name to the list on the HTML page
            const listItem = document.createElement('li');

            // Create a div for the client name
            const clientDiv = document.createElement('div');
            clientDiv.textContent = clientName;
            listItem.appendChild(clientDiv);

            // Create a delete button
            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-button';
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', function() {
                // Remove the client name from Firebase
                const clientRef = ref(db, 'factions/clients/' + key);
                remove(clientRef);

                // Remove the list item from the HTML page
                listItem.remove();
            });

            // Add the delete button to the list item
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

