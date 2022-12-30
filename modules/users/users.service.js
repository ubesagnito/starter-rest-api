const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./../../_helpers/db');
const { Sequelize, literal } = require('sequelize');
const dotenv = require('dotenv');
const { object } = require('joi');
dotenv.config();

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    verify,
    changePassword,
    getJWT,
    forgetPassword,
    update,
    getCurrent
};

async function authenticate({ username, password, firebaseToken }) {
    const user = await db.User.scope('withHash').findOne({where: { email: username }});

    if (!user || !(await bcrypt.compare(password, user.hash)))
        throw 'Username or password is incorrect';

    db.User.update({ firebaseToken }, { where: { id: user.id } });
    const token = jwt.sign({ sub: user.id }, process.env.SECRETSTRING, { expiresIn: '7d' });
    return { ...omitHash(user.get()), token };
}

async function getAll({offset = 0, limit = 100, orderBy = 'name', orderType = 'ASC'}) {
    return await db.User.findAndCountAll({
        offset: parseInt(offset),
        limit: parseInt(limit),
        order: [[orderBy, orderType]]
    });
}

async function getById(id) {
    return await getUser(id);
}

async function create(params) {
    if (await db.User.findOne({ where: { email: params.email } })) {
        throw 'Email "' + params.email + '" is already taken';
    }
    if (params.password) {
        params.hash = await bcrypt.hash(params.password, 10);
    }
    const d = await db.User.create(params);
    const user = await db.User.scope('withHash').findOne({where: { id: d.id }});
    const token = jwt.sign({ sub: d.id, type: "user" }, process.env.SECRETSTRING, { expiresIn: '7d' });
    return { ...omitHash(user.get()), token };
}

async function getJWT(params) {
    const token = jwt.sign({ sub: params.id, type: "user" }, process.env.SECRETSTRING, { expiresIn: '7d' });
    return { ...params, token }
}

async function verify(id) {
    const user = await getUser(id);
    const params = { emailVerified: 1 };
    // copy params to user and save
    Object.assign(user, params);
    await user.save();
    return omitHash(user.get());
}

async function changePassword(user, password) {
     
    const users = await db.User.findOne({ where: { id: user.id }});
    
    const params = { hash: await bcrypt.hash(password.password, 10) };
    Object.assign(users, params);
    return await users.save();
    return omitHash(users.get());
}

async function forgetPassword({ username }) {
    const user = await db.User.findOne({where: { email: username }});
    if (!user) {
        throw "Email not registered with us."
    }
    const x = getJWT(user);
    return x;
}
// helper functions

async function getUser(id) {
    const user = await db.User.findByPk(id);
    if (!user) throw 'User not found';
    return user;
}

function omitHash(user) {
    const { hash, ...userWithoutHash } = user;
    return userWithoutHash;
}
async function update(user,id, params) {
    if(!user) throw 'unauthorize'
    const User = await db.User.scope('withHash').findOne({where: { id: id }});
    if(!User) throw 'user not found'
    const token = jwt.sign({ sub: user.id }, process.env.SECRETSTRING, { expiresIn: '7d' });
    await db.User.update(params,{ where: { id: id } })
    const updateUser = await db.User.scope('withHash').findOne({where: { id: id }});
    return { ...omitHash(updateUser.get()), token };
}
async function getCurrent(user) {
    console.log('getCurrent:_ ',user.id)
    if(!user) throw 'unauthorize'
    const User = await db.User.scope('withHash').findOne({where: { id: user.id }});
    if(!User) throw 'user not found'
    const token = jwt.sign({ sub: user.id }, process.env.SECRETSTRING, { expiresIn: '7d' });
      
    return { ...omitHash(User.get()), token };
}
