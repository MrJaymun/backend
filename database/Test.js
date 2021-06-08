const Sequelize = require("sequelize")

module.exports = function (sequelize){
    return sequelize.define('test', {
        test_id:{
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            unique: true
        },
        test_category_id:{
            type: Sequelize.INTEGER,
            primaryKey: false,
            allowNull: false
        },
        test_author_name:{
            type: Sequelize.STRING(20),
            primaryKey: false,
            allowNull: false
        },
        test_name:{
            type: Sequelize.STRING(255),
            primaryKey: false,
            allowNull: false
        },
        test_status_id:{
            type: Sequelize.INTEGER,
            primaryKey: false,
            allowNull: false
        }
    })
}