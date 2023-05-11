const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Hier werk je de routes uit.
// UC-201 Registreren als nieuwe user
router.post('', userController.createUser);
// UC-202 Opvragen van overzicht van users
router.get('', userController.getAllUsers);

module.exports = router;
