const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../../_middleware/validate-request');
const authorize = require('../../_middleware/user');
const masterService = require('./timezone.service');
const dotenv = require('dotenv');
dotenv.config();
// routes
router.get('/', getAllSchema, getAll); 
router.post('/store',  create); 
router.get('/:id', getById);
router.put('/:id', update); 
router.delete('/:id', _delete); 
module.exports = router;

function create(req, res, next) {
    masterService.create(req.body).then(data => { res.json({ message: 'Success', data })}).catch(next);
}
function getAllSchema(req, res, next){
    const schema = Joi.object({
        offset: Joi.number().integer().min(0).empty(''),
        limit: Joi.number().integer().min(1).empty(''),
        orderBy: Joi.string().valid('id', 'createdAt', 'name', 'code').empty(''),
        orderType: Joi.string().valid('DESC', 'ASC').empty(''),
        search: Joi.string().empty(''),
    });
    validateRequest(req, next, schema, 'query');
}
function getAll(req, res, next) {
    masterService.getAll(req.query)
        .then(data => res.json({ message: 'Success', data } ))
        .catch(next);
}
function getById(req, res, next) {
    masterService.getById(req.params.id)
        .then(data => res.json({ message: 'Success', data }))
        .catch(next);
}
function update(req, res, next) {
    masterService.update(req.params.id,req.body)
        .then(data => res.json({ message: 'Success', data }))
        .catch(next);
}
function _delete(req, res, next) {
    masterService._delete(req.params.id)
        .then(data => res.json({ message: 'Success', data }))
        .catch(next);
}

