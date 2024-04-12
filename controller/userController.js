const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// Login user
const loginUser = async (req, res) => {
    const loginUser = async (req, res) => {
        console.log('Received login request'); // Add this line
    };

    const { email, password, role } = req.body;

    try {
        const user = await User.login(email, password, role); // Pass the role to the login method

        // Create token
        const token = createToken(user._id);

        res.status(200).json({ email, role: user.role, token }); // Include the role in the response
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Signup user
const registerUser = async (req, res) => {
    const { email, password, firstname, lastname, role } = req.body;

    try {
        const user = await User.register(email, password, firstname, lastname, role);

        // Create token
        const token = createToken(user._id);

        res.status(200).json({ email, role: user.role, token }); // Include the role in the response
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    loginUser,
    registerUser,
};
