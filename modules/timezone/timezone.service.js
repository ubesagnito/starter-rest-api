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

async function getAll({offset = 0, limit = 100, orderBy = 'name', orderType = 'ASC', search = null}) {
    let where = { status: 1 };
    if(search !== null) {
        where = {
            [Op.or]: [
                {name: {[Op.like] : `%${search}%`}},
                {code: {[Op.like] : `%${search}%`}}
            ]
        }
    }
    return await db.Timezone.findAndCountAll({
        where,
        offset: parseInt(offset),
        limit: parseInt(limit),
        order: [[orderBy, orderType]]
    });
}
async function getById(id) {
    return await getTimeZone(id);
}
async function create(params) {
    const d = await db.Timezone.create(params);
    return d;
}
async function update(id, params) {
    const Timezone = await db.Timezone.findOne({where: { id: id }});
    if(!Timezone) throw 'Timezone not found'
    Object.assign(Timezone, params);
    return await Timezone.save();
}
async function getTimeZone(id) {
    const timezone = await db.Timezone.findByPk(id);
    if (!timezone) throw 'Timezone not found';
    return timezone;
}
async function _delete(id) {
    const Timezone = await db.Timezone.findOne({where: { id: id }});
    if(Timezone) {
        await Timezone.destroy();
        return true;
    }
}


