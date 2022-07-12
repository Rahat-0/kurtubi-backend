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
        const queryString = `SELECT * FROM students WHERE student_id = ${student_id} `
        db.execute(queryString, async (err, result) => {
            if (err) {
                return next(err)
            }
            try {
                const { student_id, dob, password, first_name } = result[0]
                const check = await bcrypt.compare(pass, password)
                if (check) {
                    const token = jwt.sign({ student_id, dob, first_name }, process.env.JWTSECRET)
                    res.setHeader('token', "bearer " + token)
                    return res.json({ success: "login success!! " })
                } else {
                    return res.json({ error: "student_id or password incorrect!!" })
                }


            } catch (error) {
                return res.json({error : "student_id or password incorrect!!"})
            }

        }
        )
    }

    if (teacher_id && password) {
        const queryString = `SELECT * FROM teachers WHERE teacher_id = ${teacher_id} `
        db.execute(queryString, async (err, result) => {
            if (err) {
                return next(err)
            }

            try {
                const { teacher_id, subject, password, first_name, ispermit } = result[0]
                const check = await bcrypt.compare(pass, password)
                if (check) {
                    const token = jwt.sign({ teacher_id, subject, first_name, ispermit }, process.env.JWTSECRET)
                    res.setHeader('token', "bearer " + token)
                    return res.json({ success: "login success!! " })
                } else {
                    return res.json({ error: "teacher_id or password incorrect!!" })
                }

            } catch (error) {
                return res.json({error : "teacher_id or password incorrect!!"})
            }


        }
        )
    }

}

module.exports = login;