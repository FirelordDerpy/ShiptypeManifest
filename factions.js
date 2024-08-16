import { app, db, push } from './firebaseConfig.js';
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
        // Add the client name to the clients array
        clients.push(clientName);
        // Save the clients array to localStorage
        localStorage.setItem('clients', JSON.stringify(clients));
        // Clear the input field
        clientInput.value = '';
    }
}

function displayClients() {
    // Clear the old list
    clientList.innerHTML = '';

    // Add each client name in the clients array to the list on the HTML page
    for (const clientName of clients) {
        const listItem = document.createElement('li');
        listItem.textContent = clientName;
        clientList.appendChild(listItem);
    }
}
    if (window.location.pathname.toLowerCase().includes('faction')) {
        clientInput = document.getElementById('client-input');
        addClientButton = document.getElementById('add-client-button');
        clientList = document.getElementById('client-list');

        addClientButton.addEventListener('click', addClient);

        // Display the clients when the page loads
        displayClients();
    }

