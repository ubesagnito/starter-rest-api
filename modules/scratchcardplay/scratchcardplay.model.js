const { DataTypes, literal } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = { 
        scratchCardId: { type: DataTypes.INTEGER, allowNull: false },
        label: { type: DataTypes.STRING, allowNull: null },
        value: { type: DataTypes.DECIMAL, allowNull: false },
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

    return sequelize.define('scratchCardPlays', attributes, options);
}