const express = require('express');
const router = express.Router();
const dataBase = require('../database');
const jwt = require('jsonwebtoken');
const {QueryTypes} = require("sequelize");
const {secret} = require('./secretKey');


router.post('/allInfo', async function(req, res, next) {

    const token = req.headers.access.split(' ')[1]
    if(!token){
        return res.status(201).json({status: "2"})
    }
    else{
        const {id: id} = jwt.verify(token, secret)
        await dataBase.sequelize.query(
            `
        SELECT ROW_NUMBER() over(), E.*
        FROM
        (
        SELECT D.USER_ID, (SUM(D.CORRECT_ANSWER_COUNT) * 100.0 / SUM(D.COUNTER))::numeric(6, 2) AS QUESTION_PERCENT, SUM(D.COUNTER) AS QUESTION_COUNT
        FROM (
        SELECT A.TEST_PASSING_ID, A.TEST_ID, A.USER_ID, A.CORRECT_ANSWER_COUNT, COUNT(C.*) AS COUNTER FROM TEST_PASSINGS A
        JOIN TESTS B
        ON A.TEST_ID = B.TEST_ID
        JOIN QUESTIONS C
        ON B.TEST_ID = C.TEST_ID
        WHERE A.TEST_PASSING_STATUS_ID = 3
        GROUP BY A.TEST_PASSING_ID, A.TEST_ID, A.USER_ID, A.CORRECT_ANSWER_COUNT
        ) D
        GROUP BY D.USER_ID
        ORDER BY QUESTION_PERCENT DESC
        LIMIT 10
        ) E
`).then(async percentsAll =>{
            await dataBase.sequelize.query(
                ` 
            SELECT F.* FROM
            (
            SELECT ROW_NUMBER() over(), E.*
            FROM
            (
            SELECT D.USER_ID, (SUM(D.CORRECT_ANSWER_COUNT) * 100.0 / SUM(D.COUNTER))::numeric(6, 2) AS QUESTION_PERCENT, SUM(D.COUNTER) AS QUESTION_COUNT
            FROM (
            SELECT A.TEST_PASSING_ID, A.TEST_ID, A.USER_ID, A.CORRECT_ANSWER_COUNT, COUNT(C.*) AS COUNTER FROM TEST_PASSINGS A
            JOIN TESTS B
            ON A.TEST_ID = B.TEST_ID
            JOIN QUESTIONS C
            ON B.TEST_ID = C.TEST_ID
            WHERE A.TEST_PASSING_STATUS_ID = 3
            GROUP BY A.TEST_PASSING_ID, A.TEST_ID, A.USER_ID, A.CORRECT_ANSWER_COUNT
            ) D
            GROUP BY D.USER_ID
            ORDER BY QUESTION_PERCENT DESC
            ) E
            ) F
            WHERE F.USER_ID = \'${id}\'
            `
            ).then(async percentsOnly =>{
                await dataBase.sequelize.query(
                    ` 
                SELECT ROW_NUMBER() over(), E.*
                FROM(
                SELECT D.USER_ID, SUM(D.CORRECT_ANSWER_COUNT), SUM(D.COUNTER) AS ALL
                FROM (
                SELECT A.TEST_PASSING_ID, A.TEST_ID, A.USER_ID, A.CORRECT_ANSWER_COUNT, COUNT(C.*) AS COUNTER FROM TEST_PASSINGS A
                JOIN TESTS B
                ON A.TEST_ID = B.TEST_ID
                JOIN QUESTIONS C
                ON B.TEST_ID = C.TEST_ID
                WHERE A.TEST_PASSING_STATUS_ID = 3
                GROUP BY A.TEST_PASSING_ID, A.TEST_ID, A.USER_ID, A.CORRECT_ANSWER_COUNT
                ) D
                GROUP BY D.USER_ID
                ORDER BY SUM DESC
                LIMIT 10
                ) E
                `
                ).then(async summaryAll =>{
                    await dataBase.sequelize.query(
                        `
                    SELECT F.*
                    FROM
                    (
                    SELECT ROW_NUMBER() over(), E.*
                    FROM(
                    SELECT D.USER_ID, SUM(D.CORRECT_ANSWER_COUNT), SUM(D.COUNTER) AS ALL
                    FROM (
                    SELECT A.TEST_PASSING_ID, A.TEST_ID, A.USER_ID, A.CORRECT_ANSWER_COUNT, COUNT(C.*) AS COUNTER FROM TEST_PASSINGS A
                    JOIN TESTS B
                    ON A.TEST_ID = B.TEST_ID
                    JOIN QUESTIONS C
                    ON B.TEST_ID = C.TEST_ID
                        WHERE A.TEST_PASSING_STATUS_ID = 3
                    GROUP BY A.TEST_PASSING_ID, A.TEST_ID, A.USER_ID, A.CORRECT_ANSWER_COUNT
                    ) D
                    GROUP BY D.USER_ID
                    ORDER BY SUM DESC
                    ) E
                    ) F
                    WHERE F.USER_ID = \'${id}\'
                    `
                    ).then( summaryOnly =>{
                        return res.status(201).json({status: "1", percentsAll: percentsAll[0], percentsOnly: percentsOnly[0], summaryAll: summaryAll[0], summaryOnly: summaryOnly[0]})
                    })
                })
            }) }).catch((error)=> {
            return res.status(201).json({status: "2"})
        })
    }

});


module.exports = router;

