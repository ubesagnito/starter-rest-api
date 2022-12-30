const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./../../_helpers/db');
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    authenticate,
};
async function authenticate({ username, password }) {
    const admin = await db.Admin.scope('withHash').findOne({ where: { email: username } });
    if (!admin || !(await bcrypt.compare(password, admin.hash)))
        throw 'Username or password is incorrect';
    const token = jwt.sign({ sub: admin.id }, process.env.SECRETSTRING, { expiresIn: '1d' });
    return { ...omitHash(admin.get()), token };
}


// helper functions
function omitHash(admin) {
    const { hash, ...adminWithoutHash } = admin;
    console.warn('adminWithoutHash:- ',adminWithoutHash);
    return adminWithoutHash;
}