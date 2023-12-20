const express = require('express') ;



const router = express.Router();

const urlShortenerApi = require('../../../controllers/shortUrlController')



router.route("/getAll").get(urlShortenerApi.getAll);



module.exports = router ;
