const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../../_helpers/db');
const { Sequelize, literal } = require('sequelize');
const dotenv = require('dotenv');
const { object } = require('joi');
const { Op } = require("sequelize");
dotenv.config();
module.exports = {
    getAll,
    getById,
    create,
    update,
    _delete
};
async function getAll({offset = 0, limit = 100, orderBy = 'id', orderType = 'ASC', search = null}) {
    let where = { status: 1 };
    if(search !== null) {
        where = {
            [Op.or]: [
                {name: {[Op.like] : `%${search}%`}}
            ]
        }
    }
    return await db.scratchCard.findAndCountAll({
        where,
        offset: parseInt(offset),
        limit: parseInt(limit),
        order: [[orderBy, orderType]]
    });
}
async function getById(id) {
    return await getScratchCard(id);
}
async function create(params) {
    const d = await db.scratchCard.create(params);
    return d;
}
async function update(id, params) {
    const scratchcard = await db.scratchCard.findOne({where: { id: id }});
    if(!scratchcard) throw 'Scratchcard not found'
    Object.assign(scratchcard, params);
    return await scratchcard.save();
}
// helper functions
async function getScratchCard(id) {
    const scratchCard = await db.scratchCard.findByPk(id);
    if (!scratchCard) throw 'Scratchcard not found';
    return scratchCard;
}
async function _delete(id) {
    const scratchCard = await db.scratchCard.findOne({where: { id: id }});
    if(scratchCard) {
        await scratchCard.destroy();
        return true;
    }
}








