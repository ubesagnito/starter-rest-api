const { DataTypes, literal } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        image: { type: DataTypes.STRING, allowNull: true },
        name: { type: DataTypes.STRING, allowNull: true },
        email: { type: DataTypes.STRING, allowNull: false },
        phoneNo: { type: DataTypes.STRING, allowNull: true },
        hash: { type: DataTypes.STRING, allowNull: true },
        dob: { type: DataTypes.DATE, allowNull: true },
        aadharNumber: { type: DataTypes.STRING, allowNull: true },
        gender: { type: DataTypes.STRING, allowNull: true },
        address: { type: DataTypes.STRING, allowNull: true },
        lat: { type: DataTypes.STRING, allowNull: true },
        long: { type: DataTypes.STRING, allowNull: true },
        emailVerified: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 0 },
        dp: { type: DataTypes.STRING, allowNull: true },
        otp: { type: DataTypes.STRING, allowNull: true },
        remarks: { type: DataTypes.TEXT, allowNull: true },
        firebaseToken: { type: DataTypes.STRING, allowNull: true },
        deviceId: { type: DataTypes.STRING, allowNull: true },
        status: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 1 }
    };

    const options = {
        defaultScope: {
            // exclude hash by default
            attributes: { exclude: ['hash'] }
        },
        scopes: {
            // include hash with this scope
            withHash: { attributes: {}, }
        }
    };

    return sequelize.define('User', attributes, options);
}