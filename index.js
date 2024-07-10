import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, set, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = { databaseURL: "https://shiptypemanifest009-default-rtdb.firebaseio.com/" };

const app = initializeApp(appSettings);
const db = getDatabase(app);

// Define a class for ship types
class ShipType {
    constructor(name, silhouette = 1, powerLevel = 1, baseCost = 0) {
        this.name = name;
        this.silhouette = silhouette;
        this.powerLevel = powerLevel;
        this.baseCost = baseCost;
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
    'Fighter': new ShipType('Fighter', 1, 1, 500),
    'Interceptor': new ShipType('Interceptor', 2, 2, 600),
    // Add more ship types as needed
};

// Define a class for individual ships
class Ship {
    constructor(type, name, addonNames) {
        this.type = type;
        this.name = name;
        if (Array.isArray(addonNames)) {
            this.addons = addonNames.map(name => {
                if (typeof name === 'string') {
                    return { name: name, details: addons[name] };
                } else {
                    return name; // Already an object with name and details properties
                }
            });
        } else {
            // Handle the case where addonNames is not an array
            // You might need to convert it to an array or handle it differently depending on the actual data structure
            this.addons = [];
        }
        this.silhouette = shipTypes[type].silhouette;
        this.powerLevel = shipTypes[type].powerLevel + this.calculatePowerLevelBoost();
        this.baseCost = shipTypes[type].baseCost;
        this.finalCost = this.calculateFinalCost();
    }

    // Method to calculate final cost based on addons
    calculateFinalCost() {
        let addonsCost = 0;
        for (const addon of this.addons) {
            addonsCost += addon.details.cost;
        }
        return this.baseCost + addonsCost;
    }

    // Method to calculate power level boost based on addons
    calculatePowerLevelBoost() {
        let powerLevelBoost = 0;
        for (const addon of this.addons) {
            powerLevelBoost += addon.details.powerLevelBoost;
        }
        return powerLevelBoost;
    }
}


const addons = {
    'Shield': { cost: 100, powerLevelBoost: 1 },
    'Laser': { cost: 200, powerLevelBoost: 2 },
    'Rocket': { cost: 300, powerLevelBoost: 3 }
};

// Create some individual ships
const ships = [
    new Ship('Fighter', 'Fighter 1', ['Shield', 'Laser']),
    new Ship('Interceptor', 'Interceptor 1', ['Shield', 'Rocket']),
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
        <p>Base Cost: ${ship.baseCost}</p>
        <p>Silhouette: ${ship.silhouette}</p>
        <p>Power Level: ${ship.powerLevel}</p>
        <p>Addons: ${ship.addons.map(addon => addon.name).join(', ')}</p>
        <p>Final Cost: ${ship.finalCost}</p>
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

// Populate the addons dropdown
populateDropdown('ship-addons', Object.keys(addons));

// Get the ship type names
const shipTypeNames = Object.keys(shipTypes);

// Populate the ship type dropdown
populateDropdown('ship-type', shipTypeNames);

// Event listener for the "New Ship Class" button
document.getElementById('new-ship-class-btn').addEventListener('click', function() {
    document.getElementById('new-ship-class-form').style.display = 'block';
});

document.getElementById('save-ship-class-btn').addEventListener('click', function() {
    const type = document.getElementById('ship-type').value;
    const name = document.getElementById('ship-name').value;

    // Get an array of selected addons
    const dropdown = document.getElementById('ship-addons');
    const selectedOptions = Array.from(dropdown.selectedOptions);
    const addons = selectedOptions.map(option => option.value);

    // Create a new ship
    const newShip = new Ship(type, name, addons);

    // Save the new ship to Firebase
    saveShipToFirebase(newShip);

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

        // Clear the ship-stats div
        document.getElementById('ship-stats').innerHTML = '';

        // Get the ships from the snapshot
        const data = snapshot.val();

        // Add each ship from the snapshot to the ships array
        for (const key in data) {
            const shipData = data[key];
            const ship = new Ship(shipData.type, shipData.name, shipData.addons);
            ships.push(ship);

            // Display the stats for the ship
            displayShipStats(ship);
        }
    });
}

// Load the ships from Firebase when the app is opened
loadShipsFromFirebase();