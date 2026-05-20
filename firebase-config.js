// ============================================================================
// 🪐 CYMOR COMMERCE ECOSYSTEM — CORE FIREBASE INTEGRATION LAYER
// Developed by: Legendary Smiley Cymor | Brand: CymorTechServices
// Architecture: Firebase Web v9+ Modular Software Development Kit
// ============================================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    GoogleAuthProvider, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// --- NATIVE CREDENTIAL CONFIGURATION MATRIX ---
const firebaseConfig = {
  apiKey: "AIzaSyDN3-4-2tUJBCipzIJS7FICD5S0d1hpzMc",
  authDomain: "cymorbibleapp.firebaseapp.com",
  databaseURL: "https://cymorbibleapp-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "cymorbibleapp",
  storageBucket: "cymorbibleapp.firebasestorage.app",
  messagingSenderId: "198388530874",
  appId: "1:198388530874:web:e7fa53972cf895b11acc83"
};

// --- INITIALIZE INSTANCE CONNECTIONS ---
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// ============================================================================
// 🔐 IDENTITY AND ACCESS SECURITY METHODS (AUTH HANDLING LAYER)
// ============================================================================

/**
 * Native Email & Password Registration Protocol
 */
export async function registerMerchantWithEmail(email, password, fullName) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Build base account structure inside Cloud Firestore
        await setDoc(doc(db, "merchants", user.uid), {
            uid: user.uid,
            fullName: fullName,
            email: email,
            createdAt: new Date().toISOString(),
            storeConfigured: false,
            metadataConfig: null
        });

        return { success: true, user };
    } catch (error) {
        console.error("Critical Registration Error Logged:", error.message);
        throw error;
    }
}

/**
 * Native Credential Verification & Log In Protocol
 */
export async function loginMerchantWithEmail(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        console.error("Access Validation Failure Protocol:", error.message);
        throw error;
    }
}

/**
 * 1-Click Federated Google Sign-In Integration 
 */
export async function authenticateWithGoogle() {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
        // Inspect if this profile has a pre-existing enterprise document layout
        const merchantDocRef = doc(db, "merchants", user.uid);
        const merchantSnapshot = await getDoc(merchantDocRef);
        
        if (!merchantSnapshot.exists()) {
            // Provision baseline schemas if account is missing
            await setDoc(merchantDocRef, {
                uid: user.uid,
                fullName: user.displayName || "Cymor Merchant",
                email: user.email,
                createdAt: new Date().toISOString(),
                storeConfigured: false,
                metadataConfig: null
            });
        }
        
        return { success: true, user };
    } catch (error) {
        console.error("Google Authentication Module Failure:", error.message);
        throw error;
    }
}

/**
 * Log Out & Active Session Dissolution Interface
 */
export async function endMerchantSession() {
    try {
        await signOut(auth);
        localStorage.removeItem("cymor_merchant_user");
        window.location.href = "login.html";
    } catch (error) {
        console.error("Session Dissolution Exception:", error.message);
    }
}

// ============================================================================
// 📦 BUSINESS ENTERPRISE STRUCTURAL CONFIGURATION DATA METADATA
// ============================================================================

/**
 * Saves completed interactive AI wizard form metadata structures to Firestore
 */
export async function saveMerchantStoreConfiguration(uid, metadataConfigObject) {
    try {
        const merchantDocRef = doc(db, "merchants", uid);
        
        // Generate uniform safe workspace path identifier slugs
        const urlSlug = metadataConfigObject.businessName
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');

        const configurationPayload = {
            storeConfigured: true,
            storeLinkSlug: urlSlug,
            metadataConfig: metadataConfigObject
        };

        await updateDoc(merchantDocRef, configurationPayload);
        
        // Synchronize data map onto parallel global route shortcuts for fast client lookups
        await setDoc(doc(db, "store_urls", urlSlug), {
            merchantUid: uid,
            businessName: metadataConfigObject.businessName
        });

        return { success: true, slug: urlSlug };
    } catch (error) {
        console.error("Data Storage Exception Ingesting Store Metadata:", error.message);
        throw error;
    }
}

/**
 * Fetches merchant workspace configurations using their URL short-links
 */
export async function getStoreBySlug(urlSlug) {
    try {
        const routeDoc = await getDoc(doc(db, "store_urls", urlSlug));
        if (!routeDoc.exists()) return null;

        const uid = routeDoc.data().merchantUid;
        const merchantDoc = await getDoc(doc(db, "merchants", uid));
        return merchantDoc.exists() ? merchantDoc.data() : null;
    } catch (error) {
        console.error("Error retrieving routing indices:", error.message);
        return null;
    }
}
