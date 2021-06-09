const express = require('express');
const router = express.Router();
const dataBase = require('../database');
const jwt = require('jsonwebtoken');
const {QueryTypes} = require("sequelize");
const {secret} = require('./secretKey');




const User = dataBase.user;

const generateAccessToken = (id, role) =>{
    const payload = {
        id, role
    }

    const a = jwt.sign(payload, secret, {expiresIn: "12h"})

    return a;
}

router.post('/',async function(req, res, next) {
    await dataBase.sequelize.query(`SELECT COUNT(*), LOGIN, USER_CATEGORY_ID FROM USERS WHERE users.login = \'${req.body.login}\' and users.password = \'${req.body.password}\' GROUP BY LOGIN, USER_CATEGORY_ID`
    ).then(result=>{
        if(result[0].length != 0){
            const resultAuth = result[0][0]
            if(resultAuth.count === '1'){

                const token = generateAccessToken(resultAuth.login, resultAuth.user_category_id)

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