const express = require('express');
const router = express.Router();
const dataBase = require('../database');
const {QueryTypes} = require("sequelize");
const middleWare = require('../middleware/roleMiddleWare')
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





module.exports = router;