const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../../_middleware/validate-request');
const authorize = require('../../_middleware/user');
const lotteryPhaseService = require('./gamephase.service');
let multer = require('multer');
const fs = require('fs');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config();
// routes
router.post('/store',storeSchema,authorize.admin(), store); 
router.get('/', getAllSchema, getAll); 
router.get('/:id', getById); 
router.put('/:id', authorize.admin(), update); 
router.delete('/:id',authorize.admin(), _delete);

module.exports = router;
function storeSchema(req, res, next) {
    const schema = Joi.object({
        gameInformationId : Joi.number().integer().required(),
        game : Joi.string().required(),
        amount: Joi.string().required(),
        frequency: Joi.string().required(),
        days: Joi.string().empty(''),
        drawingType: Joi.number().integer().empty(''),
        drawingTime: Joi.string().empty(''),
        drawingDate: Joi.string().empty('') ,
        eligibleTickets: Joi.string().empty(''),
        winnersPerDrawing: Joi.string().empty(''),
        oddsOfWinning: Joi.string().empty(''),
        oddsOfUnsoldTicketWinning: Joi.string().empty(''),
        drawingType: Joi.number().integer(),
    });
    validateRequest(req, next, schema);
}

function store(req, res, next) {
    lotteryPhaseService.create(req.user,req.body).then(data => { res.json({ message: 'Success', data })}).catch(next);
}

function getAllSchema(req, res, next){
    const schema = Joi.object({
        offset: Joi.number().integer().min(0).empty(''),
        limit: Joi.number().integer().min(1).empty(''),
        orderBy: Joi.string().valid('id', 'createdAt', 'game').empty(''),
        orderType: Joi.string().valid('DESC', 'ASC').empty(''),
        search: Joi.string().empty(''),
    });
    validateRequest(req, next, schema, 'query');
}

function getAll(req, res, next) {
    lotteryPhaseService.getAll(req.query)
        .then(data => res.json({ message: 'Success', data } ))
        .catch(next);
}

function getById(req, res, next) {
    lotteryPhaseService.getById(req.params.id)
        .then(data => res.json({ message: 'Success', data }))
        .catch(next);
}

function update(req, res, next) {
    if (req.file){
        req.body.image = `${process.env.ASSET_URL}/lottery/${req.file.filename}`;
    } 
    lotteryPhaseService.update(req.user,req.params.id,req.body)
        .then(data => res.json({ message: 'Success', data }))
        .catch(next);
}

function _delete(req, res, next) {
    lotteryPhaseService.delete(req.user,req.params.id)
        .then(() => res.json({ message: 'Success' }))
        .catch(next);
}

