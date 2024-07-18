import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, set, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { manufacturers } from './shipyard.js';
import { addons, } from './addons.js';
import { ShipType, shipTypes } from './shipTypes.js';

const appSettings = { databaseURL: "https://shiptypemanifest009-default-rtdb.firebaseio.com/" };






const app = initializeApp(appSettings);
const db = getDatabase(app);

populateDropdown('ship-manufacturer', manufacturers);


function saveShipToFirebase(ship) {
    // Get a reference to the ships node
    const shipsRef = ref(db, 'ships');
    // Push the new ship to the database
    const newShipRef = push(shipsRef);
    set(newShipRef, ship);
    return newShipRef.key;
}

// Define a class for individual ships
class Ship {
    constructor(type, name, addonNames, primaryArmament, description = '', manufacturer = '') {
        this.type = type;
        this.name = name;
        this.description = description;
        this.manufacturer = manufacturer;
        this.primaryArmament = primaryArmament;
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
        this.hullPoints = shipTypes[type].hullPoints + this.calculateHullPointsBoost();
        this.shieldArmorPoints = shipTypes[type].shieldArmorPoints + this.calculateShieldArmorPointsBoost();
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
        calculateShieldArmorPointsBoost() {
        let shieldArmorPointsBoost = 0;
        for (const addon of this.addons) {
            // Calculate the shield and armor points boost as a percentage of the base shield and armor points
            let addonBoost = this.shieldArmorPoints * (addon.details.shieldArmorPointsBoost / 100);
            shieldArmorPointsBoost += Number.isNaN(addonBoost) ? 0 : addonBoost;
        }
        return shieldArmorPointsBoost;
    }
        calculateHullPointsBoost() {
        let hullPointsBoost = 0;
        for (const addon of this.addons) {
            // Calculate the hull points boost as a percentage of the base hull points
            let addonBoost = this.hullPoints * (addon.details.hullPointsBoost / 100);
            hullPointsBoost += Number.isNaN(addonBoost) ? 0 : addonBoost;
        }
        return hullPointsBoost;
    }

}

// Create some individual ships
let ships = [
    new Ship('None', 'none', []),
];


// Function to display ship stats
function displayShipStats(ship) {
    const shipStatsDiv = document.getElementById('ship-stats');

    // Create a new div for this ship's stats
    const shipDiv = document.createElement('div');
    shipDiv.className = 'ship-stats-block'; // Add this line
    shipDiv.innerHTML = `
        <h2>${ship.name}</h2>
        <p>Type: ${ship.type}. Manufacturer: ${ship.manufacturer}. Base Cost: ₹ ${ship.baseCost}</p>
        <p>Silhouette: ${ship.silhouette}. Power Level: ${ship.powerLevel + ship.calculatePowerLevelBoost()}</p>
        <p>Hull Points: ${ship.hullPoints + ship.calculateHullPointsBoost()}. Shield and Armor Points: ${ship.shieldArmorPoints + ship.calculateShieldArmorPointsBoost()}</p>
        <p>Primary Armament: ${ship.primaryArmament}</p>
        <p>Addons: ${ship.addons.map(addon => addon.name).join(', ')}</p>
        <p>Final Cost: ₹ ${ship.finalCost.toLocaleString()}</p>
        <p>Description: ${ship.description}</p>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
    `;

    // Prepend this ship's stats to the ship-stats div
    shipStatsDiv.insertBefore(shipDiv, shipStatsDiv.firstChild);
    
    shipDiv.querySelector('.delete-btn').addEventListener('click', function() {
        if (window.confirm('Are you sure you want to delete this ship?')) {
            const shipRef = ref(db, 'ships/' + ship.id);
            remove(shipRef);
            if (shipStatsDiv.contains(shipDiv)) {
            shipStatsDiv.removeChild(shipDiv);
            }
        }

    });

    shipDiv.querySelector('.edit-btn').addEventListener('click', function() {
        // Load the ship's data into the form
        document.getElementById('ship-type').value = ship.type;
        document.getElementById('ship-name').value = ship.name;
        document.getElementById('ship-manufacturer').value = ship.manufacturer;
        document.getElementById('ship-description').value = ship.description;
        // TODO: Load the ship's addons into the dropdowns
        // Show the form
        document.getElementById('new-ship-class-form').style.display = 'block';
        // Change the "Save" button to "Update"
        document.getElementById('save-ship-class-btn').textContent = 'Update';
        document.getElementById('save-ship-class-btn').dataset.id = ship.id; // Save the id for later
    });
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
    // Get the ship details from the form
    const type = document.getElementById('ship-type').value;
    const name = document.getElementById('ship-name').value;
    const manufacturer = document.getElementById('ship-manufacturer').value;
    const description = document.getElementById('ship-description').value;
    const primaryArmament = document.getElementById('primary-armament').value;

    // Get an array of selected addons
    const dropdown1 = document.getElementById('ship-addons-1');
    const dropdown2 = document.getElementById('ship-addons-2');
    const dropdown3 = document.getElementById('ship-addons-3');
    const selectedOptions = [
        dropdown1.options[dropdown1.selectedIndex].value,
        dropdown2.options[dropdown2.selectedIndex].value,
        dropdown3.options[dropdown3.selectedIndex].value
    ];


    if (this.textContent === 'Update') {
        // This is an update
        // Get the id of the ship to update
        const id = this.dataset.id;

        // Update the ship in Firebase
        const shipRef = ref(db, 'ships/' + id);
        set(shipRef, { type, name, addons: selectedOptions, primaryArmament, description, manufacturer });

        // Reset the button text
        this.textContent = 'Save';
    } else {
        // This is a new ship
        // Create a new ship
        const primaryArmament = document.getElementById('primary-armament').value;
        const newShip = new Ship(type, name, selectedOptions, primaryArmament, description, manufacturer,);

        // Save the new ship to Firebase
        newShip.id = saveShipToFirebase(newShip);
    }

    // Hide the form and clear the input fields
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
            const ship = new Ship(shipData.type, shipData.name, shipData.addons, shipData.primaryArmament, shipData.description, shipData.manufacturer);
            ship.id = key; // Add this line
            ships.push(ship);

            // Display the stats for the ship
            displayShipStats(ship);
            }
    });
}

// Load the ships from Firebase when the app is opened
loadShipsFromFirebase();





const primaryArm = {
    'Laser Cannons': { cost: 1, powerLevelBoost: 1, lightAttack: 5, mediumAttack: 5, heavyAttack: 5 },
    'Proton Torpedoes': { cost: 1, powerLevelBoost: 1, lightAttack: 5, mediumAttack: 5, heavyAttack: 5 },
    'Ion Cannons': { cost: 1, powerLevelBoost: 1, lightAttack: 5, mediumAttack: 5, heavyAttack: 5 },
    'Concussion Missiles': { cost: 1, powerLevelBoost: 1, lightAttack: 5, mediumAttack: 5, heavyAttack: 5 },
};

populateDropdown('primary-armament', Object.keys(primaryArm));