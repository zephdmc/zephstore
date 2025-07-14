// controllers/paymentVerification.js
const { db, admin } = require('../config/firebaseConfig');
const { validateNonce } = require('../utils/securityUtils');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../utils/asyncHandler');
const axios = require('axios');

// @desc    Verify Flutterwave payment
// @route   POST /api/payments/verify
// @access  Private

exports.verifyPayment = async (req, res) => {
    try {
        console.log('Verification request received:', {
            headers: req.headers,
            body: req.body,
            user: req.user
        });

        // 1. Validate required fields
        const { transaction_id, tx_ref, nonce } = req.body;
        if (!transaction_id || !tx_ref || !nonce) {
            console.error('Missing required fields');
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: transaction_id, tx_ref, nonce'
            });
        }

        // 2. Validate nonce
        const isNonceValid = await validateNonce(req.user.uid, nonce);
        if (!isNonceValid) {
            console.error('Invalid nonce');
            return res.status(401).json({
                success: false,
                error: 'Invalid or expired nonce'
            });
        }

        // 3. Process payment (mock - replace with actual Flutterwave verification)
        const paymentRecord = {
            id: tx_ref,
            status: 'verified',
            amount: req.body.amount,
            verifiedAt: new Date().toISOString()
        };

        // 4. Clear the used nonce
        await db.collection('paymentNonces').doc(req.user.uid).delete();

        console.log('Payment verified successfully');
        res.json({
            success: true,
            payment: paymentRecord
        });

    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({
            success: false,
            error: 'Payment verification failed'
        });
    }
};

async function verifyWithFlutterwave(transactionId) {
    try {
        return await axios.get(`https://api.flutterwave.com/v3/transactions/${transactionId}/verify`, {
            headers: {
                'Authorization': `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`
            }
        });
    } catch (error) {
        console.error('Flutterwave verification error:', error.response?.data || error.message);
        throw new ErrorResponse('Payment verification failed with Flutterwave', 400);
    }
}

async function processPaymentVerification({ userId, flutterwaveData, clientData }) {
    const batch = db.batch();
    const paymentRef = db.collection('payments').doc(flutterwaveData.tx_ref);
    const orderRef = db.collection('orders').doc(`order_${flutterwaveData.tx_ref}`);
    const nonceRef = db.collection('paymentNonces').doc(userId);

    // Payment record
    batch.set(paymentRef, {
        userId,
        amount: flutterwaveData.amount,
        currency: flutterwaveData.currency,
        transactionId: flutterwaveData.id,
        status: flutterwaveData.status,
        paymentMethod: flutterwaveData.payment_type,
        customer: {
            email: flutterwaveData.customer.email,
            name: flutterwaveData.customer.name
        },
        meta: clientData.meta,
        flutterwaveData: flutterwaveData,
        verifiedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    // Order record
    batch.set(orderRef, {
        userId,
        paymentReference: flutterwaveData.tx_ref,
        items: clientData.meta.items || [],
        amount: flutterwaveData.amount,
        status: 'paid',
        paymentVerified: true,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    // Clear used nonce
    batch.delete(nonceRef);

    await batch.commit();

    return {
        id: flutterwaveData.tx_ref,
        amount: flutterwaveData.amount,
        status: flutterwaveData.status
    };
}