const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const schema = new Schema({
    title: String,
    subtitle: String,
    description: String,
    phone: String,
    email: String,
    web: String,
    image: { url: String, alt: String, _id: { type: ObjectId, default: () => new mongoose.Types.ObjectId() }, },
    address: { state: String, country: String, city: String, street: String, houseNumber: Number, zip: Number, _id: { type: ObjectId, default: () => new mongoose.Types.ObjectId() }, },
    bizNumber: Number,
    likes: [],
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    createdAt: { type: Date, default: Date.now },
});

exports.Card = mongoose.model("cards", schema);