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
                {name: {[Op.like] : `%${search}%`}},
                {code: {[Op.like] : `%${search}%`}}
            ]
        }
    }
    return await db.Currency.findAndCountAll({
        where,
        offset: parseInt(offset),
        limit: parseInt(limit),
        order: [[orderBy, orderType]]
    });
}
async function getById(id) {
    return await getCurrency(id);
}
async function create(params) {
    const d = await db.Currency.create(params);
    return d;
}
async function update(id, params) {
    const Currency = await db.Currency.findOne({where: { id: id }});
    if(!Currency) throw 'Currency not found'
    Object.assign(Currency, params);
    return await Currency.save();
}
// helper functions
async function getCurrency(id) {
    const timezone = await db.Currency.findByPk(id);
    if (!timezone) throw 'Currency not found';
    return timezone;
}
async function _delete(id) {
    const Currency = await db.Currency.findOne({where: { id: id }});
    if(Currency) {
        await Currency.destroy();
        return true;
    }
}








