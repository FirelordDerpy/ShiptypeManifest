import { app, db, push, getDatabase, set, ref, onValue, get} from '/firebaseConfig.js';
import { ships } from '/shipIndex.js';


// class factionFleet {
    
// }


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
        clientDiv.textContent = `Client Name: ${client.name}`;
        clientsContainer.appendChild(clientDiv);

        // Create a list for the client's ships
        const shipsList = document.createElement('ul');
        clientDiv.className = 'clientdivF';
        clientDiv.appendChild(shipsList);

// Fetch the ships that the client owns from Firebase
const clientShipsRef = ref(db, `factions/clients/${clientKey}/builds/ownedships`);
const clientShipsSnapshot = await get(clientShipsRef);
const clientShips = clientShipsSnapshot.val();
for (const shipKey in clientShips) {
    const ship = clientShips[shipKey];

    // Create a list item for each ship and append it to the list
    const shipListItem = document.createElement('li');
    shipListItem.className = 'shipdivF'
    shipListItem.innerHTML = `${ship.shipId} ${ship.quantity}x - ${ship.shipName}`;
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

        // Fetch the ship details from Firebase using shipId
        const shipRef = ref(db, `ships/${ship.shipId}`);  // Use shipId to fetch the ship details
        const shipSnapshot = await get(shipRef);
        const shipDetails = shipSnapshot.val();

        // Fill the details div with the ship details
        detailsDiv.innerHTML = `
            <p>id: ${ship.shipId}</p>
            <h2>${shipDetails.name}</h2>
            <p>Type: ${shipDetails.type}. Manufacturer: ${shipDetails.manufacturer}. Base Cost: ₹ ${shipDetails.baseCost}</p>
            <p>Silhouette: ${shipDetails.silhouette}. Power Level: ${shipDetails.powerLevel}</p>
            <p>Hull Points: ${shipDetails.hullPoints}. Shield and Armor Points: ${shipDetails.shieldArmorPoints}</p>
            <p>Primary Armament: ${shipDetails.primaryArmament}</p>
            <p>Secondary Armament 1: ${shipDetails.secondaryArmament1}</p>
            <p>Secondary Armament 2: ${shipDetails.secondaryArmament2}</p>
            <p>Addons: ${shipDetails.addons.map(addon => addon.name).join(', ')}</p>
            <p>Final Cost: ₹ ${shipDetails.finalCost}</p>
            <p>Description: ${shipDetails.description}</p>
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
    const shipRef = ref(db, `factions/clients/${clientKey}/builds/ownedships/${shipKey}`);
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
        const shipRef = ref(db, `factions/clients/${clientKey}/builds/ownedships/${shipKey}`);
        set(shipRef, { ...ship, quantity: newQuantity });

        // Update the quantity in the list item
        shipListItem.innerHTML = `${ship.shipId} ${newQuantity}x - ${ship.shipName}`;
        shipListItem.appendChild(detailsButton);
        shipListItem.appendChild(deleteButton);
        shipListItem.appendChild(changeQuantityButton);
    }
});
shipListItem.appendChild(changeQuantityButton);


}
}
});
}

