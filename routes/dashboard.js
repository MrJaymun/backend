var express = require('express');
var router = express.Router();
var dataBase = require('../database');
const {QueryTypes} = require("sequelize");



router.post('/allInfo', async function(req, res, next) {

    await dataBase.sequelize.query(`SELECT TEST_AUTHOR_NAME, COUNT(*) AS COUNTER FROM TESTS
           GROUP BY TEST_AUTHOR_NAME`
    ).then(async users=>{
        await dataBase.sequelize.query(`SELECT B.TEST_CATEGORY_NAME, COUNT(A.*) AS COUNTER FROM TESTS A
            JOIN TEST_CATEGORIES B
            ON A.TEST_CATEGORY_ID = B.TEST_CATEGORY_ID
            GROUP BY B.TEST_CATEGORY_ID`).then(async category=>{
                await dataBase.sequelize.query(`SELECT TEST_STATUS_ID, COUNT(*) AS COUNTER FROM TESTS
                    GROUP BY TEST_STATUS_ID`).then(async tests =>{
                    await dataBase.sequelize.query(`SELECT USER_CATEGORY_ID, COUNT(*) AS COUNTER FROM USERS
                         GROUP BY USER_CATEGORY_ID`).then(async usersCount =>{
                        return res.status(201).json({status: "1", users: users[0], category: category[0], tests: tests[0], usersCount: usersCount[0]})
                    })
                })
        })
    }).catch((error)=> {
        return res.status(201).json({status: "2"})
    })


});



module.exports = router;

