const express = require('express');
const router = express.Router();
const dataBase = require('../database');
const {QueryTypes} = require("sequelize");

const jwt = require('jsonwebtoken')
const {secret} = require('../routes/secretKey')






router.post('/first-level', async function(req, res, next) {
        const token = req.headers.access?.split(' ')[1]
        if(!token){
            return res.status(201).json({status: "1", result: false})
        }
        else{
            const {role: userRole} = jwt.verify(token, secret)
            if(userRole > 1){
                return res.status(201).json({status: "1", result: true})
            }
            else{
                return res.status(201).json({status: "1", result: false})
            }
        }

});

router.post('/second-level', async function(req, res, next) {

    const token = req.headers.access?.split(' ')[1]
    if(!token){
        return res.status(201).json({status: "1", result: false})
    }
    else{
        const {role: userRole} = jwt.verify(token, secret)
        if(userRole > 2){
            return res.status(201).json({status: "1", result: true})
        }
        else{
            return res.status(201).json({status: "1", result: false})
        }
    }



});


router.post('/testToPass', async function(req, res, next) {

    await dataBase.sequelize.query(`SELECT A.TEST_ID, A.TEST_CATEGORY_ID, B.TEST_CATEGORY_NAME, A.TEST_NAME, COUNT(C.*) AS COUNTER FROM TESTS A
        JOIN TEST_CATEGORIES B
        ON A.TEST_CATEGORY_ID = B.TEST_CATEGORY_ID
        JOIN QUESTIONS C
        ON A.TEST_ID = C.TEST_ID
        WHERE A.TEST_STATUS_ID = 2
        GROUP BY A.TEST_ID, A.TEST_CATEGORY_ID, B.TEST_CATEGORY_NAME, A.TEST_NAME`
    ).then(result=>{
        return res.status(201).json({status: "1", result: result[0]})
    }).catch((error)=> {
        return res.status(201).json({status: "2"})
    })


});


router.post('/questionsToPass', async function(req, res, next) {

    await dataBase.sequelize.query(`SELECT c.question_id, c.question_text, c.position, ARRAY_AGG(c.answer_text) AS TEXTS, ARRAY_AGG(c.answer_id) AS IDS
        FROM (SELECT a.question_id, a.question_text, a.position, b.answer_id, b.answer_text FROM QUESTIONS A
        JOIN ANSWERS B ON A.QUESTION_ID = B.QUESTION_ID
        WHERE TEST_ID = \'${req.body.id}\'
        ORDER BY A.POSITION ) C
        GROUP BY c.question_id, c.question_text, c.position`
    ).then(result=>{
        return res.status(201).json({status: "1", result: result[0]})
    }).catch((error)=> {
        return res.status(201).json({status: "2"})
    })


});

router.post('/sendTest', async function(req, res, next) {
    const token = req.headers.access.split(' ')[1]
    if(!token){
        return res.status(201).json({status: "2"})
    }
    else{
        const {id: id} = jwt.verify(token, secret)
        await dataBase.sequelize.query(`SELECT COUNT(*) AS COUNTER FROM ANSWERS WHERE IS_CORRECT = TRUE AND ANSWER_ID IN (${req.body.items})`
        ).then(async result=>{

            await dataBase.sequelize.query(`INSERT INTO TEST_PASSINGS VALUES(DEFAULT, ${req.body.id}, \'${id}\', ${result[0][0].counter}, null )`
            ).then(finish=>{
                return res.status(201).json({status: "1", result: result[0]})
            })

        }).catch((error)=> {
            return res.status(201).json({status: "2"})
        })
    }



});

module.exports = router;

