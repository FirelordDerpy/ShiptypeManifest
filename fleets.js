// import { app, db, push, getDatabase, set, ref, onValue, get} from '/firebaseConfig.js';
// import { ships } from '/index.js';


// // class factionFleet {
    
// // }


//     if (window.location.pathname.toLowerCase().includes('fleets')) {



// // Fetch clients from Firebase
// const clientsRef = ref(db, 'factions/clients');
// onValue(clientsRef, async (snapshot) => {
//     const clients = snapshot.val();
//     const clientsContainer = document.getElementById('clients-container');
//     for (const clientKey in clients) {
//         const client = clients[clientKey];

//         // Create a div for the client
//         const clientDiv = document.createElement('div');
//         clientDiv.textContent = `Client Name: ${client.name}`;
//         clientsContainer.appendChild(clientDiv);

//         // Create a list for the client's ships
//         const shipsList = document.createElement('ul');
//         clientDiv.appendChild(shipsList);

// // Fetch the ships that the client owns from Firebase
// const clientShipsRef = ref(db, `factions/clients/${clientKey}/builds/ownedships`);
// const clientShipsSnapshot = await get(clientShipsRef);
// const clientShips = clientShipsSnapshot.val();
// for (const shipKey in clientShips) {
//     const ship = clientShips[shipKey];

//     // Create a list item for each ship and append it to the list
//     const shipListItem = document.createElement('li');
//     shipListItem.innerHTML = `${ship.quantity}x - ${ship.shipName}`;
//     shipsList.appendChild(shipListItem);

//     // Create a "Details" button for each ship
//     const detailsButton = document.createElement('button');
//     detailsButton.textContent = 'Details';
//     detailsButton.addEventListener('click', async function() {
//         // Fetch the ship details from Firebase
//         const shipRef = ref(db, `ships/${ship.shipName}`);  // Use shipName to fetch the ship details
//         const shipSnapshot = await get(shipRef);
//         const shipDetails = shipSnapshot.val();

//         // Display the ship details
//         alert(`Ship Name: ${shipDetails.name}\nType: ${shipDetails.type}\nManufacturer: ${shipDetails.manufacturer}\nDescription: ${shipDetails.description}`);
//     });
//     shipListItem.appendChild(detailsButton);
// }

//     }
// });

// }


