import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { ref } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { ships } from './index.js';

const appSettings = { databaseURL: "https://shiptypemanifest009-default-rtdb.firebaseio.com/" };
const app = initializeApp(appSettings);
const db = getDatabase(app);

//'None': { cost: 0, powerLevelBoost: 0, hullPointsBoost: 0, shieldArmorPointsBoost: 0},

//SHIP DROP DOWN

// Create a dropdown for ship selection
function createShipDropdown() {
    const shipDropdown = document.createElement('select');
    shipDropdown.id = 'ship-dropdown';
    document.body.appendChild(shipDropdown);

    // Fetch ships from Firebase
    const shipsRef = ref(db, 'ships');
    onValue(shipsRef, (snapshot) => {
        const data = snapshot.val();
        for (const key in data) {
            const shipData = data[key];
            const option = document.createElement('option');
            option.value = shipData.name;
            // Include both the ship type and the name in the option text
            option.text = `${shipData.type} - ${shipData.name} ₹${shipData.finalCost}`;
            shipDropdown.appendChild(option);
        }
    });

    // Add an event listener to update the displayed stats when a ship is selected
    shipDropdown.addEventListener('change', function() {
        displaySelectedShipStats(this.value);
    });
}




// Display the stats for the selected ship
function displaySelectedShipStats(shipName) {
    const selectedShip = ships.find(ship => ship.name === shipName);
    if (selectedShip) {
        // Clear the old stats
        const oldStats = document.getElementById('ship-stats');
        if (oldStats) {
            oldStats.remove();
        }

        // Display the new stats
        const shipStats = document.createElement('div');
        shipStats.id = 'ship-stats';
        shipStats.textContent = JSON.stringify(selectedShip, null, 2);  // Display the ship stats as formatted JSON
        document.body.appendChild(shipStats);
    }
}

// Call the function to create the dropdown when the page loads
window.onload = function() {
    if (window.location.pathname === '/shipyards.html') {
        createShipDropdown();
    }
};
