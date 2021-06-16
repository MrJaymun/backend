const express = require('express');
const router = express.Router();
const dataBase = require('../database');
const {QueryTypes} = require("sequelize");

const jwt = require('jsonwebtoken')
const {secret} = require('../routes/secretKey')






router.post('/first-level', async function(req, res, next) {
        const token = req.headers.access.split(' ')[1]
        const {role: userRole} = jwt.verify(token, secret)
            if(userRole > 1){
                return res.status(201).json({status: "1", result: true})
            }
            else{
                return res.status(201).json({status: "1", result: false})
            }

});

router.post('/second-level', async function(req, res, next) {
    const token = req.headers.access.split(' ')[1]
    const {role: userRole} = jwt.verify(token, secret)
    if(userRole > 2){
        return res.status(201).json({status: "1", result: true})
    }
    else{
        return res.status(201).json({status: "1", result: false})
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
        console.log(result[0])
        return res.status(201).json({status: "1", result: result[0]})
    }).catch((error)=> {
        return res.status(201).json({status: "2"})
    })


});




module.exports = router;