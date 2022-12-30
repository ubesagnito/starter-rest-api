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
    delete: _delete 
};

 
async function getAll({offset = 0, limit = 100, orderBy = 'id', orderType = 'ASC', search = null})   {
    let where = { status: 1 };
    if(search !== null) {
        where = {
            [Op.or]: [
                {game: {[Op.like] : `%${search}%`}}
            ]
        }
    }
    return await db.GamePhase.findAndCountAll({
        where,
        include: [{
            model: db.GameInfo
        }],
        offset: parseInt(offset),
        limit: parseInt(limit),
        order: [[orderBy, orderType]]
    });
}

async function getById(id) {
    return await getGamePhase(id);
}

async function create(user,params) {
    params.userId = 1;
    params.status = 1;
    if(!user) throw 'unauthorize';
    const d = await db.GamePhase.create(params);
    return d;
}
// helper functions

async function getGamePhase(id) {
    
    const lottery = await db.GamePhase.findByPk(id);
    if (!lottery) throw 'Game Phase not found';
    return lottery;
}
async function update(user,id, params) {
    if(!user) throw 'unauthorize';
    const lottery = await db.GamePhase.findOne({where: { id: id }});
    lottery.userId = 1;
    lottery.status = 1;
    if(!lottery) throw 'Game Phase not found'
    Object.assign(lottery, params);
    return await lottery.save();
}
async function _delete(user,id) {
    if(!user) throw 'unauthorize';
    const lottery = await getGamePhase(id);
    await lottery.destroy();
}
