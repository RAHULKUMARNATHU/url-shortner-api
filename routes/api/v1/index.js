const express = require('express');



const router = express.Router();


router.use("/shortUrl" , require('./urlShortener'));


module.exports = router ;
