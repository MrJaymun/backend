const express = require('express');
const router = express.Router();
const dataBase = require('../database');
const jwt = require('jsonwebtoken');
const {QueryTypes} = require("sequelize");
const {secret} = require('./secretKey');




router.post('/loginInfo', async function(req, res, next) {
    const token = req.headers.access.split(' ')[1]
    const {id: id} = jwt.verify(token, secret)
    return res.status(201).json({status: "1", result: id})
});

router.post('/createCount', async function(req, res, next) {
    await dataBase.sequelize.query(`SELECT COUNT(*) as counter FROM TESTS WHERE test_author_name = \'${req.body.login}\'`
    ).then(result=>{
                return res.status(201).json({ status: "1", result: result[0][0].counter})
            }).catch((error)=> {
        return res.status(201).json({status: "2", message: "Соединение с БД потеряно"})

    })
});

router.post('/passedCount', async function(req, res, next) {
    await dataBase.sequelize.query(`SELECT COUNT(*) as counter FROM (SELECT DISTINCT test_id FROM TEST_PASSINGS where user_id = \'${req.body.login}\') a`
    ).then(result=>{
        return res.status(201).json({ status: "1", result: result[0][0].counter})
    }).catch((error)=> {
        return res.status(201).json({status: "2", message: "Соединение с БД потеряно"})

    })
});

router.post('/newPassword', async function(req, res, next) {
    await dataBase.sequelize.query(`SELECT COUNT(*) as counter FROM USERS WHERE login = \'${req.body.login}\' AND password = \'${req.body.old}\'`
    ).then(async result=>{
        if(result[0][0].counter === '1'){
            console.log('Норм')
            await dataBase.sequelize.query(`UPDATE USERS SET PASSWORD = \'${req.body.new}\' WHERE LOGIN =\'${req.body.login}\'`).then(a => {
                return res.status(201).json({ status: "1"
            })
        })
        }
        else{
            return res.status(201).json({ status: "2"})
        }
    }).catch((error)=> {
        return res.status(201).json({status: "2", message: "Соединение с БД потеряно"})

    })
});

router.post('/testList', async function(req, res, next) {

    await dataBase.sequelize.query(`SELECT A.TEST_ID, A.TEST_NAME, B.TEST_CATEGORY_NAME FROM TESTS A
    JOIN TEST_CATEGORIES B 
    ON A.TEST_CATEGORY_ID = B.TEST_CATEGORY_ID
    WHERE TEST_STATUS_ID = 1`
    ).then(result=>{

        return res.status(201).json({ status: "1", result: result[0]})
    }).catch((error)=> {
        console.log(error)
        return res.status(201).json({status: "2"})

    })
});


router.post('/fullQuestions', async function(req, res, next) {

    await dataBase.sequelize.query(`SELECT c.question_id, c.question_text, c.position, ARRAY_AGG(c.answer_text) AS TEXTS, ARRAY_AGG(c.is_correct) AS CORRECTS
FROM (SELECT a.question_id, a.question_text, a.position, b.is_correct, b.answer_text FROM QUESTIONS A
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

router.post('/approveTest', async function(req, res, next) {

    await dataBase.sequelize.query(`UPDATE TESTS SET TEST_STATUS_ID = 2 WHERE TEST_ID =  \'${req.body.id}\'`
    ).then(result=>{
        return res.status(201).json({status: "1"})
    }).catch((error)=> {
        return res.status(201).json({status: "2"})
    })


});

router.post('/declineTest', async function(req, res, next) {

    await dataBase.sequelize.query(`UPDATE TESTS SET TEST_STATUS_ID = 3 WHERE TEST_ID =  \'${req.body.id}\'`
    ).then(result=>{
        return res.status(201).json({status: "1"})
    }).catch((error)=> {
        return res.status(201).json({status: "2"})
    })


});

router.post('/deleteTest', async function(req, res, next) {

    await dataBase.sequelize.query(`SELECT QUESTION_ID FROM QUESTIONS WHERE TEST_ID = \'${req.body.id}\'`
    ).then( async result=>{

        let array = []
        result[0].forEach(question =>{
            array.push(question.question_id)
        })

        await dataBase.sequelize.query(`DELETE FROM ANSWERS WHERE QUESTION_ID IN (${array})`).then(async answers=> {
            await dataBase.sequelize.query(`DELETE FROM QUESTIONS WHERE QUESTION_ID IN (${array})`).then(async questions=> {
                await dataBase.sequelize.query(`DELETE FROM TESTS WHERE TEST_ID = \'${req.body.id}\'`).then(finished =>{
                    return res.status(201).json({status: "1"})
                })
            })
        })
    }).catch((error)=> {
        console.log(error)
        return res.status(201).json({status: "2"})
        })

});


router.post('/fullMyTest', async function(req, res, next) {
    const token = req.headers.access.split(' ')[1]

    const {id: id} = jwt.verify(token, secret)
    await dataBase.sequelize.query(`SELECT A.TEST_NAME, B.TEST_STATUS_NAME FROM TESTS A
        JOIN TEST_STATUSES B
        ON A.TEST_STATUS_ID = B.TEST_STATUS_ID
        WHERE A.TEST_AUTHOR_NAME =   \'${id}\'`
    ).then(result=>{
        return res.status(201).json({status: "1", result: result[0]})
    }).catch((error)=> {
        return res.status(201).json({status: "2"})
    })


});

module.exports = router;