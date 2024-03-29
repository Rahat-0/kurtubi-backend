const db = require("../sql");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const login = async (req, res, next) => {

    const { student_id, teacher_id, password } = req.body;
    const pass = password;

    if (!student_id && !teacher_id) {
        return res.json({ error: "user id required!!" })
    }
    if (!password) {
        return res.json({ error: "password required!!" })
    }
    if (student_id && teacher_id) {
        return res.json({ error: "login action incorrect!!" })
    }

    if (student_id && password) {
        const queryString = `SELECT CONCAT(first_name,' ',last_name) AS 'name', password, image, student_id, dob, isblock FROM students WHERE student_id = ${student_id}`
        db.execute(queryString, async (err, result) => {
            if (err) {
                return next(err)
            }
            try {
                const { student_id, dob, password, name, image, isblock } = result[0]
                console.log(result[0])
                const check = await bcrypt.compare(pass, password)
		const notBlock = isblock === 0
		if(!notBlock){
			return res.status(403).json({error : 'account has been blocked'})
			}

                console.log(check)
                if (check && notBlock) {
                    const accessToken = jwt.sign({ student_id, dob, name, image, isblock }, process.env.ACCESSTOKEN, { expiresIn: '30s' })
                    const refreshToken = jwt.sign({ student_id, dob, name, image, isblock }, process.env.REFRESHTOKEN, { expiresIn: '3m' })
                   //res.setHeader('accesstoken', "bearer " + accessToken)
                   //res.cookie('refreshtoken', 'bearer ' + refreshToken)

                    return res.json({
                        success: "login success!! ",
                        accesstoken: "bearer " + accessToken,
                        refreshtoken: 'bearer ' + refreshToken
                    })
                } else {
                    return res.json({ error: "student_id or password incorrect!" })
                }


            } catch (error) {
		console.log(error)
                return res.json({ error: 'student_id or password incorrect!!!' })
            }

        }
        )
    }

    if (teacher_id && password) {
        const queryString = `SELECT full_name AS name, teacher_id, dob, image, subject, isblock, password, ispermit FROM teachers WHERE teacher_id = ${teacher_id} `
        db.execute(queryString, async (err, result) => {
            if (err) {
                return next(err)
            }

            try {
                const { teacher_id, dob, password, name, image, subject,  ispermit, isblock } = result[0]
                console.log(result[0])
                const check = await bcrypt.compare(pass, password)
		const notBlock = isblock === 0
		if(!notBlock){
			return res.status(403).json({error : 'account has been blocked'})
			}
                console.log(check)
                if (check && notBlock) {
                    const accessToken = jwt.sign({ teacher_id, dob, name, image, subject, isblock, ispermit }, process.env.ACCESSTOKEN, { expiresIn: '30s' })
                    const refreshToken = jwt.sign({ teacher_id, dob, name, image, isblock, ispermit }, process.env.REFRESHTOKEN, { expiresIn: '3m' })
                    res.setHeader('accesstoken', "bearer " + accessToken)
                    res.setHeader('refreshtoken', 'bearer ' + refreshToken)
                    return res.json({ 
                        success: "login success!! ",
                        accesstoken: "bearer " + accessToken,
                        refreshtoken: 'bearer ' + refreshToken
                     })
                } else {
                    return res.json({ error: "teacher_id or password incorrect!" })
                }

            } catch (error) {
                console.log(error)
                return res.json({ error: "teacher_id or password incorrect!!!" })
            }


        }
        )
    }

}

module.exports = login;