// firebaseConfig.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, set, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const firebaseConfig = {
  // apiKey: "your-api-key", // replace with your API key
  // authDomain: "your-auth-domain", // replace with your Auth domain
  databaseURL: "https://shiptypemanifest009-default-rtdb.firebaseio.com/",
  projectId: "shiptypemanifest009", // replace with your Project ID
  // storageBucket: "your-storage-bucket", // replace with your Storage bucket
  // messagingSenderId: "your-messaging-sender-id", // replace with your Messaging Sender ID
  // appId: "your-app-id" // replace with your App ID
};


const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { app, db, push, onValue, remove };
