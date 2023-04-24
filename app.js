// Initialisatie van de in-memory database
const users = [];
const express = require('express');
const app = express();
const port = 3000;
app.use(express.json()); // nodig om req.body te kunnen parsen

// UC-201: een nieuwe gebruiker aanmaken
app.post('/api/users', (req, res) => {
  const {email, name, password} = req.body;

  // Controleer of e-mail, naam en wachtwoord aanwezig zijn
  if (!email || !name || !password) {
    return res.status(400).json({message: 'E-mail, naam en wachtwoord zijn verplicht'});
  }

  // Log welke gebruikers er al zijn
  console.log('Huidige gebruikers:', users);

  // Controleer of de e-mail al bestaat
  const existingUser = users.find(user => user.email === email);

  // Als de e-mail al bestaat, geef een foutmelding
  if (existingUser) {
    return res.status(400).json({message: 'Een gebruiker met dit e-mailadres bestaat al'});
  }

  const newUser = {id: users.length + 1, email, name, password};
  users.push(newUser);
  res.status(201).json(newUser);
});

// UC-202: alle gebruikers ophalen
app.get('/api/users', (req, res) => {
  res.status(200).json(users);
});

// UC-203: niet gerealiseerd
app.get('/api/unimplemented', (req, res) => {
  res.status(501).json({message: 'Deze functionaliteit is nog niet gerealiseerd'});
});

// UC-204: een gebruiker ophalen aan de hand van een ID
app.get('/api/users/:id', (req, res) => {
  const userId = Number(req.params.id);
  const user = users.find(user => user.id === userId);
  if (!user) {
    return res.status(404).json({message: 'Gebruiker niet gevonden'});
  }
  res.status(200).json(user);
});

// UC-205: een gebruiker bijwerken
app.put('/api/users/:id', (req, res) => {
  const userId = Number(req.params.id);
  const userIndex = users.findIndex(user => user.id === userId);
  if (userIndex === -1) {
    return res.status(404).json({message: 'Gebruiker niet gevonden'});
  }
  const {email, name, password} = req.body;
  const existingUser = users.find(user => user.email === email && user.id !== userId);
  if (existingUser) {
    return res.status(400).json({message: 'Een gebruiker met dit e-mailadres bestaat al'});
  }
  const updatedUser = {...users[userIndex], email, name, password};
  users[userIndex] = updatedUser;
  res.status(200).json(updatedUser);
});

// UC-206: een gebruiker verwijderen
app.delete('/api/users/:id', (req, res) => {
  const userId = Number(req.params.id);
  const userIndex = users.findIndex(user => user.id === userId);
  if (userIndex === -1) {
    return res.status(404).json({message: 'Gebruiker niet gevonden'});
  }
  users.splice(userIndex, 1);
  res.status(200).json({message: 'Gebruiker succesvol verwijderd'});
});

// Start de server
app.listen(port, () => {
  console.log(`Server draait op http://localhost:${port}`);
});