const express = require('express');
const router = express.Router();
const dataBase = require('../database');
const {QueryTypes} = require("sequelize");






router.post('/', async function(req, res, next) {
    await dataBase.sequelize.query(`SELECT COUNT(*) AS counter FROM USERS WHERE users.USER_ID = \'${req.body.login}\' or users.email = \'${req.body.email}\'`
    ).then(result=>{
        const isOk = result[0][0].counter;
        if(isOk === '0'){
            return res.status(201).json({status: "1"})
        }
        if(isOk === '1'){
            return res.status(201).json({status: "2"})
        }

    }).catch((error)=> {
        return res.status(503).json({message: "Соединение с БД потеряно"})

    })


});


router.post('/complete', async function(req, res, next) {

    await dataBase.sequelize.query(`INSERT INTO USERS VALUES(\'${req.body.login}\', \'${req.body.password}\', \'${req.body.email}\', \'${req.body.user_category_id}\')`
    ).then(result=>{
        return res.status(201).json({status: "1"})
    }).catch((error)=> {
        return res.status(201).json({message: "Соединение с БД потеряно"})
    })


});





module.exports = router;