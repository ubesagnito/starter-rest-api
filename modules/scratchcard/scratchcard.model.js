const { DataTypes, literal } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = { 
        name: { type: DataTypes.STRING, allowNull: false },
        price: { type: DataTypes.DECIMAL, allowNull: false },
        duration: { type: DataTypes.STRING, allowNull: false },
        topPrize: { type: DataTypes.DECIMAL, allowNull: false },
        image: { type: DataTypes.STRING, allowNull: true },
        features: { type: DataTypes.TEXT, allowNull: true },
        frequency: { type: DataTypes.DECIMAL, allowNull: false },
        unmatchedMessage: { type: DataTypes.STRING, allowNull: true },
        playsOption: { type: DataTypes.DECIMAL, allowNull: false },
        options: { type: DataTypes.STRING, allowNull: true },
        rangeFrom: { type: DataTypes.DECIMAL, allowNull: true },
        rangeTo: { type: DataTypes.DECIMAL, allowNull: true },
        status: { type: DataTypes.TINYINT, allowNull: false, defaultValue : 0 }
         
    };

    const options = {
        defaultScope: {
            // exclude hash by default
            attributes: { exclude: [''] }
        },
        scopes: {
            // include hash with this scope
            withHash: { attributes: {}, }
        }
    };

    return sequelize.define('scratchCard', attributes, options);
}