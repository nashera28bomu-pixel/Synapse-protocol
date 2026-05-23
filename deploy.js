require('dotenv').config();

/* =========================================================
   🚀 CYMOR ENTERPRISE DEPLOYMENT ENGINE
========================================================= */

const axios = require('axios');

const { db } = require('./db');

/* =========================================================
   ⚙️ ENVIRONMENT VARIABLES
========================================================= */

const PTERO_PANEL =
    process.env.PTERO_URL;

const API_KEY =
    process.env.PTERO_API_KEY;

const PTERO_USER_ID =
    Number(process.env.PTERO_USER_ID || 1);

const PTERO_NEST_ID =
    Number(process.env.PTERO_NEST_ID || 1);

const PTERO_EGG_ID =
    Number(process.env.PTERO_EGG_ID || 1);

/* =========================================================
   📦 DEPLOY NEW BUSINESS BOT
========================================================= */

async function deployNewBusinessBot(bizData) {

    try {

        /* =====================================
           VALIDATION
        ====================================== */

        if (!bizData) {
            throw new Error(
                'Business data missing'
            );
        }

        if (!bizData.id) {
            throw new Error(
                'Business ID missing'
            );
        }

        if (!bizData.businessName) {
            throw new Error(
                'Business name missing'
            );
        }

        if (!PTERO_PANEL) {
            throw new Error(
                'PTERO_URL missing in .env'
            );
        }

        if (!API_KEY) {
            throw new Error(
                'PTERO_API_KEY missing in .env'
            );
        }

        console.log(`
🚀 Deploying Bot
🏢 ${bizData.businessName}
        `);

        /* =====================================
           CLEAN BUSINESS NAME
        ====================================== */

        const serverName =
            bizData.businessName
                .replace(/[^\w\s-]/g, '')
                .trim();

        /* =====================================
           SERVER PAYLOAD
        ====================================== */

        const payload = {

            name: serverName,

            user: PTERO_USER_ID,

            nest: PTERO_NEST_ID,

            egg: PTERO_EGG_ID,

            docker_image:
                "ghcr.io/parkervcp/yolks:nodejs_20",

            startup:
                "npm install && node src/bot.js",

            environment: {

                BUSINESS_ID:
                    bizData.id,

                BUSINESS_NAME:
                    bizData.businessName,

                TZ:
                    "Africa/Nairobi",

                NODE_ENV:
                    "production"
            },

            limits: {

                memory:
                    1024,

                swap:
                    0,

                disk:
                    2048,

                io:
                    500,

                cpu:
                    100
            },

            feature_limits: {

                databases:
                    1,

                allocations:
                    1,

                backups:
                    2
            },

            deploy: {

                locations:
                    [1],

                dedicated_ip:
                    false,

                port_range:
                    []
            }
        };

        /* =====================================
           CREATE SERVER
        ====================================== */

        const response = await axios.post(

            `${PTERO_PANEL}/api/application/servers`,

            payload,

            {

                headers: {

                    Authorization:
                        `Bearer ${API_KEY}`,

                    Accept:
                        'application/json',

                    'Content-Type':
                        'application/json'
                }
            }
        );

        const server =
            response.data.attributes;

        console.log(`
✅ Deployment Successful
🆔 Server ID: ${server.id}
        `);

        /* =====================================
           SAVE DEPLOYMENT TO FIREBASE
        ====================================== */

        await db
            .collection('businesses')
            .doc(bizData.id)
            .update({

                deploymentStatus:
                    'active',

                serverId:
                    server.id,

                serverUUID:
                    server.uuid,

                deployedAt:
                    Date.now(),

                panel:
                    PTERO_PANEL
            });

        /* =====================================
           RETURN SUCCESS
        ====================================== */

        return {

            success: true,

            serverId:
                server.id,

            uuid:
                server.uuid,

            data:
                server
        };

    } catch (err) {

        const errorMessage =

            err.response?.data?.errors
                ? JSON.stringify(
                    err.response.data.errors
                )

                : err.message;

        console.error(`
❌ DEPLOYMENT FAILED
${errorMessage}
        `);

        /* =====================================
           UPDATE FIREBASE FAILURE
        ====================================== */

        try {

            if (bizData?.id) {

                await db
                    .collection('businesses')
                    .doc(bizData.id)
                    .update({

                        deploymentStatus:
                            'failed',

                        deploymentError:
                            errorMessage,

                        failedAt:
                            Date.now()
                    });
            }

        } catch (firebaseError) {

            console.error(
                'Firebase Update Error:',
                firebaseError.message
            );
        }

        return {

            success: false,

            error:
                errorMessage
        };
    }
}

/* =========================================================
   🔄 RESTART SERVER
========================================================= */

async function restartServer(serverId) {

    try {

        await axios.post(

            `${PTERO_PANEL}/api/client/servers/${serverId}/power`,

            {
                signal: 'restart'
            },

            {

                headers: {

                    Authorization:
                        `Bearer ${API_KEY}`,

                    Accept:
                        'application/json',

                    'Content-Type':
                        'application/json'
                }
            }
        );

        console.log(
            `🔄 Restarted Server ${serverId}`
        );

        return true;

    } catch (error) {

        console.error(
            'Restart Failed:',
            error.message
        );

        return false;
    }
}

/* =========================================================
   🗑️ DELETE SERVER
========================================================= */

async function deleteServer(serverId) {

    try {

        await axios.delete(

            `${PTERO_PANEL}/api/application/servers/${serverId}`,

            {

                headers: {

                    Authorization:
                        `Bearer ${API_KEY}`,

                    Accept:
                        'application/json'
                }
            }
        );

        console.log(
            `🗑️ Deleted Server ${serverId}`
        );

        return true;

    } catch (error) {

        console.error(
            'Delete Failed:',
            error.message
        );

        return false;
    }
}

/* =========================================================
   📊 GET SERVER DETAILS
========================================================= */

async function getServerInfo(serverId) {

    try {

        const response = await axios.get(

            `${PTERO_PANEL}/api/application/servers/${serverId}`,

            {

                headers: {

                    Authorization:
                        `Bearer ${API_KEY}`,

                    Accept:
                        'application/json'
                }
            }
        );

        return response.data;

    } catch (error) {

        console.error(
            'Fetch Server Failed:',
            error.message
        );

        return null;
    }
}

/* =========================================================
   📤 EXPORTS
========================================================= */

module.exports = {

    deployNewBusinessBot,

    restartServer,

    deleteServer,

    getServerInfo
};
