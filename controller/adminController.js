// adminController.js
// CRUD operations for users only for ADMIN role
const User = require("../models/userModel");
const {getRounds} = require("bcrypt");

// Function to create a new user
const createUser = async (req, res) => {
    const { email, password, firstname, lastname, role } = req.body;
    try {
        // Ensure password is hashed using bcrypt
        if (!getRounds(password)) {
            return res.status(400).json({ error: 'Password must be hashed using bcrypt' });
        }
        const user = await User.create({ email, password, firstname, lastname, role });
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Function to read all users
const readUsers = async (req, res) => {
    if (req.user.role !== 'ADMIN') {
        res.status(403).json({ error: 'Permission denied. Only admin users can perform this operation.' });
    }
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Function to update a user
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { email, password, firstname, lastname, role } = req.body;

    if (req.user.role !== 'ADMIN') {
        res.status(403).json({ error: 'Permission denied. Only admin users can perform this operation.' });

    }
    try {
        const user = await User.findByIdAndUpdate(id, { email, password, firstname, lastname, role }, { new: true });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Function to delete a user
const deleteUser = async (req, res) => {
    const { id } = req.params;

    if (req.user.role !== 'ADMIN') {
        res.status(403).json({ error: 'Permission denied. Only admin users can perform this operation.' });
    }

    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    createUser,
    readUsers,
    updateUser,
    deleteUser,
};

// if (req.user.role !== 'ADMIN' || req.user.role !== 'MANAGER') {
//     return res.status(403).json({ error: 'Permission denied. Only admins or managers can create listings.' });
// }