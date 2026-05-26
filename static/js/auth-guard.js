// ===============================
// ESSDEE BUSINESS ENTERPRISE
// AUTH GUARD (DASHBOARD PROTECTION)
// ===============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ===============================
// FIREBASE CONFIG (same as auth.js)
// ===============================
const firebaseConfig = {
  apiKey: "AIzaSyDN3-4-2tUJBCipzIJS7FICD5S0d1hpzMc",
  authDomain: "cymorbibleapp.firebaseapp.com",
  projectId: "cymorbibleapp",
  storageBucket: "cymorbibleapp.firebasestorage.app",
  messagingSenderId: "198388530874",
  appId: "1:198388530874:web:e7fa53972cf895b11acc83"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


// ===============================
// FULL SCREEN LOADER
// ===============================
function showGuardLoader(text = "Checking session...") {
  const loader = document.createElement("div");

  loader.id = "authGuardLoader";

  loader.innerHTML = `
    <div style="
      position:fixed;
      top:0;left:0;
      width:100%;height:100%;
      background:#050816;
      display:flex;
      flex-direction:column;
      align-items:center;
      justify-content:center;
      color:white;
      z-index:999999;
      font-family:Inter;
    ">

      <div style="
        width:60px;
        height:60px;
        border:4px solid #7c3aed;
        border-top:4px solid transparent;
        border-radius:50%;
        animation:spin 1s linear infinite;
        margin-bottom:20px;
      "></div>

      <h3>${text}</h3>

    </div>

    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  `;

  document.body.appendChild(loader);
}

function hideGuardLoader() {
  const el = document.getElementById("authGuardLoader");
  if (el) el.remove();
}


// ===============================
// MAIN PROTECTION FUNCTION
// ===============================
export function requireAuth(options = {}) {
  showGuardLoader("Verifying access...");

  const {
    redirectTo = "../auth/login.html",
    requireEmailVerified = false
  } = options;

  onAuthStateChanged(auth, async (user) => {

    if (!user) {
      hideGuardLoader();
      window.location.href = redirectTo;
      return;
    }

    // OPTIONAL: email verification check
    if (requireEmailVerified && !user.emailVerified) {
      hideGuardLoader();
      alert("Please verify your email before accessing the dashboard.");
      window.location.href = "../auth/login.html";
      return;
    }

    // Fetch Firestore user profile
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      hideGuardLoader();
      alert("User profile missing");
      await signOut(auth);
      window.location.href = redirectTo;
      return;
    }

    const userData = userSnap.data();

    // Save session globally
    localStorage.setItem("uid", user.uid);
    localStorage.setItem("businessName", userData.businessName);

    hideGuardLoader();

    console.log("Access granted:", user.email);
  });
}


// ===============================
// QUICK LOGOUT (GLOBAL USE)
// ===============================
export async function logoutUser() {
  try {
    await signOut(auth);
    localStorage.clear();
    window.location.href = "../auth/login.html";
  } catch (err) {
    alert(err.message);
  }
}
