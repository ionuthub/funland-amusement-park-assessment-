const express = require('express');
const router = express.Router();

// Define the home route ("/")
router.get('/', (req, res) => {
    res.render('index', { title: 'Welcome to FunLand Amusement Park' });
});

module.exports = router;

