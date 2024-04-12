const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ImageDetailsSchema = new Schema(
    {
        image: String,
        uploadDate: { type: Date, default: Date.now }
    },
    {
        collection: "ImageDetails",
    }
);

const ListingSchema = new Schema(
    {
        images: [ImageDetailsSchema],
        rent: {
            type: Number,
            required: true,
        },
        beds: {
            type: Number,
            required: true,
        },
        bath: {
            type: Number,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        user_id: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Listing", ListingSchema);