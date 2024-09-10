import { app, db, push, onValue, remove, set, ref } from '/firebaseConfig.js';
import { manufacturers } from '/manufacturers.js';

let clientInput, addClientButton, clientList;

// Load the clients array from localStorage or initialize it as an empty array
let clients = JSON.parse(localStorage.getItem('clients')) || [];

function addClient() {
    const clientName = clientInput.value;
    const clientPasscodeInput = document.getElementById('client-passcode');
    const clientPasscode = clientPasscodeInput.value;
    const clientCreditsInput = document.getElementById('client-credits');
    const clientCredits = clientCreditsInput.value;
    if (clientName && clientPasscode && clientCredits) { 
        bleep17.play();
        const listItem = document.createElement('li');
        listItem.textContent = `${clientName} - ₹${clientCredits}`;
        clientList.appendChild(listItem);

        const clientsRef = ref(db, 'factions/clients');
        const newClientRef = push(clientsRef);
        set(newClientRef, { name: clientName, passcode: clientPasscode, credits: clientCredits, manufacturers: [] }) // Include passcode and manufacturers here
            .then(() => {
                console.log('Client data uploaded successfully.');  // Log a success message
                displayClients();  // Call displayClients after the client data has been uploaded
            })
            .catch((error) => {
                console.error('Error uploading client data: ', error);
            });

        // Clear the input fields
        clientInput.value = '';
        clientPasscodeInput.value = ''; // Add this line
        clientCreditsInput.value = '';
    }
}

export function displayClients() {
    // Get the clients from Firebase
    const clientsRef = ref(db, 'factions/clients');
    onValue(clientsRef, (snapshot) => {
        // Clear the old list
        clientList.innerHTML = '';

        const clients = snapshot.val();
        for (const key in clients) {
            const clientName = clients[key].name;
            const clientPasscode = clients[key].passcode;
            const clientCredits = clients[key].credits;
            const clientManufacturers = clients[key].manufacturers || [];

            // Format the credits with commas as thousands separators
            const formattedCredits = clientCredits.toLocaleString();

            // Add each client name and credits to the list on the HTML page
            const listItem = document.createElement('li');

            // Create a div for the client data
            const clientDiv = document.createElement('div');
            clientDiv.textContent = `${clientName} - ₹${formattedCredits}`;
            listItem.appendChild(clientDiv);

            const passcodeDiv = document.createElement('div');
            passcodeDiv.textContent = `Passcode: ${clientPasscode}`; // Display the passcode
            listItem.appendChild(passcodeDiv);

            // Add a short bit of text above the checkboxes
            const shipyardsText = document.createElement('p');
            shipyardsText.textContent = 'Shipyards';
            shipyardsText.className = 'shipyards-text';
            listItem.appendChild(shipyardsText);

            // Create checkboxes for manufacturers
            const manufacturersDiv = document.createElement('div');
            manufacturersDiv.className = 'manufacturers-div';
            manufacturers.forEach(manufacturer => {
                const checkboxLabel = document.createElement('label');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = manufacturer;
                checkbox.checked = clientManufacturers.includes(manufacturer);
                checkbox.disabled = true; // Disable checkboxes initially
                checkboxLabel.appendChild(checkbox);
                checkboxLabel.appendChild(document.createTextNode(manufacturer));
                manufacturersDiv.appendChild(checkboxLabel);
            });
            listItem.appendChild(manufacturersDiv);

            // Create a div to display selected manufacturers
            const selectedManufacturersDiv = document.createElement('div');
            selectedManufacturersDiv.className = 'selected-manufacturers-div';
            listItem.appendChild(selectedManufacturersDiv);

            // Add an event listener to update the selected manufacturers div and Firebase
            manufacturersDiv.addEventListener('change', async function() {
                selectedManufacturersDiv.innerHTML = '';
                const selectedOptions = Array.from(manufacturersDiv.querySelectorAll('input:checked'));
                const selectedManufacturers = selectedOptions.map(option => option.value);
                selectedManufacturers.forEach(manufacturer => {
                    const manufacturerDiv = document.createElement('div');
                    manufacturerDiv.textContent = manufacturer;
                    selectedManufacturersDiv.appendChild(manufacturerDiv);
                });

                // Update the client's manufacturers in Firebase
                const clientRef = ref(db, `factions/clients/${key}`);
                await set(clientRef, { name: clientName, passcode: clientPasscode, credits: clientCredits, manufacturers: selectedManufacturers });
            });

            // Create an "Edit" button
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.className = 'edit-button';
            editButton.addEventListener('click', function() {
                const isEditing = editButton.textContent === 'Save';

                if (isEditing) {
                    // Save changes to Firebase
                    const selectedOptions = Array.from(manufacturersDiv.querySelectorAll('input:checked'));
                    const selectedManufacturers = selectedOptions.map(option => option.value);
                    const clientRef = ref(db, `factions/clients/${key}`);
                    set(clientRef, { name: clientName, passcode: clientPasscode, credits: clientCredits, manufacturers: selectedManufacturers });

                    // Toggle visibility of buttons and enable/disable checkboxes
                    adjustButton.style.display = 'none';
                    changePasscodeButton.style.display = 'none';
                    deleteButton.style.display = 'none';
                    manufacturersDiv.querySelectorAll('input').forEach(checkbox => {
                        checkbox.disabled = true;
                    });

                    editButton.textContent = 'Edit';
                } else {
                    const inputPasscode = prompt('Enter passcode:');
                    if (inputPasscode === clientPasscode) {
                        // Toggle visibility of buttons and enable/disable checkboxes
                        adjustButton.style.display = 'inline-block';
                        changePasscodeButton.style.display = 'inline-block';
                        deleteButton.style.display = 'inline-block';
                        manufacturersDiv.querySelectorAll('input').forEach(checkbox => {
                            checkbox.disabled = false;
                        });

                        editButton.textContent = 'Save';
                        bleep17.play();
                    } else {
                        alert('Incorrect passcode.');
                    }
                }
            });
            listItem.appendChild(editButton);

            // Create an "Adjust Credits" button
            const adjustButton = document.createElement('button');
            adjustButton.textContent = 'Adjust Credits';
            adjustButton.style.display = 'none'; // Hide initially
            adjustButton.addEventListener('click', function() {
                bleep17.play();

                // Create an input field for the new credits
                const creditInput = document.createElement('input');
                creditInput.type = 'number';
                creditInput.min = '0';
                creditInput.value = clientCredits;
                creditInput.id = 'credit-input';

                // Replace the client data div with the input field
                clientDiv.textContent = `${clientName} - ₹`;
                clientDiv.appendChild(creditInput);

                // Create a "Save" button
                const saveButton = document.createElement('button');
                saveButton.textContent = 'Save';
                saveButton.addEventListener('click', async function() {
                    let newCredits = creditInput.value;
                    // Check if the input is a positive integer
                    if (newCredits && Number.isInteger(+newCredits) && +newCredits >= 0) {
                        // Update the client's credits in Firebase
                        const clientRef = ref(db, `factions/clients/${key}`);
                        await set(clientRef, { name: clientName, passcode: clientPasscode, credits: newCredits, manufacturers: clientManufacturers });

                        // Format the new credits with commas as thousands separators
                        const formattedCredits = (+newCredits).toLocaleString();

                        // Update the client data div
                        clientDiv.textContent = `${clientName} - ₹${formattedCredits}`;

                        // Refresh the client list to reflect the new credits
                        displayClients();
                    } else {
                        alert('Invalid input. Please enter a positive integer.');
                    }
                });
                clientDiv.appendChild(saveButton);
            });
            listItem.appendChild(adjustButton);

            // Create a "Change Passcode" button
            const changePasscodeButton = document.createElement('button');
            changePasscodeButton.textContent = 'Change Passcode';
            changePasscodeButton.style.display = 'none'; // Hide initially
            changePasscodeButton.addEventListener('click', function() {
                const newPasscode = prompt('Enter new passcode:');
                if (newPasscode) {
                    // Update the client's passcode in Firebase
                    const clientRef = ref(db, `factions/clients/${key}`);
                    set(clientRef, { name: clientName, passcode: newPasscode, credits: clientCredits, manufacturers: clientManufacturers });

                    // Refresh the client list to reflect the new passcode
                    displayClients();
                } else {
                    alert('Invalid input. Please enter a passcode.');
                }
            });
            listItem.appendChild(changePasscodeButton);

            // Create a "Delete" button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.style.display = 'none'; // Hide initially
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
