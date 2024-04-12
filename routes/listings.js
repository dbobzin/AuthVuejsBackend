const express = require("express");

const {
    createListing,
    getListings,
    getListing,
    deleteListing,
    updateListing,
} = require("../controller/listingController");
const { requireAuth } = require("../middleware/requireAuth");

const router = express.Router();
const multer = require("multer");
const path = require("path");

// Multer setup for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./src/images/"); // Set the destination directory for image uploads
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + file.originalname);
    },
});

router.get('/images/:filename', (req, res) => {
    const filename = req.params.filename;
    const imagePath = path.join(__dirname, 'src', 'images', filename);
    res.sendFile(imagePath);
});

const upload = multer({ storage: storage });

router.get("/", getListings);
router.get("/:id", getListing);
router.use(requireAuth);

// router.post("/", createListing);
router.post("/", upload.array("image"), createListing);
router.delete("/:id", deleteListing);
router.patch("/:id", updateListing);
module.exports = router;
