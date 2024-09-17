import { app, db, push, getDatabase, set, ref, onValue, get } from '/firebaseConfig.js';
import { ships } from '/shipIndex.js';

if (window.location.pathname.toLowerCase().includes('fleets')) {

    // Fetch clients from Firebase
    const clientsRef = ref(db, 'factions/clients');
    onValue(clientsRef, async (snapshot) => {
        const clients = snapshot.val();
        const clientsContainer = document.getElementById('clients-container');

        // Clear the contents of the clientsContainer
        clientsContainer.innerHTML = '';
        for (const clientKey in clients) {
            const client = clients[clientKey];

            // Create a div for the client
            const clientDiv = document.createElement('div');
            clientDiv.className = 'clientdivF';

            // Check if the passcode is unlocked in local storage
            const passcodeUnlocked = localStorage.getItem(client.name);
            if (passcodeUnlocked) {
                clientDiv.innerHTML = `Client Name: ${client.name} <span style="color: green;">✔️</span>`;

                // Create a list for the client's ships
                const shipsList = document.createElement('ul');
                clientDiv.appendChild(shipsList);

                // Fetch the ships that the client owns from Firebase
                const clientShipsRef = ref(db, `factions/clients/${clientKey}/builds/ownedships`);
                const clientShipsSnapshot = await get(clientShipsRef);
                const clientShips = clientShipsSnapshot.val();

                // Store ships in an array
                const shipsArray = [];
                for (const shipKey in clientShips) {
                    const ship = clientShips[shipKey];

                    // Fetch the ship details from Firebase using shipId
                    const shipRef = ref(db, `ships/${ship.shipId}`);
                    const shipSnapshot = await get(shipRef);
                    const shipDetails = shipSnapshot.val();

                    // Add ship details to the array
                    shipsArray.push({
                        shipId: ship.shipId,
                        quantity: ship.quantity,
                        shipName: ship.shipName,
                        type: shipDetails.type,
                        details: shipDetails
                    });
                }

                // Sort the ships array by type
                shipsArray.sort((a, b) => a.type.localeCompare(b.type));

                // Append sorted ships to the list
                shipsArray.forEach(ship => {
                    // Create a list item for each ship and append it to the list
                    const shipListItem = document.createElement('li');
                    shipListItem.className = 'shipdivF';
                    shipListItem.innerHTML = `${ship.shipId} ${ship.quantity}x - ${ship.shipName} (${ship.type})`;
                    shipsList.appendChild(shipListItem);

                    // Create a "Details" button for each ship
                    const detailsButton = document.createElement('button');
                    detailsButton.textContent = 'Details';
                    detailsButton.className = 'DetBtnFP';
                    detailsButton.addEventListener('click', async function() {
                        window.bleep6.play();
                        // Check if the details div already exists
                        let detailsDiv = shipListItem.querySelector('.details-div');
                        if (detailsDiv) {
                            // If the details div exists, toggle its visibility
                            if (detailsDiv.style.display === 'none') {
                                detailsDiv.style.display = 'block';
                            } else {
                                detailsDiv.style.display = 'none';
                            }
                        } else {
                            // If the details div does not exist, create it
                            detailsDiv = document.createElement('div');
                            detailsDiv.className = 'details-div';  // Assign the CSS class

                            // Fill the details div with the ship details
                            detailsDiv.innerHTML = `
                                <p>id: ${ship.shipId}</p>
                                <h2>${ship.details.name}</h2>
                                <p>Type: ${ship.details.type}. Manufacturer: ${ship.details.manufacturer}. Base Cost: ₹ ${ship.details.baseCost}</p>
                                <p>Silhouette: ${ship.details.silhouette}. Power Level: ${ship.details.powerLevel}</p>
                                <p>Hull Points: ${ship.details.hullPoints}. Shield and Armor Points: ${ship.details.shieldArmorPoints}</p>
                                <p>Primary Armament: ${ship.details.primaryArmament}</p>
                                <p>Secondary Armament 1: ${ship.details.secondaryArmament1}</p>
                                <p>Secondary Armament 2: ${ship.details.secondaryArmament2}</p>
                                <p>Addons: ${ship.details.addons.map(addon => addon.name).join(', ')}</p>
                                <p>Final Cost: ₹ ${ship.details.finalCost}</p>
                                <p>Description: ${ship.details.description}</p>
                            `;
                            // Append the details div to the list item
                            shipListItem.appendChild(detailsDiv);
                        }
                    });
                    shipListItem.appendChild(detailsButton);

                    // Create a "Delete" button for each ship
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.className = 'DelBtnFP';  // Assign your CSS class
                    deleteButton.addEventListener('click', function() {
                        // Delete the ship from Firebase
                        const shipRef = ref(db, `factions/clients/${clientKey}/builds/ownedships/${ship.shipId}`);
                        set(shipRef, null);

                        // Remove the list item from the list
                        shipListItem.remove();
                    });
                    shipListItem.appendChild(deleteButton);

                    // Create a "Change Quantity" button for each ship
                    const changeQuantityButton = document.createElement('button');
                    changeQuantityButton.textContent = 'Change Quantity';
                    changeQuantityButton.className = 'ChgQtyBtnFP';  // Assign your CSS class
                    changeQuantityButton.addEventListener('click', function() {
                        // Prompt the user to enter a new quantity
                        const newQuantity = prompt('Enter a new quantity:');
                        if (newQuantity !== null) {
                            // Update the quantity in Firebase
                            const shipRef = ref(db, `factions/clients/${clientKey}/builds/ownedships/${ship.shipId}`);
                            set(shipRef, { ...ship, quantity: newQuantity });

                            // Update the quantity in the list item
                            shipListItem.innerHTML = `${ship.shipId} ${newQuantity}x - ${ship.shipName} (${ship.type})`;
                            shipListItem.appendChild(detailsButton);
                            shipListItem.appendChild(deleteButton);
                            shipListItem.appendChild(changeQuantityButton);
                        }
                    });
                    shipListItem.appendChild(changeQuantityButton);
                });
            } else {
                clientDiv.textContent = `Client Name: ${client.name}`;
            }

            clientsContainer.appendChild(clientDiv);
        }
    });
}
