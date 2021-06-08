const Sequelize = require("sequelize")

module.exports = function (sequelize){
    return sequelize.define('answer', {
        answer_id:{
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            unique: true
        },
        question_id:{
            type: Sequelize.INTEGER,
            primaryKey: false,
            allowNull: false
        },
        answer_text:{
                type: Sequelize.STRING(255),
            primaryKey: false,
            allowNull: false
        },
        is_correct:{
            type: Sequelize.BOOLEAN,
            primaryKey: false,
            allowNull: false
        }

    })
}