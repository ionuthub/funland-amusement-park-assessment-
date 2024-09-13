const express = require('express');
const router = express.Router();

// Define the Rides route ("/rides")
router.get('/', (req, res) => {
    res.render('rides', { title: 'Rides - FunLand Amusement Park' });
});


module.exports = router;
