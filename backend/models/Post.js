const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['logo', 'uiux', 'print', 'branding', 'illustration', 'web', 'packaging', 'other'],
        required: true
    },
    imageUrl: {
        type: String,
        default: 'https://via.placeholder.com/400x300'
    },
    price: {
        type: Number,
        default: 0
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    views: {
        type: Number,
        default: 0
    },
    tags: [String],
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'published'
    },
    purchases: [{
        buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        purchasedAt: { type: Date, default: Date.now },
        amount: Number,
        paymentMethod: String
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Post', postSchema);
