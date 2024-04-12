const mongoose = require("mongoose");

const ImageDetailsScehma = new mongoose.Schema(
    {
        image:String,
        uploadDate: { type: Date, default: Date.now }
    },
    {
        collection: "ImageDetails",
    }
);

mongoose.model("ImageDetails", ImageDetailsScehma);