const express = require('express');
const router = express.Router();

router.get('/', (request, response) => {
    response.status(200).send('Nothig to do here ;)');
});

module.exports = router;