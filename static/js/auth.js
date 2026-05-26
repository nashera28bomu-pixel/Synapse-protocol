// ===============================
// ESSDEE BUSINESS ENTERPRISE
// AUTH SYSTEM (FULL SAAS VERSION)
// ===============================

// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ===============================
// CONFIG (YOU WILL EDIT THIS)
// ===============================
const firebaseConfig = {
  apiKey: "AIzaSyDN3-4-2tUJBCipzIJS7FICD5S0d1hpzMc",
  authDomain: "cymorbibleapp.firebaseapp.com",
  projectId: "cymorbibleapp",
  storageBucket: "cymorbibleapp.firebasestorage.app",
  messagingSenderId: "198388530874",
  appId: "1:198388530874:web:e7fa53972cf895b11acc83"
};


// INIT
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


// ===============================
// UI LOADING OVERLAY (FULL SCREEN)
// ===============================
function showLoader(message = "Processing...") {
  let loader = document.createElement("div");

  loader.id = "globalLoader";
  loader.innerHTML = `
    <div style="
      position:fixed;
      top:0;left:0;
      width:100%;height:100%;
      background:rgba(0,0,0,0.75);
      display:flex;
      align-items:center;
      justify-content:center;
      flex-direction:column;
      z-index:99999;
      color:white;
      font-family:Inter;
    ">
      <div style="
        width:60px;height:60px;
        border:4px solid #7c3aed;
        border-top:4px solid transparent;
        border-radius:50%;
        animation:spin 1s linear infinite;
        margin-bottom:20px;
      "></div>

      <h3>${message}</h3>
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

function hideLoader() {
  const loader = document.getElementById("globalLoader");
  if (loader) loader.remove();
}


// ===============================
// SAVE USER TO FIRESTORE
// ===============================
async function saveUser(user, extraData = {}) {
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email: user.email,
    name: user.displayName || "",
    createdAt: new Date().toISOString(),
    ...extraData
  });
}


// ===============================
// REGISTER
// ===============================
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullName = registerForm[0].value;
    const businessName = registerForm[1].value;
    const email = registerForm[2].value;
    const phone = registerForm[3].value;
    const password = registerForm[4].value;
    const confirmPassword = registerForm[5].value;

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      showLoader("Creating your account...");

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await updateProfile(user, {
        displayName: fullName
      });

      // Send email verification (future-proof SaaS)
      await sendEmailVerification(user);

      await saveUser(user, {
        fullName,
        businessName,
        phone,
        verified: false
      });

      localStorage.setItem("uid", user.uid);

      hideLoader();

      alert("Account created! Check your email for verification.");

      window.location.href = "login.html";

    } catch (err) {
      hideLoader();
      alert(err.message);
    }
  });
}


// ===============================
// LOGIN
// ===============================
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = loginForm[0].value;
    const password = loginForm[1].value;

    try {
      showLoader("Signing you in...");

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // Get Firestore profile
      const userSnap = await getDoc(doc(db, "users", user.uid));

      if (!userSnap.exists()) {
        throw new Error("User profile not found");
      }

      const userData = userSnap.data();

      localStorage.setItem("uid", user.uid);
      localStorage.setItem("businessName", userData.businessName);

      hideLoader();

      // Optional verification check
      if (!user.emailVerified) {
        alert("Please verify your email before continuing.");
        return;
      }

      window.location.href = "../dashboard/dashboard.html";

    } catch (err) {
      hideLoader();
      alert(err.message);
    }
  });
}


// ===============================
// AUTO LOGIN CHECK (SESSION PERSISTENCE)
// ===============================
onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  // If user is already logged in and on login page
  if (window.location.pathname.includes("login.html")) {
    window.location.href = "../dashboard/dashboard.html";
  }

  // If user is not verified (optional enforcement)
  if (user && !user.emailVerified) {
    console.log("User not verified yet");
  }
});


// ===============================
// LOGOUT SYSTEM (GLOBAL)
// ===============================
export async function logout() {
  try {
    showLoader("Logging you out...");

    await signOut(auth);

    localStorage.clear();

    hideLoader();

    window.location.href = "../auth/login.html";

  } catch (err) {
    hideLoader();
    alert(err.message);
  }
}


// ===============================
// ROUTE PROTECTION (USE IN DASHBOARD)
// ===============================
export function protectRoute() {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = "../auth/login.html";
    }
  });
                     }
