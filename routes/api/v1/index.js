const express = require('express');



const router = express.Router();


router.use("/shortUrl" , require('./urlRoute'));


module.exports = router ;
