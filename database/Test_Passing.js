const Sequelize = require("sequelize")

module.exports = function (sequelize){
    return sequelize.define('test_passing', {
        test_passing_id:{
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
        user_id:{
            type: Sequelize.STRING(20),
            primaryKey: false,
            allowNull: false
        },
        correct_answer_count:{
            type: Sequelize.INTEGER,
            primaryKey: false,
            allowNull: false
        },

    })
}