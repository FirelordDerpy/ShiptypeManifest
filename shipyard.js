import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { ref } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { ships } from './index.js';

const appSettings = { databaseURL: "https://shiptypemanifest009-default-rtdb.firebaseio.com/" };
const app = initializeApp(appSettings);
const db = getDatabase(app);

//'None': { cost: 0, powerLevelBoost: 0, hullPointsBoost: 0, shieldArmorPointsBoost: 0},
let buildTimeModifier = 1;
let userCredits = 10000000; 



//SHIP DROP DOWN

// Create a dropdown for ship selection
function createShipDropdown() {
    const shipDropdown = document.createElement('select');
    shipDropdown.id = 'ship-dropdown';
    document.body.appendChild(shipDropdown);

    // Create a number input for the quantity
    const quantityInput = document.createElement('input');
    quantityInput.id = 'ship-quantity';
    quantityInput.type = 'number';
    quantityInput.min = '1';
    quantityInput.value = '1';
    document.body.appendChild(quantityInput);

    // Create a "Build ship" button
    const buildButton = document.createElement('button');
    buildButton.id = 'build-button';
    buildButton.textContent = 'Build ship';
    document.body.appendChild(buildButton);
    
    
    // Create a div for the ship stats and the build queue
    const statsAndQueueDiv = document.createElement('div');
    statsAndQueueDiv.id = 'stats-and-queue';
    document.body.appendChild(statsAndQueueDiv);

    // Create the build queue line and text
    const buildQueueLine = document.createElement('hr');
    const buildQueueText = document.createElement('div');
    buildQueueText.textContent = 'Build Queue';
    statsAndQueueDiv.appendChild(buildQueueLine);
    statsAndQueueDiv.appendChild(buildQueueText);
    
    // Create a div for the build queue
    const buildQueueDiv = document.createElement('div');
    buildQueueDiv.id = 'build-queue';
    statsAndQueueDiv.appendChild(buildQueueDiv);
    
    // Fetch ships from Firebase
    const shipsRef = ref(db, 'ships');
    onValue(shipsRef, (snapshot) => {
        const data = snapshot.val();
        // Convert the data object to an array and sort it by ship type
        const sortedData = Object.values(data).sort((a, b) => a.type.localeCompare(b.type));
        for (const shipData of sortedData) {
            const option = document.createElement('option');
            option.value = shipData.name;
            // Include both the ship type and the name in the option text
            option.text = `${shipData.type} - ${shipData.name} ₹${shipData.finalCost}`;
            shipDropdown.appendChild(option);
        }
    });

    // Add event listeners to update the displayed stats when a ship is selected or the quantity changes, and to display the build information when the button is clicked
    shipDropdown.addEventListener('change', function() {
        displaySelectedShipStats(this.value, quantityInput.value);
    });
    quantityInput.addEventListener('input', function() {
        displaySelectedShipStats(shipDropdown.value, this.value);
    });
    buildButton.addEventListener('click', function() {
        displayBuildInformation(shipDropdown.value, quantityInput.value);
    });
}



function displaySelectedShipStats(shipName, quantity) {
    const selectedShip = ships.find(ship => ship.name === shipName);
    if (selectedShip) {
        // Clear the old stats
        const oldStats = document.getElementById('ship-details');
        if (oldStats) {
            oldStats.remove();
        }

        // Calculate the build time based on the power level and the build time modifier
        const buildTime = selectedShip.calculateTotalPowerLevel() * buildTimeModifier;

        // Create the new stats
        const shipStats = document.createElement('div');
        shipStats.id = 'ship-details';
        shipStats.innerHTML = `
            <h2>${selectedShip.name}</h2>
            <p>Type: ${selectedShip.type}. Manufacturer: ${selectedShip.manufacturer}</p>
            <p>Silhouette: ${selectedShip.silhouette}. Power Level: ${selectedShip.calculateTotalPowerLevel()}. Hull Points: ${selectedShip.hullPoints + selectedShip.calculateHullPointsBoost()}. Shield and Armor Points: ${selectedShip.shieldArmorPoints + selectedShip.calculateShieldArmorPointsBoost()}</p>
            <p>Primary Armament: ${selectedShip.primaryArmament}</p>
            <p>Secondary Armament 1: ${selectedShip.secondaryArmament1}</p>
            <p>Secondary Armament 2: ${selectedShip.secondaryArmament2}</p>
            <p>Addons: ${selectedShip.addons.map(addon => addon.name).join(', ')}</p>
            <p>Final Cost for ${quantity} ship(s): ₹ ${(selectedShip.calculateTotalCost() * quantity).toLocaleString()}. Build Time: ${buildTime} units</p>
            <p>Description: ${selectedShip.description}</p>
        `;
        const statsAndQueueDiv = document.getElementById('stats-and-queue');
        statsAndQueueDiv.insertBefore(shipStats, statsAndQueueDiv.firstChild);
        document.body.appendChild(shipStats);
    }
}

// Call the function to create the dropdown when the page loads
window.onload = function() {
    if (window.location.pathname === '/shipyards.html') {
        createShipDropdown();
    }
};





// Define the user's credits

// Display the user's credits
function displayUserCredits() {
    // Clear the old credits
    const oldCredits = document.getElementById('user-credits');
    if (oldCredits) {
        oldCredits.remove();
    }

    // Display the new credits
    const userCreditsDiv = document.createElement('div');
    userCreditsDiv.id = 'user-credits';
    userCreditsDiv.textContent = `Your credits: ₹ ${userCredits.toLocaleString()}`;

    // Append the credits to the specific div instead of the body
    const userCreditsContainer = document.getElementById('user-credits-container');
    userCreditsContainer.appendChild(userCreditsDiv);
}



function displayBuildInformation(shipName, quantity) {
    const selectedShip = ships.find(ship => ship.name === shipName);
    if (selectedShip) {
        // Calculate the build time and cost
        const buildTime = selectedShip.calculateTotalPowerLevel() * buildTimeModifier;
        const totalCost = selectedShip.calculateTotalCost() * quantity;

        // Deduct the total cost from the user's credits
        userCredits -= totalCost;

        // Create the build information
        const buildInfo = document.createElement('div');
        buildInfo.id = 'build-info';
        buildInfo.textContent = `Building ${quantity} ${shipName}(s) will take ${buildTime} units and cost ₹ ${totalCost.toLocaleString()}. Your remaining credits: ₹ ${userCredits.toLocaleString()}`;

        // Append the build information to the build queue div
        const buildQueueDiv = document.getElementById('build-queue');
        buildQueueDiv.appendChild(buildInfo);

        // Update the displayed user credits
        displayUserCredits();
    }
}


window.onload = function() {
    if (window.location.pathname === '/shipyards.html') {
        createShipDropdown();
        displayUserCredits();
    }
};