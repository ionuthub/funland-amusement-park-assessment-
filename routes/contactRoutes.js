const express = require('express');
const router = express.Router();

// Route to render the contact form (GET /)
router.get('/', (req, res) => {
    res.render('contact', { title: 'Contact Us' });  // Rendering with EJS layout
});

// POST route for contact form submission
router.post('/', (req, res) => {
    const { name, email, message } = req.body;
    const query = `INSERT INTO contactus (name, email, message) VALUES (?, ?, ?)`;

    // Accessing the database
    const db = req.app.get('db'); // Using the db from app.js

    db.run(query, [name, email, message], function(err) {
        if (err) {
            console.error('Error inserting contact form data:', err.message);
            return res.status(500).send('Failed to submit your message.');
        }
        res.redirect('/submittedContacts');  // Redirect to the contact page or success page
    });
});

module.exports = router;