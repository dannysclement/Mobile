import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCkMWK3sXh0KpwQffTaDHXkeEWXTPmG2wE",
    authDomain: "dani-petroleum-calculator.firebaseapp.com",
    projectId: "dani-petroleum-calculator",
    storageBucket: "dani-petroleum-calculator.firebasestorage.app",
    messagingSenderId: "1037656178170",
    appId: "1:1037656178170:web:5bebb90857d54bf3dd7843"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    let loginCode = document.getElementById("loginCode").value;
    let pin = document.getElementById("pin").value;
    let errorMessage = document.getElementById("errorMessage");

    try {
        // Query Firestore to find the user
        const q = query(collection(db, "users"), where("loginCode", "==", loginCode), where("pin", "==", pin));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            let userData;
            querySnapshot.forEach((doc) => {
                userData = doc.data();
            });

            if (userData.expiryDate) {
                const expiryDate = new Date(userData.expiryDate);
                const currentDate = new Date();

                if (currentDate > expiryDate) {
                    errorMessage.textContent = "Your login code has expired. Please renew by clicking 'Need Help'.";
                    return;
                }
            }

            alert("Login successful!");
            window.location.href = "account.html"; // Redirect to account page
        } else {
            errorMessage.textContent = "Invalid login code or PIN.";
        }
    } catch (error) {
        errorMessage.textContent = "Please programmer update the code.";
        console.error("Error logging in:", error);
    }
});
