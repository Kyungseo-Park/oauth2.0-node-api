const ResourceController = require('resource-server/lib/controllers/resourceController');

const express = require('express');
const router = express.Router();

const resourceController = ResourceController.getInstance();

router.get('/resource', resourceController.getResource);

module.exports = router;
