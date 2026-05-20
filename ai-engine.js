import { db } from "./firebase-config.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Global Ecosystem Application State Nodes
let activeMerchantConfig = null;
let internalShoppingBag = [];
let chatConversationalHistory = [];

// DOM Element Registry Matrix
let msgStream, inputField, sendBtn, displayGrid, displayCountBadge;
let cartItemsList, grossTotalLabel, globalCartCountLabel, finalizeOrderBtn;
let clearBagBtn, clearChatBtn, merchantWelcomeLabel, storeBrandTitle, aiDynamicGreeting;

document.addEventListener("DOMContentLoaded", async () => {
    // 1. Map DOM Structural Nodes
    initializeDOMSelectors();

    // 2. Resolve Multi-Tenant URL Parameters Location Clues
    const urlParams = new URLSearchParams(window.location.search);
    const storeSlug = urlParams.get("store");

    if (!storeSlug) {
        fallbackToDemoMode("No storefront parameter specified in address string.");
        return;
    }

    // 3. Query Cloud Database Matrix
    try {
        merchantWelcomeLabel.textContent = "Connecting to shard...";
        const merchantsRef = collection(db, "merchants");
        const q = query(merchantsRef, where("storeLink", "==", storeSlug));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // Unpack data from first document matching the unique slug parameter
            const merchantDoc = querySnapshot.docs[0].data();
            activeMerchantConfig = merchantDoc.metadataConfig || merchantDoc;
            hydrateStorefrontInterface();
        } else {
            fallbackToDemoMode(`Storefront instance "${storeSlug}" could not be located.`);
        }
    } catch (error) {
        console.error("Firestore Ingestion Crash:", error);
        fallbackToDemoMode("Network latency encountered. Operating on local cache matrix.");
    }

    // 4. Bind System Event Hook Listeners
    bindInteractionListeners();
});

function initializeDOMSelectors() {
    msgStream = document.getElementById("ai-chat-messages");
    inputField = document.getElementById("customer-chat-input");
    sendBtn = document.getElementById("dispatch-chat-btn");
    displayGrid = document.getElementById("dynamic-display-grid");
    displayCountBadge = document.getElementById("display-count-badge");
    cartItemsList = document.getElementById("checkout-items-list");
    grossTotalLabel = document.getElementById("invoice-gross-total");
    globalCartCountLabel = document.getElementById("global-cart-count");
    finalizeOrderBtn = document.getElementById("finalize-order-whatsapp-btn");
    clearBagBtn = document.getElementById("clear-bag-btn");
    clearChatBtn = document.getElementById("clear-chat-log");
    merchantWelcomeLabel = document.getElementById("store-brand-status");
    storeBrandTitle = document.getElementById("store-brand-title");
    aiDynamicGreeting = document.getElementById("ai-dynamic-greeting");
}

function hydrateStorefrontInterface() {
    merchantWelcomeLabel.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span> Live Online Store Active`;
    storeBrandTitle.textContent = activeMerchantConfig.businessName;
    
    aiDynamicGreeting.innerHTML = `👋 Welcome to <strong>${activeMerchantConfig.businessName}</strong>! I am your intelligent sales executive. I have fully indexed our dynamic inventory array, local delivery loops, and payment routes. Let me know what you're shopping for today!`;
    
    renderItemsToDisplayPortal(activeMerchantConfig.itemsArray || []);
}

function fallbackToDemoMode(diagnosticMessage) {
    console.warn(`System Routing Diagnostic Notice: ${diagnosticMessage}`);
    activeMerchantConfig = {
        businessName: "Cymor Tech Elite Sneakers",
        whatsappNumber: "254113821327",
        description: "Premium elite tier footwear repository operating under CymorTechServices protocols.",
        menuLayout: "Air Jordan Retro, Nike Air Force, Designer Tracks, Slides",
        paymentGateways: "Lipa na M-Pesa Till Number 0113821327",
        deliveryMatrix: "Instant dispatch via standard riders inside Nairobi CBD. Nationwide courier drop parcels.",
        itemsArray: [
            { id: "CS01", name: "Air Jordan Retro 4 'Bred'", price: 4500, description: "Premium retro layout execution with high-durability classic trim borders." },
            { id: "CS02", name: "Nike Air Force 1 '07 Premium", price: 3800, description: "All-white tailored leather finish with custom signature structural insoles." },
            { id: "CS03", name: "Cymor Cyber Track Special", price: 5500, description: "Next-gen aerodynamic runner with glowing pattern profiles." },
            { id: "CS04", name: "Yeezy Slide Onyx Edition", price: 2500, description: "Ultra-flexible comfort foam design perfect for routine utility usage." }
        ]
    };
    hydrateStorefrontInterface();
}

// --- RENDER DYNAMIC CATALOG CARDS ---
function renderItemsToDisplayPortal(productsArray) {
    if (!productsArray || productsArray.length === 0) {
        displayGrid.innerHTML = `
            <div class="col-span-full flex flex-col items-center justify-center text-center p-6 text-slate-600">
                <i class="fa-solid fa-face-frown text-xl"></i>
                <p class="text-xs mt-1">No items matching criteria are currently active.</p>
            </div>`;
        displayCountBadge.textContent = "0 Items Selected";
        return;
    }

    displayGrid.innerHTML = "";
    displayCountBadge.textContent = `${productsArray.length} Premium Options Loaded`;

    productsArray.forEach(item => {
        const card = document.createElement("div");
        card.className = "premium-card p-3 rounded-xl flex flex-col justify-between space-y-2 text-left animate-fadeIn";
        card.innerHTML = `
            <div>
                <div class="flex justify-between items-start">
                    <span class="bg-cyan-500/10 text-cyan-400 font-mono text-[9px] px-1.5 py-0.5 rounded border border-cyan-500/20 uppercase font-bold">${item.id}</span>
                    <span class="text-emerald-400 font-black text-xs font-mono">KSh ${parseFloat(item.price).toLocaleString()}</span>
                </div>
                <h5 class="text-xs font-bold text-white tracking-tight mt-1 truncate">${item.name}</h5>
                <p class="text-[10px] text-slate-400 line-clamp-2 mt-0.5 leading-snug">${item.description}</p>
            </div>
            <button data-id="${item.id}" class="add-to-bag-btn w-full bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 font-bold py-1.5 rounded-lg text-[10px] tracking-wide transition-all cursor-pointer uppercase">
                + Stage Item
            </button>
        `;
        displayGrid.appendChild(card);
    });

    // Event Delegation Binding for dynamic button selections
    displayGrid.querySelectorAll(".add-to-bag-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const prodId = e.currentTarget.getAttribute("data-id");
            globalAppendItemToBag(prodId);
        });
    });
}

function globalAppendItemToBag(productId) {
    const targetItem = activeMerchantConfig.itemsArray.find(i => i.id === productId);
    if (targetItem) {
        internalShoppingBag.push(targetItem);
        recalculateGrossOrderMatrix();
        appendBotMessageToStream(`🛒 **Excellent Selection!** I have loaded **${targetItem.name}** directly into your staged order invoice parameters list. Provide your drop coordinates below whenever you are ready to check out!`);
    }
}

function recalculateGrossOrderMatrix() {
    globalCartCountLabel.textContent = internalShoppingBag.length;
    
    if (internalShoppingBag.length === 0) {
        cartItemsList.innerHTML = `<p class="text-slate-600 text-center py-4 italic">Your current bag is empty. Request items from the assistant above!</p>`;
        grossTotalLabel.textContent = "KSh 0";
        return;
    }

    cartItemsList.innerHTML = "";
    let accumulatedPriceSum = 0;

    internalShoppingBag.forEach((item, index) => {
        accumulatedPriceSum += parseFloat(item.price);
        const row = document.createElement("div");
        row.className = "flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-white/5 animate-fadeIn";
        row.innerHTML = `
            <div class="flex flex-col max-w-[70%]">
                <span class="font-bold text-white text-[11px] truncate">${item.name}</span>
                <span class="text-[9px] text-slate-500 font-mono">${item.id}</span>
            </div>
            <div class="flex items-center gap-3">
                <span class="font-mono font-bold text-cyan-400 text-[11px]">KSh ${parseFloat(item.price).toLocaleString()}</span>
                <button data-index="${index}" class="remove-item-btn text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"><i class="fa-solid fa-trash-can text-[10px]"></i></button>
            </div>
        `;
        cartItemsList.appendChild(row);
    });

    grossTotalLabel.textContent = `KSh ${accumulatedPriceSum.toLocaleString()}`;

    cartItemsList.querySelectorAll(".remove-item-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const targetIdx = parseInt(e.currentTarget.getAttribute("data-index"));
            internalShoppingBag.splice(targetIdx, 1);
            recalculateGrossOrderMatrix();
        });
    });
}

// --- CORE CHAT STREAM RENDERING PIPELINE ---
function appendCustomerMessageToStream(text) {
    const bubble = document.createElement("div");
    bubble.className = "flex items-start gap-3 max-w-[85%] ml-auto flex-row-reverse animate-fadeIn";
    bubble.innerHTML = `
        <div class="bg-indigo-600 p-2 rounded-xl text-white flex-shrink-0 mt-0.5 shadow-md"><i class="fa-solid fa-user text-xs"></i></div>
        <div class="bg-indigo-500/10 text-slate-100 border border-indigo-500/20 rounded-2xl rounded-tr-none p-3 text-xs sm:text-sm shadow-sm">${text}</div>
    `;
    msgStream.appendChild(bubble);
    msgStream.scrollTop = msgStream.scrollHeight;
}

function appendBotMessageToStream(text) {
    const bubble = document.createElement("div");
    bubble.className = "flex items-start gap-3 max-w-[85%] animate-fadeIn";
    bubble.innerHTML = `
        <div class="bg-slate-800 p-2 rounded-xl text-cyan-400 flex-shrink-0 mt-0.5 shadow-md"><i class="fa-solid fa-brain text-xs"></i></div>
        <div class="bg-slate-900/80 text-slate-200 border border-white/5 rounded-2xl rounded-tl-none p-3 text-xs sm:text-sm shadow-inner leading-relaxed">${text}</div>
    `;
    msgStream.appendChild(bubble);
    msgStream.scrollTop = msgStream.scrollHeight;
}

// --- 💎 ULTIMATE SERVERLESS GEMINI AI ENGINE INTELLIGENCE LAYER ---
async function dispatchQueryToGeminiModel(customerInputText) {
    // 1. Construct an unyielding, high-persuasion business persona system template
    const systemInstruction = `
You are an expert sales representative for "${activeMerchantConfig.businessName}". 
Your main objective is to convert chat queries into catalog orders. 

Here is your critical business profile info:
- About: ${activeMerchantConfig.description}
- Categories/Menu Layout: ${activeMerchantConfig.menuLayout}
- Payment Infrastructure Terms: ${activeMerchantConfig.paymentGateways}
- Delivery Network Metrics: ${activeMerchantConfig.deliveryMatrix}

Here is the EXACT inventory array available for sale. Do NOT make up items outside this array:
${JSON.stringify(activeMerchantConfig.itemsArray)}

Core Behaviors:
1. Always state prices clearly in Kenyan Shillings (KSh).
2. If a user asks to view items, wants to browse a category, or searches for a product, mention the specific matching product names and codes (e.g., CS01) and encourage them to click "+ Stage Item" on the display card panel to the right.
3. Be friendly, polite, conversational, energetic, and highly professional.
4. Keep answers short, punchy, clear, and perfectly tailored for quick mobile reading.
`;

    // 2. Format local conversational memory buffers to strict API specifications
    chatConversationalHistory.push({ role: "user", parts: [{ text: customerInputText }] });

    // Render a temporary loading state tracker bubble 
    const loaderBubble = document.createElement("div");
    loaderBubble.className = "flex items-start gap-3 max-w-[85%] animate-pulse";
    loaderBubble.innerHTML = `
        <div class="bg-slate-800 p-2 rounded-xl text-slate-500 flex-shrink-0 mt-0.5"><i class="fa-solid fa-ellipsis animate-bounce"></i></div>
        <div class="bg-slate-900/40 text-slate-500 border border-white/5 rounded-2xl rounded-tl-none p-3 text-xs italic">Thinking...</div>
    `;
    msgStream.appendChild(loaderBubble);
    msgStream.scrollTop = msgStream.scrollHeight;

    try {
        // Free API access endpoints for production-grade scale pipelines
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBFrMI68hHAyLmtY6zMt5FJhvKpxG-JUaw`;
        
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: chatConversationalHistory,
                systemInstruction: { parts: [{ text: systemInstruction }] },
                generationConfig: { temperature: 0.2, maxOutputTokens: 350 }
            })
        });

        const jsonResult = await response.json();
        loaderBubble.remove();

        if (jsonResult.candidates && jsonResult.candidates[0].content) {
            const aiReplyText = jsonResult.candidates[0].content.parts[0].text;
            
            // Clean markdown bold syntax if desired or present
            const structuredHTMLReply = aiReplyText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>');
            
            appendBotMessageToStream(structuredHTMLReply);
            chatConversationalHistory.push({ role: "model", parts: [{ text: aiReplyText }] });

            // Post-process the context to dynamically filter cards if the model mentions specific catalog item codes
            triggerDynamicCardSyncFilter(customerInputText, aiReplyText);
        } else {
            throw new Error("Empty candidate payload arrays returned.");
        }

    } catch (err) {
        loaderBubble.remove();
        console.error("Gemini Engine Error Matrix Raised:", err);
        appendBotMessageToStream("⚠️ *System latency detected on AI processing pipelines.* Let me know if you would like me to refresh the collection layout panel!");
    }
}

// --- SMART INTERACTIVE COMPANION CARD AUTOMATION FILTER ---
function triggerDynamicCardSyncFilter(queryText, aiResponseText) {
    const unitedContext = (queryText + " " + aiResponseText).toUpperCase();
    
    // Look for product IDs (e.g., CS01, CS02) mentioned in conversation
    const matchedItems = activeMerchantConfig.itemsArray.filter(item => {
        return unitedContext.includes(item.id.toUpperCase()) || unitedContext.includes(item.name.toUpperCase());
    });

    if (matchedItems.length > 0) {
        renderItemsToDisplayPortal(matchedItems);
    } else if (queryText.toLowerCase().includes("all") || queryText.toLowerCase().includes("menu") || queryText.toLowerCase().includes("show")) {
        renderItemsToDisplayPortal(activeMerchantConfig.itemsArray);
    }
}

function handleUserMessageSubmission() {
    const rawText = inputField.value.trim();
    if (rawText === "") return;

    appendCustomerMessageToStream(rawText);
    inputField.value = "";
    
    dispatchQueryToGeminiModel(rawText);
}

function bindInteractionListeners() {
    sendBtn.addEventListener("click", handleUserMessageSubmission);
    inputField.addEventListener("keypress", (e) => { if (e.key === "Enter") handleUserMessageSubmission(); });

    // Bind Quick Interaction Assist Chips
    document.querySelectorAll(".sales-chip").forEach(chip => {
        chip.addEventListener("click", () => {
            const filteredValue = chip.textContent.replace(/^[^\s]+\s/, ""); // Strips emoji configurations away cleanly
            appendCustomerMessageToStream(filteredValue);
            dispatchQueryToGeminiModel(filteredValue);
        });
    });

    clearBagBtn.addEventListener("click", () => {
        internalShoppingBag = [];
        recalculateGrossOrderMatrix();
    });

    clearChatBtn.addEventListener("click", () => {
        msgStream.innerHTML = "";
        chatConversationalHistory = [];
        appendBotMessageToStream("Stream parameters refreshed. Send any product query to engage our live AI negotiation matrix!");
    });

    // --- HIGH-CONVERSION WHATSAPP REDIRECT CLOSING GATEWAY ---
    finalizeOrderBtn.addEventListener("click", () => {
        const name = document.getElementById("cust-name").value.trim();
        const phone = document.getElementById("cust-phone").value.trim();
        const location = document.getElementById("cust-location").value.trim();

        if (internalShoppingBag.length === 0) {
            alert("Staged invoice parameters contain no catalog entries. Please choose items to dispatch.");
            return;
        }
        if (!name || !phone || !location) {
            alert("Please complete name, phone, and delivery fields to safely map delivery instructions.");
            return;
        }

        let orderDump = "";
        let finalBill = 0;
        internalShoppingBag.forEach((item, index) => {
            finalBill += parseFloat(item.price);
            orderDump += `${index + 1}️⃣ ${item.name} [${item.id}] - KSh ${parseFloat(item.price).toLocaleString()}\n`;
        });

        const invoiceTemplate = 
`🧾 *CYMOR AI AUTOMATED INVOICE*
----------------------------------------
🚨 *NEW WORKSPACE DEPLOYMENT ORDER*

👤 *CUSTOMER LOGISTICS COORDINATES:*
• *Name:* ${name}
• *Phone Link:* ${phone}
• *Delivery Target:* ${location}

📦 *STAGED CATALOG INVENTORY ITEMS:*
${orderDump}
💰 *TOTAL SUM ACCUMULATED:* KSh ${finalBill.toLocaleString()}
----------------------------------------
💳 *MERCHANT SETTLEMENT CHANNELS:*
${activeMerchantConfig.paymentGateways}

*Thank you for selecting ${activeMerchantConfig.businessName}! Your order has been registered via Cymor Core AI protocols. Send this text to coordinate dispatch timelines instantly.*`;

        const encodedPayload = encodeURIComponent(invoiceTemplate);
        window.open(`https://wa.me/${activeMerchantConfig.whatsappNumber}?text=${encodedPayload}`, '_blank');
    });
}
