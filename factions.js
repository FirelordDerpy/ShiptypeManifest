import { app, db, push } from './firebaseConfig.js';
import { set, ref } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

let clientInput, addClientButton, clientList;

let clients = JSON.parse(localStorage.getItem('clients')) || [];

function addClient() {
    const clientName = clientInput.value;
    if (clientName) {
        const listItem = document.createElement('li');
        listItem.textContent = clientName;
        clientList.appendChild(listItem);
        clients.push(clientName);
        localStorage.setItem('clients', JSON.stringify(clients));
        clientInput.value = '';
    }
}

function displayClients() {
    clientList.innerHTML = '';

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

        displayClients();
    }

