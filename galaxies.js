import { getDatabase, ref, set, get } from '/firebaseConfig.js';

function addGalaxy() {
  console.log("Add Galaxy button clicked!");

  var galaxyName = prompt("Please enter the galaxy name:");
  if (galaxyName != null) {
    // Save the galaxy to the Firebase Realtime Database
    const db = getDatabase();
    const galaxyRef = ref(db, 'galaxies/' + galaxyName);
    set(galaxyRef, {
      name: galaxyName
    }).then(() => {
      // After the galaxy is saved, read it from Firebase and display it
      get(galaxyRef).then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          displayGalaxy(data.name);
        }
      });
    });
  }
}

function displayGalaxy(galaxyName) {
  // Add the galaxy to the dropdown list
  var select = document.getElementById('galaxiesList');
  var option = document.createElement("option");
  option.value = galaxyName;
  option.text = galaxyName;
  select.appendChild(option);
}

// Add the event listener
document.getElementById('addGalaxyButton').addEventListener('click', addGalaxy);

if (window.location.pathname.toLowerCase().includes('galaxies')) {
  // Load and display all galaxies from Firebase when the page loads
  window.addEventListener('load', function() {
    const db = getDatabase();
    const galaxiesRef = ref(db, 'galaxies');
    get(galaxiesRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        for (let galaxyName in data) {
          displayGalaxy(galaxyName);
        }
      }
    });
  });
}
