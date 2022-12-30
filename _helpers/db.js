const mysql = require('mysql2/promise');
const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();
module.exports = db = {};
initialize();
async function initialize() {
    const { DBHOST, DBPORT, DBUSER, DBPASSWORD, DBDB } = process.env;
    const connection = await mysql.createConnection({ host: DBHOST, port: DBPORT, user: DBUSER, password: DBPASSWORD });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DBDB}\`;`);
    const sequelize = new Sequelize(
        DBDB,
        DBUSER,
        DBPASSWORD,
        {
            port: DBPORT,
            host: DBHOST,
            dialect: 'mysql'
        });
    db.sequelize = sequelize;
    db.Admin = require('../modules/admin/admin.model')(sequelize);
    db.User = require('../modules/users/users.model')(sequelize);
    db.Timezone = require('../modules/timezone/timezone.model')(sequelize);
    db.GameInfo = require('../modules/gameinfo/gameinfo.model')(sequelize);
    db.GamePhase = require('../modules/gamephase/gamephase.model')(sequelize);
    db.Currency = require('../modules/currency/currency.model')(sequelize);
    db.scratchCard = require('../modules/scratchcard/scratchcard.model')(sequelize);
    db.scratchCardPlay = require('../modules/scratchcardplay/scratchcardplay.model')(sequelize);
    
    db.scratchCardPlay.belongsTo(db.scratchCard,{foreignKey: "scratchCardId"});
    
   
    db.GameInfo.hasMany(db.GamePhase);
    db.GamePhase.belongsTo(db.GameInfo);
    await sequelize.sync();
}