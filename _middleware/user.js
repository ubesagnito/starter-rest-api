const jwt = require('express-jwt');
const db = require('_helpers/db');


module.exports = { user, admin };
function user(){
    return [
        jwt({ secret: process.env.SECRETSTRING, algorithms: ['HS256'] }),
        async (req, res, next) => {
            const user = await db.User.findOne({ where: { id: req.user.sub } });
            if (!user)
                return res.status(401).json({ message: 'Unauthorized' });
            req.user = user.get();
            next();
        }
    ];
}

function admin(){
    return [
        jwt({ secret: process.env.SECRETSTRING, algorithms: ['HS256'] }),
        async (req, res, next) => {
            const admin = await db.Admin.findOne({ where: { id: req.user.sub } });
            if (!user)
                return res.status(401).json({ message: 'Unauthorized' });
            req.user = admin.get();
            next();
        }
    ];
}