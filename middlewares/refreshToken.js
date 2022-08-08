const jwt = require('jsonwebtoken');
const db = require('../sql');
const refreshToken =  (req, res, next) => {
    try {
        const { refreshtoken } = req.headers;
        const exectToken = refreshtoken.split(' ')[1]
        const data = jwt.verify(exectToken, process.env.REFRESHTOKEN)
        const { student_id, teacher_id } = data;
        if(student_id){
            const queryString = `SELECT CONCAT(first_name +' '+ last_name) AS name, student_id, dob, isblock FROM students WHERE student_id = ${student_id} `
        db.execute(queryString, async (err, result) => {
            if (err) {
                return next(err)
            }
            const { student_id, teacher_id, dob, name, isblock } = result[0]
            const accessToken = jwt.sign({ student_id, dob, name, isblock }, process.env.ACCESSTOKEN, { expiresIn: '3m' })
            res.setHeader('accesstoken', "bearer " + accessToken)
            return res.json({ success: "login success!! " })
        }
        )
        }else if(teacher_id){
            const queryString = `SELECT full_name AS name, teacher_id, dob, isblock, ispermit FROM teachers WHERE teacher_id = ${teacher_id} `
            db.execute(queryString, async (err, result) => {
            if (err) {
                return next(err)
            }
            const {  teacher_id, dob, name, isblock, ispermit } = result[0]
            const accessToken = jwt.sign({ teacher_id, dob, name, isblock, ispermit }, process.env.ACCESSTOKEN, { expiresIn: '3m' })
            res.setHeader('accesstoken', "bearer " + accessToken)
            return res.json({ success: "login success!! " })
        }
        )
        }

    } catch (error) {
        console.log(error.message)
        return res.status(401).json({ error: 'Access Denied!!!' })
    }
}

module.exports = refreshToken;