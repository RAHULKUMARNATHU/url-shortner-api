const express = require('express');



const router = express.Router();


router.use("/shortUrl" , require('./urlRoute'));
router.use("/shortUrl", require("./userRoute"));


module.exports = router ;
