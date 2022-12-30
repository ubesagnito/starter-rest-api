const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../../_middleware/validate-request');
const scratchCardPlay = require('./scratchcardplay.service');
const dotenv = require('dotenv');
dotenv.config();

// routes
router.get('/', getAllSchema, getAll); 
router.post('/store',storeSchema,store); 
router.get('/:id', getById);
router.put('/:id',  storeSchema, update); 
router.delete('/:id', _delete);
module.exports = router;
// currency section
function getAllSchema(req, res, next){
    const schema = Joi.object({
        offset: Joi.number().integer().min(0).empty(''),
        limit: Joi.number().integer().min(1).empty(''),
        orderBy: Joi.string().valid('id', 'createdAt', 'name', 'price').empty(''),
        orderType: Joi.string().valid('DESC', 'ASC').empty('')
    });
    validateRequest(req, next, schema, 'query');
}
function getAll(req, res, next) {
    scratchCardPlay.getAll(req.query)
        .then(data => res.json({ message: 'Success', data } ))
        .catch(next);
}

function store(req, res, next) {
    scratchCardPlay.create(req.body).then(data => { res.json({ message: 'Success', data })}).catch(next);
}
function storeSchema(req, res, next) {
    const schema = Joi.object({
        scratchCardId: Joi.string().required(),
        label: Joi.string().required(),
        value: Joi.string().required(),
        status: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function getById(req, res, next) {
    scratchCardPlay.getById(req.params.id)
        .then(data => res.json({ message: 'Success', data }))
        .catch(next);
}
function update(req, res, next) {
    scratchCardPlay.update(req.params.id,req.body)
        .then(data => res.json({ message: 'Success', data }))
        .catch(next);
}

function _delete(req, res, next) {
    scratchCardPlay._delete(req.params.id)
        .then(data => res.json({ message: 'Success', data }))
        .catch(next);
}
