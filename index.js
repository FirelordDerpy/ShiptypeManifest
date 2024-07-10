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

// Ship types (name, silhouette, power level, price,)
const shipTypes = {
    'None': new ShipType('None', 0, 0, 0),
    'Interceptors': new ShipType('Interceptors', 3, 2, 32000),
    'Fighters': new ShipType('Fighters', 3, 2, 36000),
    'Bombers': new ShipType('Bombers', 3, 4, 60000),
    'Corvettes': new ShipType('Corvettes', 5, 16, 640000),
    'Frigates': new ShipType('Frigates', 6, 32, 4000000),
    'Heavy Cruisers': new ShipType('Heavy Cruisers', 7, 64, 16000000),
    'Destroyers': new ShipType('Destroyers', 8, 128, 48000000),
    'Dreadnoughts': new ShipType('Dreadnoughts', 9, 256, 200000000),
    'Super Star Destroyers': new ShipType('Super Star Destroyers', 10, 512, 1200000000),
    'Small Moons': new ShipType('Small Moons', 11, 1536, 800000000000),
    'Civilian craft': new ShipType('Civilian craft', 0, 0, 0),
    'Light Civilian Transports': new ShipType('Light Civilian Transports', 4, 1, 40000),
    'Bulk Freighters': new ShipType('Bulk Freighters', 5, 2, 120000),
    'Heavy Bulk Freighters': new ShipType('Heavy Bulk Freighters', 7, 3, 160000),
    'Yatchts': new ShipType('Yatchts', 4, 1, 72000),
    'Liners': new ShipType('Liners', 5, 2, 16000000),
    'Utility vessels': new ShipType('Utility vessels', 4, 1, 160000),
    'Anti-Capital Mines': new ShipType('Anti-Capital Mines', 2, 1, 1600),
    'Super Star Destroyer Hull Component': new ShipType('Super Star Destroyer Hull Component', 10, 0, 600000000),
    'Super Star Destroyer Engine Component': new ShipType('Super Star Destroyer Engine Component', 10, 0, 600000000),
    'Destroyer front Hull (Part 1)': new ShipType('Destroyer front Hull (Part 1)', 4, 0, 24000000),
    'Destroyer Engine Package (Part 2)': new ShipType('Destroyer Engine Package (Part 2)', 4, 0, 24000000),
    'REPAIRS/UPGRADES Corvettes': new ShipType('REPAIRS/UPGRADES Corvettes', 5, 0, 1),
    'REPAIRS/UPGRADES Frigates': new ShipType('REPAIRS/UPGRADES Frigates', 6, 0, 1),
    'REPAIRS/UPGRADES Heavy Cruiser': new ShipType('REPAIRS/UPGRADES Heavy Cruiser', 7, 0, 1),
    'REPAIRS/UPGRADES Destroyer': new ShipType('REPAIRS/UPGRADES Destroyer', 8, 0, 1),
    'REPAIRS/UPGRADES Dreadnoughts': new ShipType('REPAIRS/UPGRADES Dreadnoughts', 9, 0, 1),
    'REPAIRS/UPGRADES Super Star Destroyers': new ShipType('REPAIRS/UPGRADES Super Star Destroyers', 10, 0, 1),
    'REPAIRS/UPGRADES Small Moons': new ShipType('REPAIRS/UPGRADES Small Moons', 11, 0, 1),
    'Shipyard Upgrade parts': new ShipType('Shipyard Upgrade parts', 1, 0, 2000000),
    'Heavy Fighters': new ShipType('Heavy Fighters', 4, 4, 12000),
    'Patrol Craft': new ShipType('Patrol Craft', 4, 4, 88000),
    'Shuttles': new ShipType('Shuttles', 4, 4, 52000)
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
            // Calculate the cost of the addon as a percentage of the base cost
            let addonCost = this.baseCost * (addon.details.cost / 100);
            addonsCost += Number.isNaN(addonCost) ? 0 : addonCost;
        }
        return this.baseCost + addonsCost;
    }

    // Method to calculate power level boost based on addons
    calculatePowerLevelBoost() {
        let powerLevelBoost = 0;
        for (const addon of this.addons) {
            // Calculate the power level boost as a percentage of the base power level
            let addonBoost = this.powerLevel * (addon.details.powerLevelBoost / 100);
            powerLevelBoost += Number.isNaN(addonBoost) ? 0 : addonBoost;
        }
        return powerLevelBoost;
    }

}

// name { price, power level,}
const addons = {
    'Shield': { cost: 10, powerLevelBoost: 10 },
    'Laser': { cost: 20, powerLevelBoost: 20 },
    'Rocket': { cost: 30, powerLevelBoost: 30 }
};


// Create some individual ships
const ships = [
    new Ship('Fighters', 'Fighter 1', ['Shield', 'Laser']),
    new Ship('Interceptors', 'Interceptor 1', ['Shield', 'Rocket']),
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
        <p>Power Level: ${ship.powerLevel + ship.calculatePowerLevelBoost()}</p>
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
populateDropdown('ship-addons-1', Object.keys(addons));
populateDropdown('ship-addons-2', Object.keys(addons));
populateDropdown('ship-addons-3', Object.keys(addons));

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
    const dropdown1 = document.getElementById('ship-addons-1');
    const dropdown2 = document.getElementById('ship-addons-2');
    const dropdown3 = document.getElementById('ship-addons-3');
    const selectedOptions = [
        dropdown1.options[dropdown1.selectedIndex].value,
        dropdown2.options[dropdown2.selectedIndex].value,
        dropdown3.options[dropdown3.selectedIndex].value
    ];

    // Create a new ship
    const newShip = new Ship(type, name, selectedOptions);
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