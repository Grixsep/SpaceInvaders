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
const db = getFirestore(app);

db.collection("scores").orderBy("score", "desc").limit(10).get()
.then((querySnapshot) => {
    let scoresElement = document.getElementById('scores');
    querySnapshot.forEach((doc) => {
        let li = document.createElement('li');
        li.innerText = doc.data().username + ': ' + doc.data().score;
        scoresElement.appendChild(li);
    });
})
.catch((error) => {
    console.error("Error getting scores: ", error);
});