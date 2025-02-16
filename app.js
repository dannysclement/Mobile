// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

// Your web app's Firebase configuration
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
const auth = getAuth();
const db = getFirestore(app);

document.getElementById('signUpForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const firstName = document.getElementById('firstName').value;
    const middleName = document.getElementById('middleName').value;
    const surname = document.getElementById('surname').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const email = document.getElementById('email').value;
    const dob = document.getElementById('dob').value;
    const nin = document.getElementById('nin').value;
    const bvn = document.getElementById('bvn').value;
    const pin = document.getElementById('pin').value;
    const loginCode = document.getElementById('loginCode').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (newPassword !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, newPassword);
        const user = userCredential.user;
        
        await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            firstName,
            middleName,
            surname,
            phoneNumber,
            email,
            dob,
            nin,
            bvn,
            pin,
            loginCode
        });
        
        alert('User created successfully!');
    } catch (error) {
        console.error('Error creating user:', error);
        alert('Error creating user: ' + error.message);
    }
});