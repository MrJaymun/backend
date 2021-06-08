const Sequelize = require("sequelize")

module.exports = function (sequelize){
    return sequelize.define('user_category', {
        user_category_id:{
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        user_category_name:{
            type: Sequelize.STRING(20),
            primaryKey: false,
            allowNull: false
        }
    })
}