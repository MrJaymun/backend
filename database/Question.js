const Sequelize = require("sequelize")

module.exports = function (sequelize){
    return sequelize.define('question', {
        question_id:{
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            unique: true
        },
        test_id:{
            type: Sequelize.INTEGER,
            primaryKey: false,
            allowNull: false
        },
        question_text:{
            type: Sequelize.STRING(255),
            primaryKey: false,
            allowNull: false
        },
        position:{
            type: Sequelize.INTEGER,
            primaryKey: false,
            allowNull: false
        }

    })
}