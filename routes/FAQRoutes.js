// routes/faqRoutes.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('FAQ', { title: 'FAQ - FunLand Amusement Park' });
});

module.exports = router;
