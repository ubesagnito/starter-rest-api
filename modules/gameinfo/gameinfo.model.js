const { DataTypes, literal } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        image: { type: DataTypes.STRING, allowNull: true },
        userId: { type: DataTypes.TINYINT, allowNull: false },
        gameNumber: { type: DataTypes.STRING, allowNull: false },
        gameName: { type: DataTypes.STRING, allowNull: false },
        gameSlogan: { type: DataTypes.STRING, allowNull: false },
        gameDuration: { type: DataTypes.STRING, allowNull: true },
        maxNumberTickets: { type: DataTypes.DECIMAL, allowNull: false },
        ticketPrice: { type: DataTypes.DECIMAL, allowNull: false },
        gameCurrency: { type: DataTypes.DECIMAL, allowNull: false },
        minPrizePool: { type: DataTypes.DECIMAL, allowNull: false },
        startTime: { type: DataTypes.STRING, allowNull: false },
        timeZone: { type: DataTypes.STRING, allowNull: false},
        instruction: { type: DataTypes.TEXT, allowNull: false },
        status: { type: DataTypes.TINYINT, allowNull: false, defaultValue : 0 }
    };

    const options = {
        defaultScope: {
            // exclude hash by default
            attributes: { exclude: [] }
        },
        scopes: {
            // include hash with this scope
            withHash: { attributes: {}, }
        }
    };

    return sequelize.define('gameInformation', attributes, options);
}