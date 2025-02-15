// Firebase configuration and initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCkMWK3sXh0KpwQffTaDHXkeEWXTPmG2wE",
    authDomain: "dani-petroleum-calculator.firebaseapp.com",
    projectId: "dani-petroleum-calculator",
    storageBucket: "dani-petroleum-calculator.firebasestorage.app",
    messagingSenderId: "1037656178170",
    appId: "1:1037656178170:web:5bebb90857d54bf3dd7843"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

// Inactivity and usage timers
let inactivityTime = function () {
    let timer;
    window.onload = resetTimer;
    document.onmousemove = resetTimer;
    document.onkeypress = resetTimer;

    function logout() {
        alert("You are now logged out due to inactivity.");
        signOut(auth).then(() => {
            window.location.href = "login.html";
        }).catch(console.error);
        localStorage.clear(); // Clear local storage on logout
    }

    function resetTimer() {
        clearTimeout(timer);
        timer = setTimeout(logout, 600000); // 10 minutes
    }
};

inactivityTime();

let startTime = new Date().getTime();
setInterval(() => {
    let currentTime = new Date().getTime();
    if (currentTime - startTime >= 7200000) { // 2 hours
        alert("You have been logged out after 2 hours of usage.");
        signOut(auth).then(() => {
            window.location.href = "login.html";
        }).catch(console.error);
        localStorage.clear(); // Clear local storage on logout
    }
}, 1000);

// Sync data when online
window.addEventListener('online', syncData);
window.addEventListener('offline', saveData);

function saveData() {
    const formData = {
        openMiter: document.getElementById('openMiter').value,
        closeMiter: document.getElementById('closeMiter').value,
        pricePerLitter: document.getElementById('pricePerLitter').value,
        expensive: document.getElementById('expensive').value,
        posTransaction: document.getElementById('posTransaction').value,
        totalCashRemitted: document.getElementById('totalCashRemitted').value,
        moneyAtHand: document.getElementById('moneyAtHand').value,
    };
    localStorage.setItem('petroleumCalculatorData', JSON.stringify(formData));
}

function syncData() {
    const savedData = localStorage.getItem('petroleumCalculatorData');
    if (savedData) {
        const formData = JSON.parse(savedData);
        document.getElementById('openMiter').value = formData.openMiter;
        document.getElementById('closeMiter').value = formData.closeMiter;
        document.getElementById('pricePerLitter').value = formData.pricePerLitter;
        document.getElementById('expensive').value = formData.expensive;
        document.getElementById('posTransaction').value = formData.posTransaction;
        document.getElementById('totalCashRemitted').value = formData.totalCashRemitted;
        document.getElementById('moneyAtHand').value = formData.moneyAtHand;
        localStorage.removeItem('petroleumCalculatorData'); // Clear saved data after syncing
    }
}

// Utility functions
function formatCurrency(input) {
    let value = input.value.replace(/[^0-9]/g, '');
    input.value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function parseCurrency(value) {
    return parseFloat(value.replace(/,/g, '') || 0);
}

function addAmount(id) {
    const inputField = document.getElementById(id);
    const addField = document.getElementById(id + 'Add');
    const currentValue = parseCurrency(inputField.value);
    const addValue = parseFloat(addField.value) || 0;
    inputField.value = (currentValue + addValue).toFixed(2);
    addField.value = ''; // Clear the add field
}

function subtractAmount(id) {
    const inputField = document.getElementById(id);
    const addField = document.getElementById(id + 'Add');
    const currentValue = parseCurrency(inputField.value);
    const addValue = parseFloat(addField.value) || 0;
    inputField.value = (currentValue - addValue).toFixed(2);
    addField.value = ''; // Clear the add field
}

function calculate() {
    const openMiter = parseCurrency(document.getElementById('openMiter').value);
    const closeMiter = parseCurrency(document.getElementById('closeMiter').value);
    const pricePerLitter = parseCurrency(document.getElementById('pricePerLitter').value);
    const expensive = parseCurrency(document.getElementById('expensive').value);
    const posTransaction = parseCurrency(document.getElementById('posTransaction').value);
    const totalCashRemitted = parseCurrency(document.getElementById('totalCashRemitted').value);
    const moneyAtHand = parseCurrency(document.getElementById('moneyAtHand').value);

    const litersSold = closeMiter - openMiter;
    const totalSales = litersSold * pricePerLitter;
    const expectedMoney = totalSales;
    const actualMoney = expensive + totalCashRemitted + posTransaction + moneyAtHand;
    const balance = actualMoney - expectedMoney;

    document.getElementById('litersSold').innerText = `Total Liters Sold: ${litersSold.toFixed(2)} L`;
    document.getElementById('expectedMoney').innerText = `Expected Money: ₦${expectedMoney.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

    const balanceMessage = document.getElementById('balanceMessage');
    if (balance === 0) {
        balanceMessage.innerText = `Bro, I confirmed that your account is balanced. No profit, no loss. This is your total expected amount: ₦${expectedMoney.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
        balanceMessage.classList.remove('text-green-500', 'text-red-500');
        balanceMessage.classList.add('text-blue-500');
    } else if (balance < 0) {
        balanceMessage.innerText = `Wahala dey, your account no balance. Shortage of ₦${Math.abs(balance).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
        balanceMessage.classList.remove('text-green-500', 'text-blue-500');
        balanceMessage.classList.add('text-red-500');
    } else {
        balanceMessage.innerText = `My gee, you got an excess profit of ₦${balance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
        balanceMessage.classList.remove('text-red-500', 'text-blue-500');
        balanceMessage.classList.add('text-green-500');
    }

    const totalBalance = expensive + posTransaction + totalCashRemitted + moneyAtHand;
    document.getElementById('totalBalance').innerText = `Total Balance: ₦${totalBalance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

    const detailedBalances = `
        <p>Expenses: ₦${expensive.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
        <p>POS Transactions: ₦${posTransaction.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
        <p>Total Cash Remitted: ₦${totalCashRemitted.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
        <p>Money at Hand: ₦${moneyAtHand.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
    `;
    document.getElementById('detailedBalances').innerHTML = detailedBalances;

    document.getElementById('result').classList.remove('hidden');
}