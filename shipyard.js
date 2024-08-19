import { app, db, push,} from '/firebaseConfig.js';
import { ships } from '/index.js';
import { getDatabase, set, ref, onValue, get } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";



// TO REPLACE 
let buildTimeModifier = 1.5;

// TO REPLACE 


let isEventListenerAdded = false;


//SHIP DROP DOWN

// Create a dropdown for ship selection
function createShipDropdown() {
    const shipDropdown = document.createElement('select');
    shipDropdown.id = 'ship-dropdown';
    
    const placeholderOption = document.createElement('option');
    placeholderOption.value = '';
    placeholderOption.text = 'Choose a ship';
    placeholderOption.selected = true;
    placeholderOption.disabled = true;
    shipDropdown.appendChild(placeholderOption);

    // Append the dropdown to the specific div
    const shipDropdownContainer = document.getElementById('ship-dropdown-container');
    shipDropdownContainer.appendChild(shipDropdown);

    // Create a number input for the quantity
    const quantityInput = document.createElement('input');
    quantityInput.id = 'ship-quantity';
    quantityInput.type = 'number';
    quantityInput.min = '1';
    quantityInput.value = '1';

    // Append the number input to the specific div
    const shipQuantityContainer = document.getElementById('ship-quantity-container');
    shipQuantityContainer.appendChild(quantityInput);

    // Create a "Build ship" button
    const buildButton = document.createElement('button');
    buildButton.id = 'build-button';
    buildButton.textContent = 'Build ship';

    // Append the "Build ship" button to the specific div
    const buildButtonContainer = document.getElementById('build-button-container');
    buildButtonContainer.appendChild(buildButton);

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
        if (!isEventListenerAdded) {  // Check if the event listener has already been added
        shipDropdown.addEventListener('change', function() {
            displaySelectedShipStats(this.value, quantityInput.value);
        });
        quantityInput.addEventListener('input', function() {
            displaySelectedShipStats(shipDropdown.value, this.value);
        });
        buildButton.addEventListener('click', function() {
            
            buildQue(shipDropdown.value, quantityInput.value);
        });
        isEventListenerAdded = true;  // Set the flag to true after adding the event listener
        
    }
}

//CLIENT CLIENT


async function createClientDropdown() {
    const clientDropdown = document.getElementById('client-dropdown');
    
    // If the dropdown already exists, remove it
    if (clientDropdown) {
        clientDropdown.remove();
    }

    // Create a new dropdown
    const newClientDropdown = document.createElement('select');
    newClientDropdown.id = 'client-dropdown';
    
    const placeholderOption = document.createElement('option');
    placeholderOption.value = '';
    placeholderOption.text = 'Choose a client';
    placeholderOption.selected = true;
    placeholderOption.disabled = true;
    newClientDropdown.appendChild(placeholderOption);

    // Append the dropdown to the specific div
    const clientDropdownContainer = document.getElementById('client-dropdown-container');
    clientDropdownContainer.appendChild(newClientDropdown);

    // Fetch clients from Firebase
    const clientsRef = ref(db, 'factions/clients');
    const snapshot = await get(clientsRef);
    const clients = snapshot.val();
    for (const key in clients) {
        const clientName = clients[key].name;
        const option = document.createElement('option');
        option.value = key;  // Store the client's key as the option value
        option.text = clientName;
        newClientDropdown.appendChild(option);
    }

    // Add an event listener to display the client's credits when a client is selected
    newClientDropdown.addEventListener('change', function() {
        displayClientCredits(this.value);
    });
}



function displayClientCredits(clientKey) {
    // Fetch the client's credits from Firebase
    const clientRef = ref(db, `factions/clients/${clientKey}`);
    onValue(clientRef, (snapshot) => {
        const client = snapshot.val();
        const clientCredits = client.credits;

        // Display the client's credits
        const clientCreditsDiv = document.getElementById('client-credits');
        clientCreditsDiv.textContent = `Client's credits: ₹ ${clientCredits.toLocaleString()}`;
    });
}

//CLIENT CLIENT



function displaySelectedShipStats(shipName, quantity) {
    const selectedShip = ships.find(ship => ship.name === shipName);
    const clientDropdown = document.getElementById('client-dropdown');
    const selectedClient = clientDropdown.value;

    if (selectedShip) {
        // Clear the old stats
        const oldStats = document.getElementById('ship-details');
        if (oldStats) {
            oldStats.remove();
        }

        // Calculate the build time based on the power level and the build time modifier
        let buildTime = selectedShip.calculateTotalPowerLevel() * buildTimeModifier * 1000;
        buildTime = buildTime.toFixed(1);

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
        const shipDetailsContainer = document.getElementById('ship-details-container');
        shipDetailsContainer.appendChild(shipStats);
    }
}








const buildInfoDiv = document.createElement('div');

async function buildQue(shipName, quantity) {
    const clientDropdown = document.getElementById('client-dropdown');
    const selectedClientKey = clientDropdown.value;
    const selectedShip = ships.find(ship => ship.name === shipName);
    if (selectedShip) {
        // Calculate the build time and cost

        const buildTime = selectedShip.calculateTotalPowerLevel() * buildTimeModifier;
        const totalCost = selectedShip.calculateTotalCost() * quantity;
        
        const clientRef = ref(db, `factions/clients/${selectedClientKey}`);
        const snapshot = await get(clientRef);
        const client = snapshot.val();
        let clientCredits = client.credits;

        // Check if the client has enough credits
        if (clientCredits >= totalCost) {
            clientCredits -= totalCost;
            set(clientRef, { ...client, credits: clientCredits });
            
            const startTime = new Date();
            const startTimeString = startTime.toLocaleString();
            const endTime = new Date(Date.now() + buildTime * 1000);
            const endTimeString = endTime.toLocaleString();

            // Create the build information
            const buildInfo = {
                shipName: shipName,
                quantity: quantity,
                totalCost: totalCost,
                startTime: startTimeString,
                endTime: endTimeString,
                client: client.name
            };

            // Save the build information to Firebase under the "genShipYard" folder
            const buildQueueRef = ref(db, 'genShipYard/buildQueue');
            const newBuildInfoRef = push(buildQueueRef);
            set(newBuildInfoRef, buildInfo);

            // Append the build information to the build queue div
            const buildQueueContainer = document.getElementById('build-queue-container');
            if (!buildQueueContainer.contains(buildInfoDiv)) {
                buildQueueContainer.appendChild(buildInfoDiv);
            }

            // Create a countdown timer
            const timer = setInterval(function() {
                const now = new Date();
                const timeLeft = (endTime - now) / 1000;
            }, 1000);  // Update every 100 milliseconds
            bldaudio.play();

        } else {
            console.log("Not enough credits!");
            window.nocash1.play();
            alert("Not enough credits!");
        }
    }
}


let loadBuildQueueInterval;

function loadBuildQueue() {
    if (loadBuildQueueInterval) {
        clearInterval(loadBuildQueueInterval);
    }
    // Load the build queue from Firebase
    const buildQueueRef = ref(db, 'genShipYard/buildQueue');
    onValue(buildQueueRef, (snapshot) => {
        const buildQueue = snapshot.val();
        if (buildQueue) {
            const buildQueueContainer = document.getElementById('build-queue-container');

           buildQueueContainer.innerHTML = '';

            for (const [key, buildInfo] of Object.entries(buildQueue)) {
                let timeLeft = 0;

                
                // Create a div for the build information
                const buildInfoDiv = document.createElement('div');
                buildInfoDiv.className = 'build-info';

                // Create a div for the build status text
                const statusDiv = document.createElement('div');
                buildInfoDiv.appendChild(statusDiv);

                // Check if the build process is already completed
                const now = new Date();
                const endTime = new Date(buildInfo.endTime);
                    if (now < endTime) {
                    // UNDER CONSTRUCTION
                    statusDiv.textContent = `Building ${buildInfo.quantity} ${buildInfo.shipName}(s) for ${buildInfo.client} will cost ₹ ${buildInfo.totalCost.toLocaleString()}. Status: Under Construction. Ready for delivery at: ${buildInfo.endTime}`;
                    } else {
                    // COMPLETE PLACEHOLDER
                    statusDiv.textContent = `Building ${buildInfo.quantity} ${buildInfo.shipName}(s) for ${buildInfo.client} cost ₹ ${buildInfo.totalCost.toLocaleString()}. Status: Ready for Delivery. Ready for delivery at: ${buildInfo.endTime}`;
                    }
                    
                    let audioPlayed = false;
                    const timer = setInterval(function() {
                    const now = new Date();
                    const timeLeft = Math.round((endTime - now) / 100) / 10;  // Get the time left in tenths of a second
                    if (timeLeft <= 0) {
                        clearInterval(timer);
                        // COMPLETED
                        statusDiv.textContent = `Building ${buildInfo.quantity} ${buildInfo.shipName}(s) for ${buildInfo.client} cost ₹ ${buildInfo.totalCost.toLocaleString()}. Status: Ready for Delivery. Ready for delivery at: ${buildInfo.endTime}`;
                    } else if (timeLeft <= .12 && timeLeft > 0.01) {
                        // PLAY AUDIO
                        //const completeAudio = new Audio('/assets/complete.wav');
                        completeAudio.play();
                        audioPlayed = true;
                    } else {
                        // UNDER CONSTRUCTION
                        statusDiv.textContent = `Building ${buildInfo.quantity} ${buildInfo.shipName}(s) for ${buildInfo.client} will cost ₹ ${buildInfo.totalCost.toLocaleString()}. Status: Under Construction (${timeLeft.toFixed(1)} seconds left). Ready for delivery at: ${buildInfo.endTime}`;
                    }
                }, 100);


                

                        // Progress Bar
                        const progressBar = document.createElement('progress');
                        progressBar.className = 'progress-bar';
                        progressBar.max = endTime.getTime() - new Date(buildInfo.startTime).getTime();
                        progressBar.value = now.getTime() - new Date(buildInfo.startTime).getTime();
                        buildInfoDiv.appendChild(progressBar);
                        
                        // Create a cancel button
                        const cancelButton = document.createElement('button');
                        cancelButton.textContent = 'Cancel';
                        cancelButton.className = 'shipBtn';
                        cancelButton.addEventListener('click', function() {
                            cancelAudio.play();
                            const buildInfoRef = ref(db, `genShipYard/buildQueue/${key}`);
                            set(buildInfoRef, null);
                            buildInfoDiv.remove();
                            clearInterval(timer);
                        });
                        buildInfoDiv.appendChild(cancelButton);

                        // Create a "Deliver" button
                        const deliverButton = document.createElement('button');
                        deliverButton.textContent = 'Deliver';
                        deliverButton.className = 'shipBtn';
                        deliverButton.addEventListener('click', function() {
                            deliverAudio.play();
                        });
                        buildInfoDiv.appendChild(deliverButton);
                        buildQueueContainer.appendChild(buildInfoDiv);
                        
                    const dateTimeDiv = document.createElement('div');
                    dateTimeDiv.id = 'date-time';
                    document.body.appendChild(dateTimeDiv);

                    // Update the time
                    updateTime();
                    setInterval(updateTime, 1000);
                    }

            }
        });
        loadBuildQueueInterval = setInterval(loadBuildQueue, 1000);
};




window.onload = function() {
    if (window.location.pathname.toLowerCase().includes('shipyards')) {
        createShipDropdown();
        loadBuildQueue();
        createClientDropdown();
    }
};


// Function to update the time 

function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    const dateString = now.toLocaleDateString();
    const dateTimeDiv = document.getElementById('date-time');
    dateTimeDiv.textContent = `Date: ${dateString}, Time: ${timeString}`;
}




