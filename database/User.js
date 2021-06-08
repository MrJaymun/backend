const Sequelize = require("sequelize")

module.exports = function (sequelize){
    return sequelize.define('user', {
        login:{
            type: Sequelize.STRING(20),
            primaryKey: true,
            allowNull: false,
            unique: true
        },
        password:{
            type: Sequelize.STRING(20),
            primaryKey: false,
            allowNull: false
        },
        email:{
            type: Sequelize.STRING(31),
            primaryKey: false,
            allowNull: false
        },
        user_category_id:{
            type: Sequelize.INTEGER,
            primaryKey: false,
            allowNull: false
        }
    })
}