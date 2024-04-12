require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const listingsRoutes = require("./routes/listings");
const adminRoutes = require("./routes/admin");
const cors = require("cors");
const multer = require("multer");
const path = require('path');


// express app
const app = express();
app.use(cors());

// middleware
app.use(express.json());


// Log requests after JSON parsing middleware
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

// Serve static files from the images directory
app.use('/images', express.static(path.join(__dirname, 'src', 'images')));

// routes
// app.use("/listings", upload.array("images"), listingsRoutes);
app.use("/listings", listingsRoutes);
app.use("/users", userRoutes);
app.use("/admin", adminRoutes);


// connect to db
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        // listen for requests
        app.listen(process.env.PORT, () => {
            console.log("connected to db & listening on port", process.env.PORT);
        });
    })
    .catch((error) => {
        console.log(error);
    });
