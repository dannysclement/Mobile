<script type="module">
  // Import the Firebase SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
  import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

  // Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyA8fClsCgQphHEGa1eLFZVp-_FtRpl5TqM",
    authDomain: "poised-eye-447618-q9.firebaseapp.com",
    projectId: "poised-eye-447618-q9",
    storageBucket: "poised-eye-447618-q9.firebasestorage.app",
    messagingSenderId: "952211645345",
    appId: "1:952211645345:web:5af6041c9291a3c0a2a1e0",
    measurementId: "G-CEW2Q9YLW8"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
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
      const q = query(
        collection(db, "users"),
        where("loginCode", "==", loginCode),
        where("pin", "==", pin)
      );
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
</script>
