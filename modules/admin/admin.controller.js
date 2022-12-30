const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('./../../_middleware/validate-request');
const adminService = require('../admin/admin.service');

// routes
router.post('/authenticate', authenticateSchema, authenticate);

module.exports = router;

function authenticateSchema(req, res, next) {
    const schema = Joi.object({
        username: Joi.string().email().required(),
        password: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function authenticate(req, res, next) {
    adminService.authenticate(req.body)
        .then(data => res.json({ message: "Success", data }))
        .catch(next);
}
