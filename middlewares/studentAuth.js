const jwt = require('jsonwebtoken')
const studentAuth = (req, res, next) =>{
    try {
        const {accesstoken} = req.headers;
        if(!accesstoken){
            return res.status(403).json({error : 'error occured!'})
        }
        const exectToken = accesstoken.split(' ')[1]
        const data =  jwt.verify(exectToken, process.env.ACCESSTOKEN)
        console.log(data)
        const {student_id, dob, name, isblock} = data;
        if(!student_id){
            return res.status(403).json({error : "author unknown!"})
        }
        if(isblock == 1){
            return res.status(402).json({error : "account has been blocked!"})
        }else{
            req.student_id = student_id;
            req.dob = dob;
            req.name = name
            next()
        }
        
    } catch (error) {
        console.log(error.message)
        return res.status(401).json({error : 'Access Denied!!!'})
    }
}

module.exports = studentAuth;