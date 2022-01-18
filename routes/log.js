const express = require('express');
const router = express.Router();
const dataBase = require('../database');
const jwt = require('jsonwebtoken');
const {QueryTypes} = require("sequelize");
const {secret} = require('./secretKey');

router.post('/logsAllTime', async function(req, res, next) {
        await dataBase.sequelize.query(`
        SELECT 
            A.USER_ID AS USER,
            A.BEGIN_TIME::TIMESTAMP(0)::VARCHAR AS BEGINTIME, 
            (A.FINISH_TIME::TIMESTAMP(0)-A.BEGIN_TIME::TIMESTAMP(0))::VARCHAR AS DURATION, 
            B.TEST_NAME AS TESTNAME,
            C.TEST_PASSING_STATUS_NAME AS STATUS
            FROM TEST_PASSINGS A
            JOIN TESTS B
            ON A.TEST_ID = B.TEST_ID
            JOIN TEST_PASSING_STATUSES C
            ON A.TEST_PASSING_STATUS_ID = C.TEST_PASSING_STATUS_ID
        `).then(async result =>{
                    return res.status(201).json({status: "1", result: result[0]})
    }).catch((error)=> {
        return res.status(201).json({status: "2"})
    })
});

router.post('/logsOneDay', async function(req, res, next) {


    await dataBase.sequelize.query(`
        SELECT 
            A.USER_ID AS USER,
            A.BEGIN_TIME::TIMESTAMP(0)::VARCHAR AS BEGINTIME, 
            (A.FINISH_TIME::TIMESTAMP(0)-A.BEGIN_TIME::TIMESTAMP(0))::VARCHAR AS DURATION, 
            B.TEST_NAME AS TESTNAME,
            C.TEST_PASSING_STATUS_NAME AS STATUS
            FROM TEST_PASSINGS A
            JOIN TESTS B
            ON A.TEST_ID = B.TEST_ID
            JOIN TEST_PASSING_STATUSES C
            ON A.TEST_PASSING_STATUS_ID = C.TEST_PASSING_STATUS_ID
            WHERE BEGIN_TIME::DATE = \'${req.body.time}\'
        `).then(async result =>{
        return res.status(201).json({status: "1", result: result[0]})
    }).catch((error)=> {
        return res.status(201).json({status: "2"})
    })


});



module.exports = router;
