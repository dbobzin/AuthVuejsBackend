const express = require('express');
const { createUser, readUsers, updateUser, deleteUser } = require('../controller/adminController');
const { isAdmin, requireAuth} = require('../middleware/requireAuth');

const router = express.Router();
router.use(requireAuth);
// Read all users route
router.get('/', readUsers);

// Create user route
router.post('/', createUser);

// Update user route
router.put('/:id', updateUser);

// Delete user route
router.delete('/:id', deleteUser);

module.exports = router;
