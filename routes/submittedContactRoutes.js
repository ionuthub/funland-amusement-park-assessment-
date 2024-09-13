const express = require('express');
const router = express.Router();

// Route to display all submitted contacts
router.get('/', (req, res) => {
    const db = req.app.get('db'); // Access the database from the app context

    const query = "SELECT * FROM contactus";
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error retrieving contacts:', err.message);
            return res.status(500).send('Error retrieving contacts.');
        }
        // Render the submitted contacts page with the list of contacts
        res.render('submittedContacts', { title: 'Submitted Contacts', contacts: rows });
    });
});

module.exports = router;