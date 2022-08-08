const jwt = require('jsonwebtoken')
const teacherAuth = (req, res, next) =>{
    try {
        const {accesstoken} = req.headers;
        const exectToken = accesstoken.split(' ')[1]
        const data =  jwt.verify(exectToken, process.env.ACCESSTOKEN)
        const {teacher_id, dob, name, ispermit} = data;
        if(!teacher_id){
            return res.status(403).json({error : "unknown author!"})
        }
        if(isblock == 1){
            return res.status(402).json({error : "account has been blocked!"})
        }else{
            req.ispermit = ispermit;
            req.teacher_id = teacher_id;
            req.dob = dob ;
            req.name = name;
            next()
        }
        
    } catch (error) {
        console.log(error.message)
        return res.status(401).json({error : 'Access Denied!!!'})
    }
}

module.exports = teacherAuth;