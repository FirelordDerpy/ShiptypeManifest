import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, set, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = { databaseURL: "https://shiptypemanifest009-default-rtdb.firebaseio.com/" };
const app = initializeApp(appSettings);
const database = getDatabase(app);
const endorsementInDB = ref(database, "endorsement");

// Function to create a sentence div with like button and counter
function createSentenceDiv(text1, text2, text3, initialLikes = 0, entryRef) {
    
    const sentenceDiv = document.createElement('div');
    sentenceDiv.className = 'sentence-div'; // Sentance

    const text3Div = document.createElement('div');
    text3Div.textContent = "From " + text3;
    text3Div.className = 'text3';

    const text1Div = document.createElement('div');
    text1Div.textContent = text1;
    text1Div.className = 'text1';

    const text2Div = document.createElement('div');
    text2Div.textContent = "To " + text2;
    text2Div.className = 'text2';

    const likeButton = document.createElement('button');
    likeButton.textContent = '🖤';
    likeButton.className = 'like-button';

    const likeCounter = document.createElement('span');
    likeCounter.textContent = ` ${initialLikes}`;
    likeCounter.className = 'like-counter';

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'x';
    deleteButton.className = 'delete-button';

    likeButton.onclick = async function() {
        const newLikeCount = parseInt(likeCounter.textContent) + 1;
        likeCounter.textContent = `${newLikeCount}`;
        try {
            // Update the like count in Firebase
            await set(ref(database, `endorsement/${entryRef}/likes`), newLikeCount);
            // Play the sound
            document.getElementById('like-sound').play();
        } catch (error) {
            console.error('Error updating like count:', error.message);
        }
    };
    
    deleteButton.onclick = async function() {
        try {
            // Remove the endorsement from Firebase
            await set(ref(database, `endorsement/${entryRef}`), null);
            // Remove the sentence div from the display area
            sentenceDiv.remove();
        } catch (error) {
            console.error('Error removing endorsement:', error.message);
        }
    };

    sentenceDiv.appendChild(deleteButton);
    sentenceDiv.appendChild(text2Div);
    sentenceDiv.appendChild(text1Div);
    sentenceDiv.appendChild(text3Div);
    sentenceDiv.appendChild(likeButton);
    sentenceDiv.appendChild(likeCounter);

    return sentenceDiv;

}

// Function to load and display the saved data from Firebase
function loadAndDisplayData() {
    const displayArea = document.getElementById('display-area');
    // Listen for real-time updates with onValue
    onValue(ref(database, 'endorsement'), (snapshot) => {
        // Clear the display area before adding new items
        displayArea.innerHTML = '';
        // Use an array to collect the sentenceDivs
        const sentences = [];
        snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            const likes = data.likes || 0;
            // Create a sentenceDiv for each item
            const sentenceDiv = createSentenceDiv(data.text1, data.text2, data.text3, likes, childSnapshot.key);
            // Add the sentenceDiv to the array
            sentences.unshift(sentenceDiv); // Add to the beginning of the array
        });
        // Append each sentenceDiv to the display area, which will be in reverse order
        sentences.forEach((div) => {
            displayArea.appendChild(div);
        });
    });
}

// Call the function to load and display data when the page loads
document.addEventListener('DOMContentLoaded', loadAndDisplayData);

// Event listener for the submit button
document.getElementById('submit-btn').addEventListener('click', async function() {
    const text1 = document.getElementById('text1').value;
    const text2 = document.getElementById('text2').value;
    const text3 = document.getElementById('text3').value;
    document.getElementById('saved-sound').play();


    if (text1 && text2 && text3) {
        try {
            const newEntryRef = push(endorsementInDB);
            await set(newEntryRef, { text1, text2, text3, likes: 0 });

            // Clear the input fields after submission
            document.getElementById('text1').value = '';
            document.getElementById('text2').value = '';
            document.getElementById('text3').value = '';
            // Do not manually add the new item here, let the real-time listener handle it
        } catch (error) {
            console.error('Error saving to Firebase:', error.message);
        }
    } else {
        alert('Please fill out all fields before submitting.');
    }
});


document.getElementById('freddie-image').addEventListener('click', function() {
    document.getElementById('image-sound').play();
});


const likeSound = document.getElementById('like-sound');
likeSound.onerror = function() {
    console.error('Error loading or playing the like-sound audio file.');
};
