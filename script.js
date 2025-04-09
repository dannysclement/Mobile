<script type="module">
  // Import Firebase SDKs
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

  // Voice function (lady voice)
  function speak(message) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(message);
    const voices = synth.getVoices().filter(v =>
      v.name.toLowerCase().includes("female") ||
      v.name.toLowerCase().includes("woman") ||
      v.name.toLowerCase().includes("google") ||
      v.name.toLowerCase().includes("samantha")
    );
    if (voices.length > 0) {
      utterance.voice = voices[0];
    }
    utterance.pitch = 1;
    utterance.rate = 1;
    synth.speak(utterance);
  }

  // Auto greeting on page load
  function greetUser() {
    const greeting = "Greetings, you're welcome to Danny S Clement mobi Calculator.";
    speak(greeting);
  }

  // Offline check
  function checkNetworkStatus() {
    if (!navigator.onLine) {
      const message = "You are offline. Redirecting you to your account page.";
      document.getElementById("offlineMessage").style.display = "block";
      speak(message);
      setTimeout(() => {
        window.location.href = "account.html";
      }, 3000);
    }
  }

  // Auto logout if offline for too long
  let lastOnlineCheck = Date.now();
  const logoutTimeout = 10 * 60 * 1000; // 10 minutes

  setInterval(() => {
    if (!navigator.onLine) {
      if (Date.now() - lastOnlineCheck > logoutTimeout) {
        const msg = "You have been logged out due to inactivity.";
        alert(msg);
        speak(msg);
        window.location.href = "index.html";
      }
    } else {
      lastOnlineCheck = Date.now();
    }
  }, 60000); // Every 60s

  // Login form submit handler
  document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    let loginCode = document.getElementById("loginCode").value;
    let pin = document.getElementById("pin").value;
    let errorMessage = document.getElementById("errorMessage");

    try {
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
            const msg = "Your login code has expired. Please renew by clicking the WhatsApp link.";
            errorMessage.innerHTML = "Your login code has expired. <br> Please <a href='https://wa.me/2348116788630?text=I%20need%20help%20with%20your%20petroleum%20calculator' style='color: blue;'>renew by clicking here</a>.";
            speak(msg);
            return;
          }
        }

        const successMsg = "Login successful. Redirecting to your account.";
        alert(successMsg);
        speak(successMsg);
        window.location.href = "account.html";
      } else {
        const failMsg = "Incorrect login code or pin. Please try again or contact support.";
        errorMessage.innerHTML = "Incorrect login code or PIN. <br> If you forgot, <a href='https://wa.me/2348116788630?text=I%20need%20help%20with%20my%20login' style='color: blue;'>click here for help</a>.";
        speak(failMsg);
      }
    } catch (error) {
      const msg = "There was an error. Please contact the programmer to update the code.";
      errorMessage.textContent = msg;
      speak(msg);
      console.error("Error logging in:", error);
    }
  });

  // Run greeting and offline check on load
  window.addEventListener("load", () => {
    // Wait for voices to load
    window.speechSynthesis.onvoiceschanged = () => {
      greetUser();
    };
    checkNetworkStatus();
  });
</script>
