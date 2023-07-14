import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
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

document.getElementById('consentYes').addEventListener('click', function() {
    localStorage.setItem('consent', 'yes');
    window.location.href = 'game.html';
});

document.getElementById('consentNo').addEventListener('click', function() {
    localStorage.setItem('consent', 'no');
    alert('Sorry, you cannot play the game without giving consent.');
});
