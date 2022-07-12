const jwt = require('jsonwebtoken')
const teacherAuth = (req, res, next) =>{
    try {
        const {token} = req.headers;
        const exectToken = token.split(' ')[1]
        const data =  jwt.verify(exectToken, process.env.JWTSECRET)
        const {teacher_id, subject, first_name, ispermit} = data;
        req.ispermit = ispermit;
        req.teacher_id = teacher_id;
        req.subject = subject ;
        req.name = first_name;
        
        next()
    } catch (error) {
        console.log(error.message)
        return res.json({error : 'Access Denied!!!'})
    }
}

module.exports = teacherAuth;