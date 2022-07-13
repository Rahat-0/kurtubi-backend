const jwt = require('jsonwebtoken')
const studentAuth = (req, res, next) =>{
    try {
        const {token} = req.headers;
        const exectToken = token.split(' ')[1]
        const data =  jwt.verify(exectToken, process.env.JWTSECRET)
        const {student_id, dob, first_name} = data;
        req.student_id = student_id;
        req.dob = dob;
        req.name = first_name

        next()
    } catch (error) {
        console.log(error.message)
        return res.status(401).json({error : 'Access Denied!!!'})
    }
}

module.exports = studentAuth;