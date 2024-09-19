const express = require('express');
const router = express.Router();

// Route to render the contact form (GET /)
router.get('/', (req, res) => {
    // Check for success message in query parameter
    const successMessage = req.query.success === 'true' ? 'Your message has been sent successfully!' : null;

    res.render('contact', { 
        title: 'Contact Us', 
        successMessage // Pass the success message to the template if present
    });
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

        // Redirect to contact page with a success query parameter
        res.redirect('/contact?success=true');
    });
});


module.exports = router;

