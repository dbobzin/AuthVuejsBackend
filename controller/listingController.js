const Listing = require("../models/listingModel");
const mongoose = require("mongoose");

// get all Listings unprotected
const getListings = async (req, res) => {
    try {
        const listings = await Listing.find().sort({ createdAt: -1 });
        res.status(200).json(listings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// get a single Listing
const getListing = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "No such Listing" });
    }

    const listing = await Listing.findById(id);

    if (!listing) {
        return res.status(404).json({ error: "No such Listing" });
    }

    res.status(200).json(listing);
};

// create new Listing v1
// const createListing = async (req, res) => {
//     const { title, description } = req.body;
//
//     let emptyFields = [];
//
//     if (!title) {
//         emptyFields.push("title");
//     }
//     if (!description) {
//         emptyFields.push("description");
//     }
//     if (emptyFields.length > 0) {
//         return res
//             .status(400)
//             .json({ error: "Please fill in all the fields", emptyFields });
//     }
//
//     // add doc to db
//     try {
//         const user_id = req.user._id;
//         const listing = await Listing.create({ title, description, user_id });
//         res.status(200).json(listing);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };

// listing v2 with admin
// const createListing = async (req, res) => {
//     const { images, rent, beds, bath, address, city, description } = req.body;
//
//     let emptyFields = [];
//
//     if (!req.files || req.files.length === 0) {
//         emptyFields.push("images");
//     }
//     if (!rent) {
//         emptyFields.push("rent");
//     }
//     if (!beds) {
//         emptyFields.push("beds");
//     }
//     if (!bath) {
//         emptyFields.push("bath");
//     }
//     if (!address) {
//         emptyFields.push("address");
//     }
//     if (!city) {
//         emptyFields.push("city");
//     }
//     if (!description) {
//         emptyFields.push("description");
//     }
//     if (emptyFields.length > 0) {
//         return res
//             .status(400)
//             .json({ error: "Please fill in all the fields", emptyFields });
//     }
//
//     if (req.user.role !== 'ADMIN' && req.user.role !== 'MANAGER') {
//         return res.status(403).json({ error: 'Permission denied. Only admins or managers can create listings.' });
//     }
//
//     try {
//         const user_id = req.user._id;
//         const images = req.files.map(file => file.filename);
//         const listing = await Listing.create({ images, rent, beds, bath, address, city, description, user_id });
//         res.status(200).json(listing);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };

// create v2
const createListing = async (req, res) => {
    const { rent, beds, bath, address, city, description } = req.body;

    let emptyFields = [];

    if (!req.files || req.files.length === 0) {
        emptyFields.push("images");
    }
    if (!rent) {
        emptyFields.push("rent");
    }
    if (!beds) {
        emptyFields.push("beds");
    }
    if (!bath) {
        emptyFields.push("bath");
    }
    if (!address) {
        emptyFields.push("address");
    }
    if (!city) {
        emptyFields.push("city");
    }
    if (!description) {
        emptyFields.push("description");
    }
    if (emptyFields.length > 0) {
        return res
            .status(400)
            .json({ error: "Please fill in all the fields", emptyFields });
    }

    if (req.user.role !== 'ADMIN' && req.user.role !== 'MANAGER') {
        return res.status(403).json({ error: 'Permission denied. Only admins or managers can create listings.' });
    }

    try {
        const user_id = req.user._id;
        const images = req.files.map(file => ({ image: file.filename })); // Create ImageDetailsSchema instances
        const listing = await Listing.create({ images, rent, beds, bath, address, city, description, user_id });
        res.status(200).json(listing);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// delete a Listing
const deleteListing = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "No such listing" });
    }

    if (req.user.role !== 'ADMIN' && req.user.role !== 'MANAGER') {
        return res.status(403).json({ error: 'Permission denied. Only admins or managers can create listings.' });
    }

    try {
        const listing = await Listing.findOneAndDelete({ _id: id });

        if (!listing) {
            return res.status(400).json({ error: "No such listing" });
        }

        res.status(200).json(listing);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

// delete v2
// Delete a Listing
// const deleteListing = async (req, res) => {
//     const { id } = req.params;
//
//     // Check if the ID is valid
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//         return res.status(404).json({ error: "No such listing" });
//     }
//
//     // Check if the user has permission to delete
//     if (req.user.role !== 'ADMIN' && req.user.role !== 'MANAGER') {
//         return res.status(403).json({ error: 'Permission denied. Only admins or managers can delete listings.' });
//     }
//
//     try {
//         // Find the listing by ID
//         const listing = await Listing.findOne({ _id: id });
//
//         // If the listing doesn't exist, return an error
//         if (!listing) {
//             return res.status(404).json({ error: "No such listing" });
//         }
//
//         // Delete associated images
//         if (listing.images && listing.images.length > 0) {
//             const imageIds = listing.images.map(imageId => mongoose.Types.ObjectId(imageId));
//             await Listing.deleteMany({ _id: { $in: imageIds } });
//         }
//
//         // Delete the listing
//         await Listing.findOneAndDelete({ _id: id });
//
//         // Respond with success message
//         res.status(200).json({ message: "Listing deleted successfully" });
//     } catch (error) {
//         // Handle errors
//         console.error(error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };

// update a Listing
const updateListing = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "No such listing" });
    }

    if (req.user.role !== 'ADMIN' && req.user.role !== 'MANAGER') {
        return res.status(403).json({ error: 'Permission denied. Only admins or managers can create listings.' });
    }

    try {
        const listing = await Listing.findOneAndUpdate(
            { _id: id },
            { ...req.body },
            { new: true } // Return the updated listing
        );

        if (!listing) {
            return res.status(400).json({ error: "No such workout" });
        }

        res.status(200).json(listing);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    getListings,
    getListing,
    createListing,
    deleteListing,
    updateListing,
};