const express = require('express') ;



const router = express.Router();

const urlApi = require('../../../controllers/urlController')



router.route("/getAll").get(urlApi.getAll);

router.route('/').post(urlApi.create)


module.exports = router ;
