
const Sequelize = require("sequelize");
const sequelize = new Sequelize("coursework", "postgres", "12345", {
    dialect: "postgres",
    host: "localhost",
    define: {
        timestamps: false
    }
});

/*

sequelize.sync({force: true}).then(()=> {
    console.log("Успешно");
})
*/




const User = require('./User')(sequelize)
const User_Category = require('./User_Category')(sequelize)
const Test = require('./Test')(sequelize)
const Test_Category = require('./Test_Category')(sequelize)
const Question = require('./Question')(sequelize)
const Test_Status = require('./Test_Status')(sequelize)
const Answer = require('./Answer')(sequelize)
const Test_Passing = require('./Test_Passing')(sequelize)

User.belongsTo(User_Category, {foreignKey: 'user_category_id'})
User_Category.hasMany(User, {foreignKey: 'user_category_id'})

Test.belongsTo(User, {foreignKey: 'test_author_name'})
User.hasMany(Test, {foreignKey: 'login'})

Test.belongsTo(Test_Category, {foreignKey: 'test_category_id'})
Test_Category.hasMany(Test, {foreignKey: 'test_category_id'})

Question.belongsTo(Test, {foreignKey: 'test_id'})
Test.hasMany(Question, {foreignKey: 'test_id'})

Test.belongsTo(Test_Status, {foreignKey: 'test_status_id'})
Test_Status.hasMany(Test, {foreignKey: 'test_status_id'})

Answer.belongsTo(Question, {foreignKey: 'question_id'})
Question.hasMany(Answer, {foreignKey: 'question_id'})

Test_Passing.belongsTo(User, {foreignKey: 'user_id'})
User.hasMany(Test_Passing, {foreignKey: 'login'})
Test_Passing.belongsTo(Test, {foreignKey: 'test_id'})
Test.hasMany(Test_Passing, {foreignKey: 'test_id'})

module.exports = {
    sequelize,
    user: User,
    user_category: User_Category,
    test: Test,
    test_category: Test_Category,
    answer: Answer,
    test_passing: Test_Passing
}