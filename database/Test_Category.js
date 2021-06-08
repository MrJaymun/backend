const Sequelize = require("sequelize")

module.exports = function (sequelize){
    return sequelize.define('test_category', {
        test_category_id:{
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        test_category_name:{
            type: Sequelize.STRING(15),
            primaryKey: false,
            allowNull: false
        }
    })
}