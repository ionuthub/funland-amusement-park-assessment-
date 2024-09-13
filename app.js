const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = process.env.PORT || 3002;

// Set view engine and layouts
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Connect to the SQLite database
const dbPath = path.join(__dirname, 'funland_park.db');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the database located at:', dbPath);
    }
});

// Set the db in the app to make it accessible in routes
app.set('db', db);

// Import routes
const contactRoutes = require('./routes/contactRoutes');
const homeRoutes = require('./routes/homeRoutes');
const faqRoutes = require('./routes/faqRoutes');
const ridesRoutes = require('./routes/rideRoutes');
const submittedContactRoutes = require('./routes/submittedContactRoutes');

// Use the routes
app.use('/', homeRoutes);
app.use('/faq', faqRoutes);
app.use('/rides', ridesRoutes);
app.use('/contact', contactRoutes);
app.use('/submittedContacts', submittedContactRoutes);

// Search route with database integration
app.get('/search', (req, res) => {
    const query = req.query.q;
    db.all("SELECT * FROM rides WHERE name LIKE ?", [`%${query}%`], (err, rows) => {
        if (err) {
            return res.status(500).send('Error retrieving rides from the database.');
        }
        res.json(rows); // Sending JSON data back to the frontend
    });
});

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// Close database connection on server shutdown
process.on('SIGINT', () => {
    db.close(err => {
        if (err) {
            console.error('Error closing the database:', err.message);
        }
        console.log('Closed the database connection.');
        process.exit(0);
    });
});
