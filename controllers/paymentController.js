// controllers/paymentController.js
exports.createPayment = (req, res) => {
    const { cardNumber, expiry, cvv, cardholder, packageId } = req.body;
    console.log('Payment received:', req.body);
    // TODO: gerçek ödeme işlemini burada yap
    res.status(201).json({ success: true, message: 'Payment processed!' });
};
