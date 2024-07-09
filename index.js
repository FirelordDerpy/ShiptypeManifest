class Ship {
    constructor(type, speed, cargoCapacity, firepower) {
        this.type = type;
        this.speed = speed;
        this.cargoCapacity = cargoCapacity;
        this.firepower = firepower;
    }

    // Method to upgrade speed
    upgradeSpeed(amount) {
        this.speed += amount;
    }

    // Method to upgrade cargo capacity
    upgradeCargoCapacity(amount) {
        this.cargoCapacity += amount;
    }

    // Method to upgrade firepower
    upgradeFirepower(amount) {
        this.firepower += amount;
    }
}

// Create a new ship
var myShip = new Ship('Destroyer', 30, 50, 100);

// Upgrade the ship
myShip.upgradeSpeed(10);
myShip.upgradeCargoCapacity(20);
myShip.upgradeFirepower(30);

// Function to display ship stats
function displayShipStats(ship) {
    const shipStatsDiv = document.getElementById('ship-stats');

    shipStatsDiv.innerHTML = `
        <p>Type: ${ship.type}</p>
        <p>Speed: ${ship.speed}</p>
        <p>Cargo Capacity: ${ship.cargoCapacity}</p>
        <p>Firepower: ${ship.firepower}</p>
    `;
}

// Display the ship stats
displayShipStats(myShip);
