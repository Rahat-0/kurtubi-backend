const jwt = require('jsonwebtoken')
const adminAuth = (req, res, next) =>{
    try {
        const {token} = req.headers;
        const exectToken = token.split(' ')[1]
        const data =  jwt.verify(exectToken, process.env.JWTSECRET)
        const {admin_id, admin_name} = data;
        req.admin_id = admin_id;
        req.name = admin_name

        next()
    } catch (error) {
        console.log(error.message)
        return res.json({error : 'Access Denied!!!'})
    }
}

module.exports = adminAuth;