const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authController = require('../controllers/authentication.controller');

// UC-201 Registreren als nieuwe user
router.post('/register', userController.createUser);

// UC-202 Opvragen van overzicht van users
router.get('/users', userController.getAllUsers);

// UC-203 Haal het userprofile op van de user die ingelogd is
router.get('/profile',
  authController.validateToken,
  authController.validateLogin,
  userController.getUserProfile
);

// UC-204 Een gebruiker ophalen aan de hand van een ID
router.get('/users/:id', userController.getUserById);

// UC-205 Een gebruiker bijwerken
router.put('/users/:id', userController.updateUser);

// UC-206 Een gebruiker verwijderen
router.delete('/users/:id', userController.deleteUser);

module.exports = router;