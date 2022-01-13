const express = require('express');
const router = express.Router();
const dataBase = require('../database');
const jwt = require('jsonwebtoken');
const {QueryTypes} = require("sequelize");
const {secret} = require('./secretKey');
const {request} = require("express");




const User = dataBase.user;

const generateAccessToken = (id, role) =>{
    const payload = {
        id, role
    }

    const a = jwt.sign(payload, secret)
    return a;
}

router.post('/',async function(req, res, next) {

    await dataBase.sequelize.query(`SELECT COUNT(*), USER_ID, USER_CATEGORY_ID FROM USERS WHERE users.user_id = \'${req.body.login}\' and users.password = \'${req.body.password}\' GROUP BY USER_ID, USER_CATEGORY_ID`
    ).then(result=>{
        if(result[0].length != 0){
            const resultAuth = result[0][0]
            if(resultAuth.count === '1'){

                const token = generateAccessToken(resultAuth.user_id, resultAuth.user_category_id)

                return res.status(201).json({token, status: "1", level: resultAuth.user_category_id})
            }
        }

        else{
            return res.status(201).json({message: "Пользователь не найден в БД", status: "2"})
        }

    }).catch((error)=> {
        return res.status(201).json({message: "Соединение с БД потеряно"})

    })


});


module.exports = router;