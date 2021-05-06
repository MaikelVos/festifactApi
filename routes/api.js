const express = require('express');
const router = express.Router({});
const authentication = require('./authentication');
const v1 = require('./api_v1');

// Routers for authentication and V1.
router.use("/", authentication);
router.use("/v1", v1);

module.exports = router;