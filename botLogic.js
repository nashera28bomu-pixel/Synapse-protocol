const { db } = require('./db');

/* =========================================================
   💰 FORMAT CURRENCY
========================================================= */

function formatCurrency(amount, currency = 'KES') {

    return `${currency} ${Number(amount || 0).toLocaleString()}`;
}

/* =========================================================
   🧹 CLEAN TEXT
========================================================= */

function cleanText(text = '') {

    return String(text)
        .replace(/\s+/g, ' ')
        .trim();
}

/* =========================================================
   🍔 GENERATE BEAUTIFUL MENU
========================================================= */

async function getMenuForBusiness(businessId) {

    try {

        const bizDoc = await db
            .collection('businesses')
            .doc(businessId)
            .get();

        if (!bizDoc.exists) {

            return `
❌ Business not found.

Powered by Cymor Enterprise
            `;
        }

        const data = bizDoc.data();

        const businessName =
            cleanText(data.businessName || 'Cymor Store');

        const currency =
            data.currency || 'KES';

        const products =
            Array.isArray(data.products)
                ? data.products
                : [];

        if (products.length === 0) {

            return `
╔══════════════════════╗
   ${businessName.toUpperCase()}
╚══════════════════════╝

⚠️ No products available right now.

Please check again later.

🚀 Powered by Cymor Enterprise
            `;
        }

        let menu = `
╔════════════════════════════╗
        🛍️ ${businessName.toUpperCase()}
╚════════════════════════════╝

✨ AVAILABLE PRODUCTS
━━━━━━━━━━━━━━━━━━━━━━
`;

        products.forEach((product, index) => {

            const name =
                cleanText(product.name || 'Unnamed Product');

            const price =
                formatCurrency(product.price, currency);

            const emoji =
                product.emoji || '🛒';

            menu += `
${emoji} *${index + 1}. ${name}*
💵 ${price}
`;
        });

        menu += `

━━━━━━━━━━━━━━━━━━━━━━

📝 HOW TO ORDER

Reply with the product number.

Example:
1

Or order multiple items:
1,2,3

🚚 Fast Delivery Available
💳 Secure Payments Supported

━━━━━━━━━━━━━━━━━━━━━━
⚡ Powered by Cymor Enterprise
`;

        return menu;

    } catch (error) {

        console.error('❌ Menu Error:', error);

        return `
❌ Failed to load menu.

Please try again later.

⚡ Powered by Cymor Enterprise
        `;
    }
}

/* =========================================================
   🛒 PARSE CUSTOMER ORDER
========================================================= */

function parseOrderSelection(message, products = []) {

    try {

        const cleaned = message
            .replace(/\s/g, '');

        const selections =
            cleaned
                .split(',')
                .map(Number)
                .filter(num =>
                    !isNaN(num) &&
                    num > 0 &&
                    num <= products.length
                );

        const selectedItems =
            selections.map(index => {

                const item = products[index - 1];

                return {
                    productId:
                        item.id || null,

                    name:
                        item.name || 'Unnamed Product',

                    price:
                        Number(item.price || 0),

                    quantity: 1,

                    total:
                        Number(item.price || 0)
                };
            });

        return selectedItems;

    } catch (error) {

        console.error('❌ Parse Order Error:', error);

        return [];
    }
}

/* =========================================================
   💵 CALCULATE ORDER TOTAL
========================================================= */

function calculateTotal(items = []) {

    return items.reduce((sum, item) => {
        return sum + Number(item.total || 0);
    }, 0);
}

/* =========================================================
   🧾 GENERATE RECEIPT
========================================================= */

function generateReceipt(order) {

    let receipt = `
╔════════════════════════╗
        🧾 ORDER RECEIPT
╚════════════════════════╝

`;

    order.items.forEach((item, index) => {

        receipt += `
${index + 1}. ${item.name}
💵 ${formatCurrency(item.price)}
`;
    });

    receipt += `

━━━━━━━━━━━━━━━━━━━━━━
💰 TOTAL: ${formatCurrency(order.totalAmount)}

📦 STATUS: ${order.status.toUpperCase()}

🙏 Thank you for shopping with us.

⚡ Powered by Cymor Enterprise
`;

    return receipt;
}

/* =========================================================
   📦 SAVE ORDER TO FIREBASE
========================================================= */

async function processOrder(orderData) {

    try {

        if (!orderData.businessId) {
            throw new Error('Business ID missing');
        }

        if (!orderData.phone) {
            throw new Error('Customer phone missing');
        }

        if (
            !Array.isArray(orderData.items) ||
            orderData.items.length === 0
        ) {
            throw new Error('No order items provided');
        }

        const total =
            calculateTotal(orderData.items);

        const orderPayload = {

            businessId:
                orderData.businessId,

            customerPhone:
                orderData.phone,

            customerName:
                orderData.customerName || '',

            items:
                orderData.items,

            totalAmount:
                total,

            paymentMethod:
                orderData.paymentMethod || 'M-PESA',

            deliveryLocation:
                orderData.deliveryLocation || '',

            notes:
                orderData.notes || '',

            status:
                'pending',

            createdAt:
                Date.now()
        };

        const orderRef =
            await db.collection('orders')
                .add(orderPayload);

        console.log(
            `✅ Order Created: ${orderRef.id}`
        );

        return {
            success: true,
            orderId: orderRef.id,
            receipt: generateReceipt({
                ...orderPayload,
                totalAmount: total
            })
        };

    } catch (error) {

        console.error('❌ Order Processing Error:', error);

        return {
            success: false,
            error: error.message
        };
    }
}

/* =========================================================
   📊 GET BUSINESS INFO
========================================================= */

async function getBusinessInfo(businessId) {

    try {

        const doc = await db
            .collection('businesses')
            .doc(businessId)
            .get();

        if (!doc.exists) {
            return null;
        }

        return doc.data();

    } catch (error) {

        console.error(
            '❌ Business Fetch Error:',
            error
        );

        return null;
    }
}

/* =========================================================
   🤖 AUTO REPLY SYSTEM
========================================================= */

function generateWelcomeMessage(name = 'Customer') {

    return `
👋 Hello ${name}!

Welcome to our store 🛍️

You can:
━━━━━━━━━━━━━━━━━━━━━━
1️⃣ View Menu
2️⃣ Place Orders
3️⃣ Check Delivery Fees
4️⃣ Contact Support

Reply with:
MENU

to see available products.

⚡ Powered by Cymor Enterprise
`;
}

/* =========================================================
   📤 EXPORTS
========================================================= */

module.exports = {

    getMenuForBusiness,

    processOrder,

    parseOrderSelection,

    calculateTotal,

    generateReceipt,

    generateWelcomeMessage,

    getBusinessInfo
};
