const express = require('express');
const router = express.Router();
const dataBase = require('../database');
const {QueryTypes} = require("sequelize");
const jwt = require('jsonwebtoken')
const {secret} = require('../routes/secretKey')





router.post('/check', async function(req, res, next) {

    await dataBase.sequelize.query(`SELECT COUNT(*) AS counter FROM TESTS WHERE tests.test_name = \'${req.body.name}\'`
    ).then(result=>{
        const isOk = result[0][0].counter;
        if(isOk === '0'){
            return res.status(201).json({status: "1"})
        }
        if(isOk === '1'){
            return res.status(201).json({status: "2"})
        }

    }).catch((error)=> {
        return res.status(503).json({status: "3"})

    })


});


router.post('/registerTest', async function(req, res, next) {
    const token = req.headers.access.split(' ')[1]
    const {id: userName} = jwt.verify(token, secret)
    await dataBase.sequelize.query(`INSERT INTO TESTS VALUES (DEFAULT, ${req.body.category}, \'${userName}\', \'${req.body.test_name}\', 1)`
    ).then(result=>{
        return res.status(201).json({status: "1"})
    }).catch((error)=> {
        return res.status(201).json({status: "2"})

    })


});

router.post('/registerQuestion', async function(req, res, next) {

    await dataBase.sequelize.query(`SELECT TEST_ID AS id FROM TESTS WHERE TEST_NAME = \'${req.body.test_name}\'`
    ).then(async result=>{

        const testId = result[0][0].id;

        await dataBase.sequelize.query(`INSERT INTO QUESTIONS VALUES (DEFAULT, ${testId}, \'${req.body.quest}\', ${req.body.questId})`).then(async resultQ=>{

            await dataBase.sequelize.query(`SELECT QUESTION_ID AS qid FROM QUESTIONS WHERE TEST_ID = \'${testId}\'`).then( async resultQI=>{
                let questionId = resultQI[0][req.body.questId-1].qid;

                if(req.body.correct === '1' || req.body.correct === 1){

                    await dataBase.sequelize.query(`INSERT INTO ANSWERS VALUES (DEFAULT, ${questionId}, \'${req.body.first}\', true)`)
                    await dataBase.sequelize.query(`INSERT INTO ANSWERS VALUES (DEFAULT, ${questionId}, \'${req.body.second}\', false)`)
                    await dataBase.sequelize.query(`INSERT INTO ANSWERS VALUES (DEFAULT, ${questionId}, \'${req.body.third}\', false)`)
                    await dataBase.sequelize.query(`INSERT INTO ANSWERS VALUES (DEFAULT, ${questionId}, \'${req.body.fourth}\', false)`)
                     return res.status(201).json({status: "1"})
                }
                if(req.body.correct === '2'){

                    await dataBase.sequelize.query(`INSERT INTO ANSWERS VALUES (DEFAULT, ${questionId}, \'${req.body.first}\', false)`)
                    await  dataBase.sequelize.query(`INSERT INTO ANSWERS VALUES (DEFAULT, ${questionId}, \'${req.body.second}\', true)`)
                    await  dataBase.sequelize.query(`INSERT INTO ANSWERS VALUES (DEFAULT, ${questionId}, \'${req.body.third}\', false)`)
                    await  dataBase.sequelize.query(`INSERT INTO ANSWERS VALUES (DEFAULT, ${questionId}, \'${req.body.fourth}\', false)`)
                    return res.status(201).json({status: "1"})
                }
                if(req.body.correct === '3'){

                    await dataBase.sequelize.query(`INSERT INTO ANSWERS VALUES (DEFAULT, ${questionId}, \'${req.body.first}\', false)`)
                    await  dataBase.sequelize.query(`INSERT INTO ANSWERS VALUES (DEFAULT, ${questionId}, \'${req.body.second}\', false)`)
                    await  dataBase.sequelize.query(`INSERT INTO ANSWERS VALUES (DEFAULT, ${questionId}, \'${req.body.third}\', true)`)
                    await dataBase.sequelize.query(`INSERT INTO ANSWERS VALUES (DEFAULT, ${questionId}, \'${req.body.fourth}\', false)`)
                    return res.status(201).json({status: "1"})
                }
                if(req.body.correct === '4'){

                    await dataBase.sequelize.query(`INSERT INTO ANSWERS VALUES (DEFAULT, ${questionId}, \'${req.body.first}\', false)`)
                    await dataBase.sequelize.query(`INSERT INTO ANSWERS VALUES (DEFAULT, ${questionId}, \'${req.body.second}\', false)`)
                    await dataBase.sequelize.query(`INSERT INTO ANSWERS VALUES (DEFAULT, ${questionId}, \'${req.body.third}\', false)`)
                    await dataBase.sequelize.query(`INSERT INTO ANSWERS VALUES (DEFAULT, ${questionId}, \'${req.body.fourth}\', true)`)
                    return  res.status(201).json({status: "1"})
                }


            })
        })
    }).catch((error)=> {
        console.log(error)
        return res.status(201).json({status: "2"})

    })


});







module.exports = router;