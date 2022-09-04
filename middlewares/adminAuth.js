const jwt = require('jsonwebtoken')
const adminAuth = (req, res, next) =>{
    try {
        const {accesstoken} = req.headers;
        console.log(accesstoken);
        const exectToken = accesstoken.split(' ')[1]
        const data =  jwt.verify(exectToken, process.env.ACCESSTOKEN)
        const {admin_id, admin_name} = data;
        req.admin_id = admin_id;
        req.name = admin_name

        next()
    } catch (error) {
        console.log(error.message)
        return res.status(401).json({error : 'Access Denied!'})
    }
}

module.exports = adminAuth;