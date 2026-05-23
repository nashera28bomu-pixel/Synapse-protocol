require('dotenv').config();

/* =========================================================
   📦 IMPORTS
========================================================= */

const pino = require('pino');

const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion
} = require('@whiskeysockets/baileys');

const {

    getMenuForBusiness,

    processOrder,

    parseOrderSelection,

    generateReceipt,

    generateWelcomeMessage,

    getBusinessInfo

} = require('./menuLogic');

const { db } = require('./db');

/* =========================================================
   ⚙️ CONFIG
========================================================= */

const BUSINESS_ID =
    process.env.BUSINESS_ID;

const BUSINESS_NAME =
    process.env.BUSINESS_NAME || 'Cymor Store';

/* =========================================================
   🧠 USER SESSION CACHE
========================================================= */

const userSessions = new Map();

/* =========================================================
   🚀 START BOT
========================================================= */

async function startBot() {

    console.log(`
╔══════════════════════════════╗
║                              ║
║    🚀 CYMOR AI ASSISTANT     ║
║                              ║
║    Starting WhatsApp Bot...  ║
║                              ║
╚══════════════════════════════╝
    `);

    /* =========================================
       AUTH STATE
    ========================================= */

    const { state, saveCreds } =
        await useMultiFileAuthState(
            'auth_info'
        );

    const { version } =
        await fetchLatestBaileysVersion();

    /* =========================================
       CREATE SOCKET
    ========================================= */

    const sock = makeWASocket({

        version,

        auth: state,

        logger: pino({
            level: 'silent'
        }),

        browser: [
            'Cymor Enterprise',
            'Chrome',
            '1.0.0'
        ],

        printQRInTerminal: false
    });

    /* =========================================
       SAVE CREDS
    ========================================= */

    sock.ev.on(
        'creds.update',
        saveCreds
    );

    /* =========================================
       CONNECTION EVENTS
    ========================================= */

    sock.ev.on(
        'connection.update',
        async (update) => {

            const {
                connection,
                lastDisconnect
            } = update;

            if (connection === 'open') {

                console.log(`
✅ Cymor Assistant Online
🤖 Business: ${BUSINESS_NAME}
                `);

                try {

                    await db
                        .collection('botStatus')
                        .doc(BUSINESS_ID)
                        .set({

                            status: 'online',

                            businessId:
                                BUSINESS_ID,

                            connectedAt:
                                Date.now()
                        });

                } catch (error) {

                    console.error(
                        'Status Update Error:',
                        error
                    );
                }
            }

            if (connection === 'close') {

                const shouldReconnect =
                    lastDisconnect?.error
                        ?.output
                        ?.statusCode !==
                    DisconnectReason.loggedOut;

                console.log(
                    '❌ Connection Closed'
                );

                if (shouldReconnect) {

                    console.log(
                        '🔄 Reconnecting...'
                    );

                    startBot();
                }
            }
        }
    );

    /* =========================================
       MESSAGE HANDLER
    ========================================= */

    sock.ev.on(
        'messages.upsert',
        async (messageUpdate) => {

            try {

                const msg =
                    messageUpdate.messages[0];

                if (!msg.message) return;

                if (msg.key.fromMe) return;

                const remoteJid =
                    msg.key.remoteJid;

                /* =============================
                   EXTRACT MESSAGE TEXT
                ============================== */

                const text =
                    (
                        msg.message
                            ?.conversation ||

                        msg.message
                            ?.extendedTextMessage
                            ?.text ||

                        msg.message
                            ?.imageMessage
                            ?.caption ||

                        ''
                    ).trim();

                if (!text) return;

                const lowerText =
                    text.toLowerCase();

                const phone =
                    remoteJid.split('@')[0];

                console.log(`
📩 Message Received
👤 ${phone}
💬 ${text}
                `);

                /* =============================
                   GET BUSINESS DATA
                ============================== */

                const business =
                    await getBusinessInfo(
                        BUSINESS_ID
                    );

                if (!business) {

                    await sock.sendMessage(
                        remoteJid,
                        {
                            text:
`❌ Business unavailable right now.

Please try again later.`
                        }
                    );

                    return;
                }

                /* =============================
                   INIT USER SESSION
                ============================== */

                if (!userSessions.has(phone)) {

                    userSessions.set(phone, {

                        stage: 'menu',

                        cart: [],

                        lastInteraction:
                            Date.now()
                    });
                }

                const session =
                    userSessions.get(phone);

                /* =============================
                   GREETING
                ============================== */

                if (

                    lowerText === 'hi' ||
                    lowerText === 'hello' ||
                    lowerText === 'menu' ||
                    lowerText === 'start'

                ) {

                    const welcome =
                        generateWelcomeMessage();

                    const menu =
                        await getMenuForBusiness(
                            BUSINESS_ID
                        );

                    await sock.sendMessage(
                        remoteJid,
                        {
                            text:
`${welcome}

${menu}`
                        }
                    );

                    session.stage =
                        'ordering';

                    return;
                }

                /* =============================
                   PRODUCT ORDERING
                ============================== */

                const isOrder =
                    /^[0-9,\s]+$/.test(text);

                if (
                    isOrder &&
                    session.stage === 'ordering'
                ) {

                    const items =
                        parseOrderSelection(
                            text,
                            business.products
                        );

                    if (!items.length) {

                        await sock.sendMessage(
                            remoteJid,
                            {
                                text:
`❌ Invalid selection.

Please reply with valid product numbers.

Example:
1
or
1,2,3`
                            }
                        );

                        return;
                    }

                    session.cart = items;

                    session.stage =
                        'address';

                    let summary = `
🛒 *ORDER SUMMARY*
━━━━━━━━━━━━━━━━━━
`;

                    items.forEach((item) => {

                        summary += `
• ${item.name}
💵 KES ${item.price.toLocaleString()}
`;
                    });

                    summary += `

━━━━━━━━━━━━━━━━━━

📍 Please send your delivery location/address.
`;

                    await sock.sendMessage(
                        remoteJid,
                        {
                            text: summary
                        }
                    );

                    return;
                }

                /* =============================
                   DELIVERY ADDRESS
                ============================== */

                if (
                    session.stage === 'address'
                ) {

                    session.deliveryAddress =
                        text;

                    session.stage =
                        'confirm';

                    const total =
                        session.cart.reduce(
                            (sum, item) =>
                                sum + item.price,
                            0
                        );

                    const paymentInfo =
                        business.paymentInfo ||
                        'Payment instructions unavailable';

                    await sock.sendMessage(
                        remoteJid,
                        {
                            text:
`
📍 Delivery Address Saved

💰 TOTAL:
KES ${total.toLocaleString()}

💳 PAYMENT INFO:
${paymentInfo}

Reply with:
CONFIRM

to place your order.
`
                        }
                    );

                    return;
                }

                /* =============================
                   CONFIRM ORDER
                ============================== */

                if (

                    lowerText === 'confirm' &&
                    session.stage === 'confirm'

                ) {

                    const orderResult =
                        await processOrder({

                            businessId:
                                BUSINESS_ID,

                            phone,

                            items:
                                session.cart,

                            deliveryLocation:
                                session.deliveryAddress,

                            paymentMethod:
                                'M-PESA'
                        });

                    if (!orderResult.success) {

                        await sock.sendMessage(
                            remoteJid,
                            {
                                text:
`❌ Failed to process order.

Please try again later.`
                            }
                        );

                        return;
                    }

                    await sock.sendMessage(
                        remoteJid,
                        {
                            text:
orderResult.receipt
                        }
                    );

                    await sock.sendMessage(
                        remoteJid,
                        {
                            text:
`
✅ Your order has been placed successfully!

🚚 Delivery processing has started.

🙏 Thank you for choosing ${BUSINESS_NAME}.
`
                        }
                    );

                    /* =====================
                       RESET SESSION
                    ====================== */

                    userSessions.delete(phone);

                    return;
                }

                /* =============================
                   HELP COMMAND
                ============================== */

                if (
                    lowerText === 'help'
                ) {

                    await sock.sendMessage(
                        remoteJid,
                        {
                            text:
`
🤖 *CYMOR ASSISTANT HELP*
━━━━━━━━━━━━━━━━━━

Available Commands:

• MENU → View products
• HI → Start ordering
• HELP → Show this menu

━━━━━━━━━━━━━━━━━━
⚡ Powered by Cymor Enterprise
`
                        }
                    );

                    return;
                }

                /* =============================
                   UNKNOWN MESSAGE
                ============================== */

                await sock.sendMessage(
                    remoteJid,
                    {
                        text:
`
🤖 I didn't understand that.

Reply with:
MENU

to view available products.

⚡ Powered by Cymor Enterprise
`
                    }
                );

            } catch (error) {

                console.error(
                    '❌ Message Handler Error:',
                    error
                );
            }
        }
    );
}

/* =========================================================
   🚀 START BOT
========================================================= */

startBot();
