import { getFirestore } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyD7Q-WC58L-ifvlntZbinIbl_IZo6CCQDg",
    authDomain: "space-invaders-c6750.firebaseapp.com",
    projectId: "space-invaders-c6750",
    storageBucket: "space-invaders-c6750.appspot.com",
    messagingSenderId: "427485840519",
    appId: "1:427485840519:web:382cf58f355b4911aea422",
    measurementId: "G-FKECXYV7VY"
};

const app = initializeApp(firebaseConfig);
window.db = getFirestore(app);

document.getElementById('score').innerText = localStorage.getItem('score');

document.getElementById('submit').addEventListener('click', async function() {
    let username = document.getElementById('username').value;

    // Check for empty username
    if (username.length === 0) {
        alert('Please enter a username.');
        return;
    }

    // Check for valid username (letters and numbers only)
    let usernameRegex = /^[a-zA-Z0-9]+$/;
    if (!usernameRegex.test(username)) {
        alert('Username can only contain letters and numbers.');
        return;
    }

    // Check for duplicate username
    let duplicateUser = false;
    await db.collection("scores")
        .where('username', '==', username)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                duplicateUser = true;
            });
        });

    if (duplicateUser) {
        alert('Username already exists. Please choose a different one.');
        return;
    }

    // Store the score
    db.collection("scores").add({
        username: username,
        score: parseInt(localStorage.getItem('score'))
    })
    .then((docRef) => {
        console.log("Score written with ID: ", docRef.id);
        window.location.href = 'scoreboard.html';
    })
    .catch((error) => {
        console.error("Error adding score: ", error);
    });
});
