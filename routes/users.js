var express = require('express');
var router = express.Router();
var dataBase = require('../database');
const jwt = require('jsonwebtoken');
const {QueryTypes} = require("sequelize");
const {secret} = require('./secretKey');




var User = dataBase.user;


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/all', async function(req, res, next) {
  User.findAll({raw:true}).then(users=>{
    res.status(200).json(users);
  }).catch((error)=> res.status(500).json({message: "error"}));
});


router.post('/add',async function(req, res, next) {
  if(req.body.login === null)
    res.status(500).json({message: "error"})
  else if(req.body.password === null)
    res.status(500).json({message: "error"})
  else
  User.create(req.body).then(result=>{
    res.status(201).json({message: "Пользователь успешно добавлен"})
  }).catch((error)=> {

    res.status(500).json({message: "error"})

  })

});



router.get('/try', async function(req, res, next) {



  await dataBase.sequelize.query('SELECT COUNT(*) FROM user_categories where user_category_id =3').then(result=>{
    res.status(201).json(result[1].rows)
  }).catch((error)=> {

    res.status(500).json({message: "error"})

  })


});

router.get('/empty', async function(req, res, next) {
   await dataBase.sequelize.query('SELECT * FROM user_categories where user_category_id =4').then(result=>{
    res.status(201).json(result[1])
  }).catch((error)=> {

    res.status(500).json({message: "error"})

  })


});




module.exports = router;
