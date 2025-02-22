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

let lastOnlineCheck = Date.now();
const logoutTimeout = 10 * 60 * 1000; // 10 minutes

// Check if user is online or offline
function checkNetworkStatus() {
    if (!navigator.onLine) {
        document.getElementById("offlineMessage").style.display = "block";
        setTimeout(() => {
            window.location.href = "account.html";
        }, 3000);
    }
}

// Auto logout if offline for 10 minutes
setInterval(() => {
    if (!navigator.onLine) {
        if (Date.now() - lastOnlineCheck > logoutTimeout) {
            alert("You have been logged out due to inactivity.");
            window.location.href = "index.html";
        }
    } else {
        lastOnlineCheck = Date.now();
    }
}, 60000); // Check every minute

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
                    errorMessage.innerHTML = "Your login code has expired. <br> Please <a href='https://wa.me/2348116788630?text=I%20need%20help%20with%20your%20petroleum%20calculator' style='color: blue;'>renew by clicking here</a>.";
                    return;
                }
            }

            alert("Login successful!");
            window.location.href = "account.html"; // Redirect to account page
        } else {
            errorMessage.innerHTML = "Incorrect login code or PIN. <br> If you forgot, <a href='https://wa.me/2348116788630?text=I%20need%20help%20with%20my%20login' style='color: blue;'>click here for help</a>.";
        }
    } catch (error) {
        errorMessage.textContent = "Please programmer update the code.";
        console.error("Error logging in:", error);
    }
});

// Run network check when the page loads
window.addEventListener("load", checkNetworkStatus);
