import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, set, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { manufacturers } from '/manufacturers.js';
import { addons, primaryArm, secondaryArm } from '/addons.js';
import { ShipType, shipTypes } from './shipTypes.js';

const appSettings = { databaseURL: "https://shiptypemanifest009-default-rtdb.firebaseio.com/" };

const app = initializeApp(appSettings);
const db = getDatabase(app);

function saveShipToFirebase(ship) {
    const shipsRef = ref(db, 'ships');
    const newShipRef = push(shipsRef);
    set(newShipRef, ship)
        .then(() => {
            console.log('Ship saved successfully.');
            return newShipRef.key;
        })
        .catch((error) => {
            console.error('Error saving ship: ', error);
        });
}


class Ship {
    constructor(type, name, addonNames, primaryArmament, secondaryArmament1, secondaryArmament2,description = '', manufacturer = '') {
        this.type = type;
        this.name = name;
        this.description = description;
        this.manufacturer = manufacturer;
        this.primaryArmament = primaryArmament;
        this.primaryArmamentDetails = primaryArm[primaryArmament] || null;
        this.secondaryArmament1 = secondaryArmament1;
        this.secondaryArmamentDetails = secondaryArm[secondaryArmament1] || null;
        this.secondaryArmament2 = secondaryArmament2 || 'None';
        this.secondaryArmamentDetails2 = secondaryArm[secondaryArmament2] || null;
        
        if (Array.isArray(addonNames)) {
            this.addons = addonNames.map(name => {
                if (typeof name === 'string') {
                    return { name: name, details: addons[name] };
                } else {
                    return name; 
                }
            });
        } else {
            this.addons = [];
        }
        this.silhouette = shipTypes[type].silhouette;
        this.powerLevel = shipTypes[type].powerLevel + this.addonPowerLevelBoost();
        this.baseCost = shipTypes[type].baseCost;
        this.finalCost = this.addonsCost();
        this.hullPoints = shipTypes[type].hullPoints + this.calculateHullPointsBoost();
        this.shieldArmorPoints = shipTypes[type].shieldArmorPoints + this.calculateShieldArmorPointsBoost();
    }


    addonsCost() {
        let addonsCost = 0;
        for (const addon of this.addons) {
            let addonCost = this.baseCost * (addon.details.cost / 100);
            addonsCost += Number.isNaN(addonCost) ? 0 : addonCost;
        }
        return this.baseCost + addonsCost;
    }    calculateTotalCost() {
        return this.baseCost + this.addonsCost();
    }
    
        priArmCost() {
            if (this.primaryArmamentDetails === null) {
                return 0;
            }
            let priArmCost = this.baseCost * (this.primaryArmamentDetails.wCost / 100);
            return priArmCost;
        }  
        secArmCost() {
        if (this.secondaryArmamentDetails === null) {
            return 0;
        }
    let secArmCost = this.baseCost * (this.secondaryArmamentDetails.cost / 100);
    return secArmCost;
}
    calculateTotalCost() {
    return this.baseCost + this.addonsCost() + this.priArmCost() + this.secArmCost();
    }

    addonPowerLevelBoost() {
        let powerLevelBoost = 0;
        for (const addon of this.addons) {
            let addonBoost = this.powerLevel * (addon.details.powerLevelBoost / 100);
            powerLevelBoost += Number.isNaN(addonBoost) ? 0 : addonBoost;
        }
        return powerLevelBoost;
    }
            weaponPowerLevelBoost() {
                let weaponPowerLevelBoost = 0;
                if (this.primaryArmamentDetails !== null) {
                    weaponPowerLevelBoost += this.powerLevel * (this.primaryArmamentDetails.weaponPL / 100);
                }
                if (this.secondaryArmamentDetails !== null) {
                    weaponPowerLevelBoost += this.powerLevel * (this.secondaryArmamentDetails.powerLevelBoost / 100);
                }
                return weaponPowerLevelBoost;
            }

    
        calculateTotalPowerLevel() {
        return this.powerLevel + this.addonPowerLevelBoost() + this.weaponPowerLevelBoost();
        }
        
        calculateShieldArmorPointsBoost() {
        let shieldArmorPointsBoost = 0;
        for (const addon of this.addons) {
            let addonBoost = this.shieldArmorPoints * (addon.details.shieldArmorPointsBoost / 100);
            shieldArmorPointsBoost += Number.isNaN(addonBoost) ? 0 : addonBoost;
        }
        return shieldArmorPointsBoost;
    }
        calculateHullPointsBoost() {
        let hullPointsBoost = 0;
        for (const addon of this.addons) {
            let addonBoost = this.hullPoints * (addon.details.hullPointsBoost / 100);
            hullPointsBoost += Number.isNaN(addonBoost) ? 0 : addonBoost;
        }
        return hullPointsBoost;
    }

}

let ships = [
    new Ship('None', 'none', []),
];


function displayShipStats() {
    const shipStatsDiv = document.getElementById('ship-stats');
        if (!shipStatsDiv) {
        console.log("The 'ship-stats' div does not exist on this page.");
        return;
        }  
    shipStatsDiv.innerHTML = '';
    
    for (const ship of ships) {
        const shipDiv = document.createElement('div');
        shipDiv.className = 'ship-stats-block'; // Add this line
        shipDiv.innerHTML = `
            <h2>${ship.name}</h2>
            <p>Type: ${ship.type}. Manufacturer: ${ship.manufacturer}. Base Cost: ₹ ${ship.baseCost}</p>
            <p>Silhouette: ${ship.silhouette}. Power Level: ${ship.calculateTotalPowerLevel()}</p>
            <p>Hull Points: ${ship.hullPoints + ship.calculateHullPointsBoost()}. Shield and Armor Points: ${ship.shieldArmorPoints + ship.calculateShieldArmorPointsBoost()}</p>
            <p>Primary Armament: ${ship.primaryArmament}</p>
            <p>Secondary Armament 1: ${ship.secondaryArmament1}</p>
            <p>Secondary Armament 2: ${ship.secondaryArmament2}</p>
            <p>Addons: ${ship.addons.map(addon => addon.name).join(', ')}</p>
            <p>Final Cost: ₹ ${ship.calculateTotalCost().toLocaleString()}</p>
            <p>Description: ${ship.description}</p>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `;

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
            document.getElementById('ship-type').value = ship.type;
            document.getElementById('ship-name').value = ship.name;
            document.getElementById('ship-manufacturer').value = ship.manufacturer;
            document.getElementById('ship-description').value = ship.description;
            document.getElementById('new-ship-class-form').style.display = 'block';
            document.getElementById('save-ship-class-btn').textContent = 'Update';
            document.getElementById('save-ship-class-btn').dataset.id = ship.id;
        });
    }
}



function populateDropdown(dropdownId, options) {
    const dropdown = document.getElementById(dropdownId);
    if (!dropdown) {
        console.log(`Dropdown with id ${dropdownId} does not exist on this page.`);
        return;
    }

    dropdown.innerHTML = '';

    for (const option of options) {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        dropdown.appendChild(optionElement);
    }
}


if (window.location.pathname.toLowerCase().includes('addships')) {
    populateDropdown('ship-addons-1', Object.keys(addons));
    populateDropdown('ship-addons-2', Object.keys(addons));
    populateDropdown('ship-addons-3', Object.keys(addons));
    const shipTypeNames = Object.keys(shipTypes);
    populateDropdown('ship-type', shipTypeNames);
    populateDropdown('ship-manufacturer', manufacturers);


document.getElementById('new-ship-class-btn').addEventListener('click', function() {
    console.log("New ship");
    document.getElementById('new-ship-class-form').style.display = 'block';
});

document.getElementById('save-ship-class-btn').addEventListener('click', function() {
    const type = document.getElementById('ship-type').value;
    const name = document.getElementById('ship-name').value;
    const manufacturer = document.getElementById('ship-manufacturer').value;
    const description = document.getElementById('ship-description').value;
    const primaryArmament = document.getElementById('primary-armament').value;
    const secondaryArmament1 = document.getElementById('secondary-armament-1').value;
    const secondaryArmament2 = document.getElementById('secondary-armament-2').value;

    const dropdown1 = document.getElementById('ship-addons-1');
    const dropdown2 = document.getElementById('ship-addons-2');
    const dropdown3 = document.getElementById('ship-addons-3');
    const selectedOptions = [
        dropdown1.options[dropdown1.selectedIndex].value,
        dropdown2.options[dropdown2.selectedIndex].value,
        dropdown3.options[dropdown3.selectedIndex].value
    ];

    if (name === '') {
        alert('Please Name the class');
        return;
    }
    if (type === '' || type === 'None') {
        alert('Please select a Ship type.');
        return;
    }

        if (primaryArmament === '' || primaryArmament === 'None') {
        alert('Please select a primary armament.');
        return;
    }

    if (this.textContent === 'Update') {
        const id = this.dataset.id;

        // Update the ship in Firebase
        const shipRef = ref(db, 'ships/' + id);
        set(shipRef, { type, name, addons: selectedOptions, primaryArmament, secondaryArmament1, secondaryArmament2, description, manufacturer });

        this.textContent = 'Save';
    } else {

        const primaryArmament = document.getElementById('primary-armament').value;
        const newShip = new Ship(type, name, selectedOptions, primaryArmament, secondaryArmament1, secondaryArmament2, description, manufacturer,);

        newShip.id = saveShipToFirebase(newShip);
    }

    document.getElementById('new-ship-class-form').style.display = 'none';
    document.getElementById('ship-name').value = '';
});
}

//displayShipStats(ships[0]);

function loadShipsFromFirebase() {
    const shipsRef = ref(db, 'ships');

    onValue(shipsRef, (snapshot) => {
        ships.length = 0;
        const data = snapshot.val();
        for (const key in data) {
            const shipData = data[key];
            const ship = new Ship(shipData.type, shipData.name, shipData.addons, shipData.primaryArmament, shipData.secondaryArmament1, shipData.secondaryArmament2, shipData.description, shipData.manufacturer);
            ship.id = key;
            ships.push(ship);

            if (window.location.pathname.toLowerCase().includes('addships')) {
                displayShipStats(ship);
            }

            if (window.location.pathname.toLowerCase().includes('shiplist')) {
                displayShipStatsLite();
            }
        }
    });
}

populateDropdown('primary-armament', Object.keys(primaryArm));
populateDropdown('secondary-armament-1', Object.keys(secondaryArm));
populateDropdown('secondary-armament-2', Object.keys(secondaryArm));


loadShipsFromFirebase();

displayShipStatsLite();


let sortOrder = 'type'; 

let sortOrderElement = document.getElementById('sort-order');
if (sortOrderElement) {
    sortOrderElement.addEventListener('change', function() {
        if (window.location.pathname.toLowerCase().includes('shiplist')) {
            sortOrder = this.value;
            displayShipStatsLite();
        }
    });
}






function displayShipStatsLite() {
    if (!window.location.pathname.toLowerCase().includes('shiplist')) {
        return;
    }
    const shipStatsDiv = document.getElementById('ship-stats-lite');
    if (!shipStatsDiv) {
        console.log("The 'ship-stats-lite' div does not exist on this page.");
        return;
    }
    shipStatsDiv.innerHTML = '';
    const sortedShips = ships.sort((a, b) => {
        if (sortOrder === 'type') {
            if (a.type < b.type) return -1;
            if (a.type > b.type) return 1;
        } else if (sortOrder === 'manufacturer') {
            if (a.manufacturer < b.manufacturer) return -1;
            if (a.manufacturer > b.manufacturer) return 1;
        } else if (sortOrder === 'finalCost') {
            return a.calculateTotalCost() - b.calculateTotalCost();
        }

        return 0;
    })
    

    for (const ship of sortedShips) {
        const shipDiv = document.createElement('div');
        shipDiv.className = 'ship-stats-block-lite';

        shipDiv.innerHTML = `
            <h2>${ship.name}</h2>
            <p>Type: ${ship.type}. Manufacturer: ${ship.manufacturer}. Final Cost: ₹ ${ship.calculateTotalCost().toLocaleString()}</p>
            <p>Silhouette: ${ship.silhouette}. Power Level: ${ship.calculateTotalPowerLevel()}. Hull Points: ${ship.hullPoints + ship.calculateHullPointsBoost()}. Shield and Armor Points: ${ship.shieldArmorPoints + ship.calculateShieldArmorPointsBoost()}</p>
            <p>Primary Armament: ${ship.primaryArmament}</p>
            <p>Secondary Armament 1: ${ship.secondaryArmament1}. Secondary Armament 2: ${ship.secondaryArmament2}</p>
            <p>Addons: ${ship.addons.map(addon => addon.name).join(', ')}</p>
            <p>Final Cost: ₹ ${ship.calculateTotalCost().toLocaleString()}</p>
            <p>Description: ${ship.description}</p>
        `;

        shipStatsDiv.insertBefore(shipDiv, shipStatsDiv.firstChild);
    }
}


export { ships };

