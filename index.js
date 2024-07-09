class Ship {
    constructor(name, silhouette, powerLevel) {
        this.name = name;
        this.silhouette = silhouette;
        this.powerLevel = powerLevel;
    }
}

// Create some ships
const ships = {
    'Fighter': new Ship('Fighter', 1, 2),
    'Interceptor': new Ship('Interceptor', 2, 3),
    // Add more ships as needed
};

// Function to display ship stats
function displayShipStats(ship) {
    const shipStatsDiv = document.getElementById('ship-stats');

    shipStatsDiv.innerHTML = `
        <p>Name: ${ship.name}</p>
        <p>Silhouette: ${ship.silhouette}</p>
        <p>Power Level: ${ship.powerLevel}</p>
    `;
}

// Event listener for the ship type dropdown
document.getElementById('ship-type').addEventListener('change', function() {
    const selectedShipType = this.value;
    const selectedShip = ships[selectedShipType];

    if (selectedShip) {
        displayShipStats(selectedShip);
    } else {
        document.getElementById('ship-stats').innerHTML = '';
    }
});
