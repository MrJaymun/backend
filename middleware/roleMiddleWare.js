const jwt = require('jsonwebtoken')
const {secret} = require('../routes/secretKey')

module.exports = function (role){
    return function (req, res, next){
        if(req.method === "OPTIONS"){
            next()
        }

        try{
            const token = req.headers.authorization.split(' ')[1]
            if(!token){
                return res.status(403).json({message: "Не авторизован"});
            }
            const {roles: userRole} = jwt.verify(token, secret)
            let hasRole = false
            if(userRole >= role){
                hasRole = true
            }
            if(!hasRole){
                return res.status(403).json({message: "Нет доступа"});
            }
            next()
        }
        catch (e){
            return res.status(403).json({message: "Ошибка"});
        }
    }
}