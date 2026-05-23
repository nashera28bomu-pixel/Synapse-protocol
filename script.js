/* =========================================================
   🚀 CYMOR ENTERPRISE FRONTEND ENGINE - FINAL BUILD
========================================================= */

/* =========================================================
   🔥 FIREBASE CONFIG
========================================================= */

const firebaseConfig = {
    apiKey: "AIzaSyDN3-4-2tUJBCipzIJS7FICD5S0d1hpzMc",
    authDomain: "cymorbibleapp.firebaseapp.com",
    projectId: "cymorbibleapp",
    storageBucket: "cymorbibleapp.firebasestorage.app",
    messagingSenderId: "198388530874",
    appId: "1:198388530874:web:e7fa53972cf895b11acc83"
};

/* =========================================================
   🔥 INITIALIZE FIREBASE
========================================================= */

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

/* =========================================================
   📦 DOM ELEMENTS
========================================================= */

const businessForm = document.getElementById('businessForm');
const submitBtn = document.querySelector('button[type="submit"]');
const csvInput = document.getElementById('csvFile');

/* =========================================================
   🎨 TOAST NOTIFICATION SYSTEM
========================================================= */

function showToast(message, type = 'success') {
    const toast = document.createElement('div');

    toast.className = `
        fixed top-6 right-6 z-50
        px-6 py-4 rounded-2xl
        text-white font-semibold
        shadow-2xl transition-all duration-500
        translate-y-[-30px] opacity-0
    `;

    if (type === 'success') toast.classList.add('bg-green-600');
    if (type === 'error') toast.classList.add('bg-red-600');
    if (type === 'info') toast.classList.add('bg-blue-600');

    toast.innerHTML = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.remove('translate-y-[-30px]', 'opacity-0');
    }, 100);

    setTimeout(() => {
        toast.classList.add('opacity-0');
        setTimeout(() => toast.remove(), 500);
    }, 3500);
}

/* =========================================================
   🧹 CLEAN PRODUCT DATA
========================================================= */

function cleanProducts(products = []) {
    return products
        .map(product => ({
            id: crypto.randomUUID(),
            name: String(
                product.name ||
                product.product ||
                product.title ||
                'Unnamed Product'
            ).trim(),

            price: Number(
                product.price ||
                product.cost ||
                0
            ),

            description: String(
                product.description || ''
            ).trim(),

            emoji: product.emoji || '🛒',
            inStock: true
        }))
        .filter(p => p.name && p.price > 0);
}

/* =========================================================
   📄 PARSE CSV FILE
========================================================= */

function parseCSV(file) {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: results => resolve(results.data),
            error: err => reject(err)
        });
    });
}

/* =========================================================
   ⏳ LOADING STATE
========================================================= */

function setLoading(isLoading = false) {
    if (!submitBtn) return;

    if (isLoading) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <div class="flex items-center justify-center gap-3">
                <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating Your AI Bot...</span>
            </div>
        `;
    } else {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '🚀 Generate My AI Bot';
    }
}

/* =========================================================
   💾 SAVE BUSINESS
========================================================= */

async function saveBusiness(data) {
    return await db.collection('businesses').add(data);
}

/* =========================================================
   🌍 DEPLOY BOT
========================================================= */

async function deployBot(businessId, businessName) {
    try {
        const response = await fetch('/api/deploy-bot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                businessId,
                bizName: businessName
            })
        });

        return await response.json();
    } catch (error) {
        console.error('Deployment Error:', error);
        return { success: false };
    }
}

/* =========================================================
   📤 FORM SUBMIT HANDLER (UPDATED CORE LOGIC)
========================================================= */

if (businessForm) {
    businessForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            /* =============================
               GET FORM VALUES
            ============================== */

            const businessName = document.getElementById('bizName').value.trim();
            const whatsappNumber = document.getElementById('bizPhone').value.trim();
            const bizDesc = document.getElementById('bizDesc')?.value.trim() || '';
            const paymentInfo = document.getElementById('paymentInfo').value.trim();
            const deliveryAreas = document.getElementById('deliveryAreas')?.value.trim() || '';
            const botTone = document.getElementById('botTone')?.value || 'friendly';

            const csvFile = csvInput.files[0];

            /* =============================
               VALIDATION
            ============================== */

            if (!businessName) throw new Error('Business name is required');
            if (!whatsappNumber) throw new Error('WhatsApp number is required');
            if (!csvFile) throw new Error('Please upload your product CSV file');

            /* =============================
               PROCESS PRODUCTS
            ============================== */

            showToast('📦 Processing products...', 'info');

            const parsedProducts = await parseCSV(csvFile);
            const cleanedProducts = cleanProducts(parsedProducts);

            if (cleanedProducts.length === 0) {
                throw new Error('No valid products found in CSV');
            }

            /* =============================
               BUILD BUSINESS OBJECT
            ============================== */

            const businessData = {
                businessName,
                whatsappNumber,
                bizDesc,
                paymentInfo,
                deliveryAreas,
                botTone,

                products: cleanedProducts,
                totalProducts: cleanedProducts.length,

                status: 'creating',
                currency: 'KES',
                platform: 'Cymor Enterprise',

                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            /* =============================
               SAVE TO FIREBASE
            ============================== */

            showToast('💾 Saving business...', 'info');
            const docRef = await saveBusiness(businessData);

            /* =============================
               SAVE LOCALLY
            ============================== */

            localStorage.setItem('currentBizId', docRef.id);
            localStorage.setItem('currentBizName', businessName);
            localStorage.setItem('currentBizPhone', whatsappNumber);

            /* =============================
               DEPLOY BOT
            ============================== */

            showToast('🚀 Deploying AI bot...', 'info');
            const deployResponse = await deployBot(docRef.id, businessName);

            console.log('Deployment:', deployResponse);

            /* =============================
               SUCCESS
            ============================== */

            showToast('✅ Business created successfully!');

            setTimeout(() => {
                window.location.href = 'pair.html';
            }, 1500);

        } catch (error) {
            console.error('❌ Form Error:', error);
            showToast(`❌ ${error.message}`, 'error');
        } finally {
            setLoading(false);
        }
    });
}

/* =========================================================
   📂 CSV FILE PREVIEW
========================================================= */

if (csvInput) {
    csvInput.addEventListener('change', () => {
        const file = csvInput.files[0];
        if (!file) return;

        showToast(`📄 Loaded: ${file.name}`, 'success');
    });
}

/* =========================================================
   ✨ INIT ANIMATION
========================================================= */

window.addEventListener('load', () => {
    document.body.classList.add('opacity-100');

    console.log(`
╔══════════════════════════════╗
║   🚀 CYMOR ENTERPRISE READY  ║
║   AI BUSINESS AUTOMATION     ║
╚══════════════════════════════╝
    `);
});
