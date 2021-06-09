const jwt = require('jsonwebtoken')
const {secret} = require('../routes/secretKey')

module.exports = function (role){
    return function (req, res, next){
        if(req.method === "OPTIONS"){
            next()
        }

        try{

            const token = req.headers.access.split(' ')[1]
            if(!token){
                return res.status(201).json({status: "2", message: "Нет токена"});
            }
            console.log(token)
            const a= jwt.verify(token, secret)
            console.log(a);



            const {role: userRole} = jwt.verify(token, secret)
            let hasRole = false

            if(userRole >= role){
                hasRole = true
            }
            if(!hasRole){
                return res.status(201).json({ status: "2", message: "Нет доступа"});
            }
            next()
        }
        catch (e){
            console.log(e)
            return res.status(201).json({status: "2", message: "Вылезла ошибка"});
        }
    }
}