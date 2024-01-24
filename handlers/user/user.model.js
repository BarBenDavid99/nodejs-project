const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const schema = new Schema({
    name: {
        first: String,
        middle: String,
        last: String,
        _id: { type: ObjectId, default: () => new mongoose.Types.ObjectId() },
    },
    email: {
        type: String,
        unique: true,
    },
    password: String,
    phone: String,
    address: {
        state: String, country: String, city: String, street: String, houseNumber: Number, zip: Number,
        _id: { type: ObjectId, default: () => new mongoose.Types.ObjectId() },
    },
    image: { url: String, alt: String, _id: { type: ObjectId, default: () => new mongoose.Types.ObjectId() }, },
    isBusiness: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

exports.User = mongoose.model("users", schema);