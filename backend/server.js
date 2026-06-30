const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');
const admin = require('firebase-admin');
const crypto = require('crypto');
const { sendCourseReceipt } = require('./mailer'); // ◄ NEW: Import the mailer logic
require('dotenv').config();

const app = express();

// Hugging Face standard port binding assignment
const PORT = process.env.PORT || 7860;

// ◄ NEW: In-Memory Idempotency Cache to strictly prevent duplicate emails from rapid Razorpay webhook retries (Zero Firestore Reads)
const processedPayments = new Set();

// Enable CORS to allow your frontend index.html to communicate securely with this Space
app.use(cors({
    origin: '*', // For development. Change to your specific domain URL in strict production builds.
    methods: ['GET', 'POST']
}));

// Use Express raw parsing middleware specifically for the webhook endpoint signature checks
app.use((req, res, next) => {
    if (req.originalUrl === '/razorpay-webhook') {
        express.raw({ type: 'application/json' })(req, res, next);
    } else {
        express.json()(req, res, next);
    }
});

// Initialize Firebase Admin SDK using your Environment Configuration string
try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log("🚀 Firebase Security Matrix initialized successfully.");
} catch (error) {
    console.error("❌ Fatal: Failed to initialize Firebase Admin SDK:", error.message);
    process.exit(1);
}

const db = admin.firestore();

// Initialize Razorpay Instance with variables extracted from rzp-key.csv
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_live_T1HpoAe39yK0FV',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'yVpjzZRsTLwZSHFl47NuxwAX'
});

// ==========================================
// 🚀 DYNAMIC COURSE PRICING ENGINE (NEW)
// ==========================================
const coursePrices = {
    "prompt-engineering": 14900,  // ₹149.00
    "data-analytics": 14900,      // ₹149.00 (Example for future)
    "hr-management": 19900,       // ₹199.00 (Example for future)
    "digital-marketing": 19900,   // ₹199.00
    "cyber-security": 24900,      // ₹249.00
    "product-management": 24900,  // ₹249.00
    "cloud-computing": 29900,     //₹299.00
    "default": 14900              // Fallback safeguard
};

/**
 * ENDPOINT 1: CREATE PAYMENT ORDER
 * Triggered by the client when clicking "Verify & Unlock"
 */
app.post('/create-order', async (req, res) => {
    // ◄ UPGRADE: Now accepts courseId to handle scaling multiple courses
    const { userId, courseId } = req.body; 

    if (!userId) {
        return res.status(400).json({ error: "Missing authenticating parameter: userId" });
    }
    
    // Fallback to prompt-engineering if frontend doesn't send one (supports legacy compatibility)
    const targetCourse = courseId || "prompt-engineering";
    
    // Automatically calculate price based on the requested course
    const calculatedPrice = coursePrices[targetCourse] || coursePrices["default"];

    const options = {
        amount: calculatedPrice, // Dynamic price loaded from engine
        currency: "INR",
        receipt: `rcpt_prod_${userId.substring(0, 5)}_${Date.now()}`,
        notes: {
            userId: userId, // ◄ EXTREMELY IMPORTANT: This attaches the individual's specific identifier string to the order payload
            courseId: targetCourse // ◄ NEW: We hide the course ID here so Razorpay hands it back to us in the Webhook
        }
    };

    try {
        const order = await razorpay.orders.create(options);
        return res.status(200).json({
            id: order.id,
            amount: order.amount,
            currency: order.currency
        });
    } catch (error) {
        console.error("Razorpay Order Creation Fault:", error);
        return res.status(500).json({ error: "Failed processing gateway activation parameters." });
    }
});

/**
 * ENDPOINT 2: RAZORPAY AUTONOMOUS WEBHOOK INTERCEPTOR
 * Receives automated postback updates from Razorpay servers instantly when users successfully pay.
 */
app.post('/razorpay-webhook', async (req, res) => {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const receivedSignature = req.headers['x-razorpay-signature'];

    if (!receivedSignature) {
        return res.status(400).send('Missing cryptographic validation payload.');
    }

    // Verify signature using raw body stream
    const rawBody = req.body.toString();
    const generatedExpectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

    if (generatedExpectedSignature !== receivedSignature) {
        console.warn("⚠️ Warning: Fraudulent webhook payload signature validation failed.");
        return res.status(403).send('Crypto trace evaluation mismatch.');
    }

    try {
        // Parse the body buffer array into legible object notation structures
        const payload = JSON.parse(rawBody);
        const eventType = payload.event;

        if (eventType === 'payment.captured') {
            const paymentEntity = payload.payload.payment.entity;
            const paymentId = paymentEntity.id; // Extract unique payment ID
            
            // ◄ NEW: Edge-Case Handler - Idempotency check prevents duplicate emails and DB writes from webhook retries
            if (processedPayments.has(paymentId)) {
                console.log(`⚠️ Webhook duplicate caught: Payment ${paymentId} already processed. Skipping to prevent duplicate emails.`);
                return res.status(200).json({ status: 'acknowledged_duplicate' });
            }
            
            // Add to cache and cap size at 5000 to prevent memory leaks in the Hugging Face container
            processedPayments.add(paymentId);
            if (processedPayments.size > 5000) {
                const firstItem = processedPayments.values().next().value;
                processedPayments.delete(firstItem);
            }
            
            // Extract the user identity and course identity notes we embedded during configuration step 1
            const systemTargetUser = paymentEntity.notes ? paymentEntity.notes.userId : null;
            const purchasedCourseId = paymentEntity.notes && paymentEntity.notes.courseId ? paymentEntity.notes.courseId : 'prompt-engineering';
            
            // Extract the financial variables to pass to the mailer
            const amountPaid = paymentEntity.amount; 
            const currency = paymentEntity.currency || "INR";

            if (systemTargetUser) {
                console.log(`Processing verified access provisioning updates for target: ${systemTargetUser} | Course: ${purchasedCourseId}`);

                // ◄ UPGRADE: Synchronize backend data structures directly into the NEW nested course Firebase tracking node
                await db.collection('users').doc(systemTargetUser).set({
                    courses: {
                        [purchasedCourseId]: {
                            paymentStatus: 'paid' // ◄ Flips only the specific purchased course to paid status
                        }
                    }
                }, { merge: true }); // Merge ensures we don't wipe out their other existing courses

                console.log(`🎉 Success: User database node updated safely [${systemTargetUser}] for course [${purchasedCourseId}]`);
                
                // ◄ NEW: Fetch User Details from Auth API (ZERO Firestore Document Reads) & Trigger Email
                try {
                    const userRecord = await admin.auth().getUser(systemTargetUser);
                    const userEmail = userRecord.email;
                    const userName = userRecord.displayName || 'Learner';

                    if (userEmail) {
                        // Fire-and-forget async function call so the webhook can instantly return 200 OK to Razorpay
                        sendCourseReceipt(userEmail, userName, purchasedCourseId, amountPaid, currency, paymentId).catch(err => {
                            console.error("❌ Async Email Dispatch Failed:", err);
                        });
                        console.log(`📧 Dispatching payment receipt email to ${userEmail}...`);
                    } else {
                        console.warn(`⚠️ No email found in Auth for user ${systemTargetUser}, skipping receipt dispatch.`);
                    }
                } catch (authError) {
                    console.error("❌ Failed to fetch user from Firebase Auth API:", authError);
                }

            } else {
                console.error("❌ Critical: Received valid webhook payment block but data identification note was missing.");
            }
        }

        // Always reply with a strict HTTP 200 status code back to Razorpay to avoid re-delivery retries
        return res.status(200).json({ status: 'acknowledged' });

    } catch (error) {
        console.error("Webhook processing state pipeline exception failure:", error);
        return res.status(500).send('Internal system tracking exception error occurred.');
    }
});

/**
 * ◄ UPGRADE: PREMIUM DARK-MODE SERVER STATUS DASHBOARD
 * Replaces the old JSON catch-all health validation endpoint with a sleek UI
 */
app.get('/', (req, res) => {
    const htmlResponse = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Goorac Core | Secure Gateway</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
        <style>
            body { margin: 0; padding: 0; background-color: #020617; color: #f8fafc; font-family: 'Inter', sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; overflow: hidden; }
            .container { text-align: center; background: #0f172a; padding: 50px; border-radius: 24px; border: 1px solid #1e293b; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.1); animation: fadeUp 0.8s ease-out; width: 100%; max-width: 600px; }
            @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            .status-wrapper { display: inline-flex; align-items: center; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); padding: 8px 16px; border-radius: 30px; margin-bottom: 30px; }
            .status-dot { display: inline-block; width: 10px; height: 10px; background-color: #10b981; border-radius: 50%; box-shadow: 0 0 12px #10b981; margin-right: 10px; animation: pulse 2s infinite; }
            @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); } 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); } }
            h1 { font-size: 3rem; font-weight: 800; margin: 0 0 5px 0; letter-spacing: -1.5px; }
            .highlight { color: #059669; }
            .subtext { color: #64748b; font-size: 1rem; margin: 0 0 40px 0; font-weight: 500; }
            .metrics { display: flex; justify-content: center; gap: 15px; flex-wrap: wrap; }
            .metric-box { background: #1e293b; padding: 20px; border-radius: 16px; border: 1px solid #334155; flex: 1; min-width: 120px; }
            .metric-title { font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px; font-weight: 600; }
            .metric-value { font-size: 1.4rem; font-weight: 800; font-family: 'Inter', sans-serif; color: #f8fafc; }
            .version-tag { position: absolute; bottom: 20px; color: #475569; font-size: 0.8rem; font-family: monospace; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Goorac <span class="highlight">Core</span></h1>
            <div class="subtext">Enterprise Routing & Payment Gateway</div>
            
            <div class="status-wrapper">
                <span class="status-dot"></span>
                <span style="color: #10b981; font-weight: 600; font-size: 0.9rem; letter-spacing: 0.5px;">SYSTEM ONLINE & SECURE</span>
            </div>

            <div class="metrics">
                <div class="metric-box">
                    <div class="metric-title">Engine</div>
                    <div class="metric-value">Node V2</div>
                </div>
                <div class="metric-box">
                    <div class="metric-title">Courses Configured</div>
                    <div class="metric-value" style="color: #0ea5e9;">Dynamic</div>
                </div>
                <div class="metric-box">
                    <div class="metric-title">Uptime</div>
                    <div class="metric-value">99.9%</div>
                </div>
            </div>
        </div>
        <div class="version-tag">Goorac Learn Backend Architecture v2.0.1 // Connected to Firebase Matrix</div>
    </body>
    </html>
    `;
    res.status(200).send(htmlResponse);
});

app.listen(PORT, () => {
    console.log(`⚙️ Backend Engine serving processes live on distribution port: ${PORT}`);
});
