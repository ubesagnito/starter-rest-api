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

 
async function getAll({offset = 0, limit = 100, orderBy = 'id', orderType = 'DESC', search = null}) {
    let where = { status: 1 };
    if(search !== null) {
        where = {
            [Op.or]: [
                {gameName: {[Op.like] : `%${search}%`}}
            ]
        }
    }
    return await db.GameInfo.findAndCountAll({
        where,
        include: [
            {model: db.GamePhase},
            
        ],
        offset: parseInt(offset),
        limit: parseInt(limit),
        order: [[orderBy, orderType]]
    });
}

async function getById(id) {
    return await getLottery(id);
}

async function create(user,params) {
    params.userId = 1;
    if(!user) throw 'unauthorize';
    const d = await db.GameInfo.create(params);
    return d;
}
// helper functions

async function getLottery(id) {
    
    const lottery = await db.GameInfo.findByPk(id);
    if (!lottery) throw 'Lottery not found';
    return lottery;
}
async function update(user,id, params) {
    if(!user) throw 'unauthorize';
    const lottery = await db.GameInfo.findOne({where: { id: id }});
    if(!lottery) throw 'Lottery not found'
    Object.assign(lottery, params);
    return await lottery.save();
}
async function _delete(user,id) {
    if(!user) throw 'unauthorize';
    const lottery = await getLottery(id);
    await lottery.destroy();
}
