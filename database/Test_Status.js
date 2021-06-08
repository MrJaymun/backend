const Sequelize = require("sequelize")

module.exports = function (sequelize){
    return sequelize.define('test_status', {
        test_status_id:{
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        test_status_name:{
            type: Sequelize.STRING(15),
            primaryKey: false,
            allowNull: false
        }
    })
}