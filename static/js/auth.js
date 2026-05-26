// ===============================
// ESSDEE BUSINESS ENTERPRISE
// AUTH SYSTEM (FULL SAAS VERSION)
// Developed by Legendary Smiley Cymor & David the Developer
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
// FIREBASE CONFIG
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
// LOADER UI
// ===============================
function showLoader(message = "Processing...") {
  const loader = document.createElement("div");
  loader.id = "globalLoader";

  loader.innerHTML = `
    <div style="
      position:fixed;
      inset:0;
      background:rgba(0,0,0,0.75);
      display:flex;
      flex-direction:column;
      align-items:center;
      justify-content:center;
      z-index:99999;
      color:white;
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
  document.getElementById("globalLoader")?.remove();
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
    developerSignature: "Legendary Smiley Cymor & David the Developer",
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

      // Set display name with branding tag (soft identity layer)
      await updateProfile(user, {
        displayName: `${fullName} | EssDee User`
      });

      // IMPORTANT: ensure auth state is ready
      await auth.currentUser.reload();

      // SEND VERIFICATION EMAIL (FIXED RELIABLE METHOD)
      await sendEmailVerification(auth.currentUser, {
        url: window.location.origin + "/auth/login.html"
      });

      await saveUser(user, {
        fullName,
        businessName,
        phone,
        verified: false
      });

      localStorage.setItem("uid", user.uid);

      hideLoader();

      alert(
        "Account created successfully!\n\nCheck your email inbox or spam folder to verify your account.\n\nDevelopers: Legendary Smiley Cymor & David the Developer"
      );

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

      const userSnap = await getDoc(doc(db, "users", user.uid));

      if (!userSnap.exists()) {
        throw new Error("User profile not found");
      }

      const userData = userSnap.data();

      if (!user.emailVerified) {
        await signOut(auth);
        hideLoader();

        alert("Please verify your email before continuing.");
        return;
      }

      localStorage.setItem("uid", user.uid);
      localStorage.setItem("businessName", userData.businessName);

      hideLoader();

      window.location.href = "../dashboard/dashboard.html";

    } catch (err) {
      hideLoader();
      alert(err.message);
    }
  });
}


// ===============================
// AUTO SESSION CHECK
// ===============================
onAuthStateChanged(auth, (user) => {
  if (!user) return;

  if (window.location.pathname.includes("login.html")) {
    window.location.href = "../dashboard/dashboard.html";
  }
});


// ===============================
// LOGOUT
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
// ROUTE PROTECTION
// ===============================
export function protectRoute() {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = "../auth/login.html";
    }
  });
}
