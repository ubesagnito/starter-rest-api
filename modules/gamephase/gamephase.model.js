const { DataTypes, literal } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        userId: { type: DataTypes.TINYINT, allowNull: false },
        game: { type: DataTypes.STRING, allowNull: false },
        amount: { type: DataTypes.DECIMAL, allowNull: false },
        drawingType: { type: DataTypes.DECIMAL, allowNull: true },
        frequency: { type: DataTypes.DECIMAL, allowNull: false },
        days: { type: DataTypes.STRING, allowNull: true },
        drawingTime: { type: DataTypes.STRING, allowNull: true },
        drawingDate: { type: DataTypes.STRING, allowNull: true },
        eligibleTickets: { type: DataTypes.DECIMAL, allowNull: false },
        winnersPerDrawing: { type: DataTypes.DECIMAL, allowNull: false },
        oddsOfWinning: { type: DataTypes.STRING, allowNull: false },
        oddsOfUnsoldTicketWinning: { type: DataTypes.STRING, allowNull: true },
        status: { type: DataTypes.TINYINT, allowNull: false,defaultValue : 0 }
    };

    const options = {
        defaultScope: {
            attributes: { exclude: [] }
        },
        scopes: {
            withHash: { attributes: {} }
        }
    };

    return sequelize.define('gamePhase', attributes, options);
}