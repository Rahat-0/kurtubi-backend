const jwt = require('jsonwebtoken');
const db = require('../sql');
const refreshToken =  (req, res, next) => {
    try {
        const { refreshtoken } = req.headers;
        const exectToken = refreshtoken.split(' ')[1]
        const data = jwt.verify(exectToken, process.env.REFRESHTOKEN)
        const { student_id, teacher_id, admin_id } = data;
        if(student_id){
            const queryString = `SELECT CONCAT(first_name,' ', last_name) AS 'name', student_id, dob, image, isblock FROM students WHERE student_id = ${student_id} `
        db.execute(queryString, async (err, result) => {
            if (err) {
                return next(err)
            }
            const { student_id, teacher_id, dob, name, image, isblock } = result[0]
            const accessToken = jwt.sign({ student_id, dob, name, image, isblock }, process.env.ACCESSTOKEN, { expiresIn: '30s' })
            res.setHeader('accesstoken', "bearer " + accessToken)
            return res.json({ success: "login success!! ", accesstoken : "bearer " + accessToken })
        }
        )
        }
	if(teacher_id){
            const queryString = `SELECT full_name AS name, teacher_id, dob, image, isblock, ispermit FROM teachers WHERE teacher_id = ${teacher_id} `
            db.execute(queryString, async (err, result) => {
            if (err) {
                return next(err)
            }
            const {  teacher_id, dob, name, isblock, image, ispermit } = result[0]
            const accessToken = jwt.sign({ teacher_id, dob, name, image, isblock, ispermit }, process.env.ACCESSTOKEN, { expiresIn: '30s' })
            res.setHeader('accesstoken', "bearer " + accessToken)
            return res.json({ success: "login success!! ", accesstoken : "bearer " + accessToken })
        }
        )
        }

        if(admin_id){
            const queryString = `SELECT admin_id, admin_name FROM admin WHERE admin_id = ${admin_id} `
            db.execute(queryString, async (err, result) => {
            if (err) {
                return next(err)
            }
            const {  admin_id, admin_name } = result[0]
            const accessToken = jwt.sign({ admin_id, admin_name }, process.env.ACCESSTOKEN, { expiresIn: '30m' })
            res.setHeader('accesstoken', "bearer " + accessToken)
            return res.json({ success: "login success!! ", accesstoken : "bearer " + accessToken })
        }
        )
        }

    } catch (error) {
        console.log(error.message)
        return res.status(401).json({ error: 'Access Denied!!!' })
    }
}

module.exports = refreshToken;