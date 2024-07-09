import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, set, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = { databaseURL: "https://shiptypemanifest009-default-rtdb.firebaseio.com/" };

const app = initializeApp(appSettings);
const db = getDatabase(app);


// Define a class for ship types
class ShipType {
    constructor(name, silhouette = 1, powerLevel = 1) {
        this.name = name;
        this.silhouette = silhouette;
        this.powerLevel = powerLevel;
    }
}
function saveShipToFirebase(ship) {
    // Get a reference to the ships node
    const shipsRef = ref(db, 'ships');

    // Push the new ship to the database
    const newShipRef = push(shipsRef);
    set(newShipRef, ship);
}

// Create some ship types
const shipTypes = {
    'Fighter': new ShipType('Fighter', 1, 1),
    'Interceptor': new ShipType('Interceptor', 2, 2),
    // Add more ship types as needed
};

// Define a class for individual ships
class Ship {
    constructor(type, name, complexity, addons) {
        this.type = type;
        this.name = name;
        this.complexity = complexity;
        this.addons = addons;
        this.silhouette = shipTypes[type].silhouette;
        this.powerLevel = shipTypes[type].powerLevel;
    }
}

const complexity = ['Low', 'Medium', 'High'];
const addons = ['Shield', 'Laser', 'Rocket'];

// Create some individual ships
const ships = [
    new Ship('Fighter', 'Fighter 1'),
    new Ship('Interceptor', 'Interceptor 1'),
    // Add more individual ships as needed
];

// Function to display ship stats
function displayShipStats(ship) {
    const shipStatsDiv = document.getElementById('ship-stats');

    // Create a new div for this ship's stats
    const shipDiv = document.createElement('div');
    shipDiv.innerHTML = `
        <h2>${ship.name}</h2>
        <p>Type: ${ship.type}</p>
        <p>Silhouette: ${ship.silhouette}</p>
        <p>Power Level: ${ship.powerLevel}</p>
        <p>Complexity: ${ship.complexity}</p>
        <p>Addons: ${ship.addons}</p>
    `;

    // Prepend this ship's stats to the ship-stats div
    shipStatsDiv.insertBefore(shipDiv, shipStatsDiv.firstChild);
}


// Function to populate the dropdowns
function populateDropdown(dropdownId, options) {
    const dropdown = document.getElementById(dropdownId);

    // Clear any existing options
    dropdown.innerHTML = '';

    // Add an option for each item in the options array
    for (const option of options) {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        dropdown.appendChild(optionElement);
    }
}

// Populate the complexity and addons dropdowns
populateDropdown('ship-complexity', complexity);
populateDropdown('ship-addons', addons);

// Get the ship type names
const shipTypeNames = Object.keys(shipTypes);

// Populate the ship type dropdown
populateDropdown('ship-type', shipTypeNames);

// Event listener for the "New Ship Class" button
document.getElementById('new-ship-class-btn').addEventListener('click', function() {
    document.getElementById('new-ship-class-form').style.display = 'block';
    document.getElementById('ship-type').style.display = 'block';
    document.getElementById('ship-type-label').style.display = 'block';
});

document.getElementById('save-ship-class-btn').addEventListener('click', function() {
    const type = document.getElementById('ship-type').value;
    const name = document.getElementById('ship-name').value;
    const complexity = document.getElementById('ship-complexity').value;
    const addons = document.getElementById('ship-addons').value;

    // Create a new ship and add it to the ships array
    const newShip = new Ship(type, name, complexity, addons);
    ships.push(newShip);

    // Save the new ship to Firebase
    saveShipToFirebase(newShip);

    // Display the stats for the new ship
    displayShipStats(newShip);

    // Hide the new ship class form and clear the input fields
    document.getElementById('new-ship-class-form').style.display = 'none';
    document.getElementById('ship-name').value = '';
});


// Display the stats for the first ship
displayShipStats(ships[0]);

// Function to load ships from Firebase
function loadShipsFromFirebase() {
    // Get a reference to the ships node
    const shipsRef = ref(db, 'ships');

    // Listen for changes to the ships node
    onValue(shipsRef, (snapshot) => {
        // Clear the current ships array
        ships.length = 0;

        // Get the ships from the snapshot
        const data = snapshot.val();

        // Add each ship from the snapshot to the ships array
        for (const key in data) {
            const shipData = data[key];
            const ship = new Ship(shipData.type, shipData.name, shipData.complexity, shipData.addons);
            ships.push(ship);

            // Display the stats for the ship
            displayShipStats(ship);
        }
    });
}

// Load the ships from Firebase when the app is opened
loadShipsFromFirebase();
