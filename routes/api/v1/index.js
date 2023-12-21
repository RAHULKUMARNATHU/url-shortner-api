const express = require('express');



const router = express.Router();


router.use("/urls" , require('./urlRoute'));
router.use("/users", require("./userRoute"));


module.exports = router ;
