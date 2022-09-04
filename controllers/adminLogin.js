const db = require("../sql");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const adminLogin = async (req, res, next) => {

    const { admin_id, admin_password } = req.body;
    const pass = admin_password;
    if (!admin_id) {
        return res.json({ error: "user id required!!" })
    }
    if (!admin_password) {
        return res.json({ error: "password required!!" })
    }


    if (admin_id && admin_password) {
        const queryString = `SELECT admin_name, admin_password, admin_id FROM admin WHERE admin_id = ${admin_id}`
        db.execute(queryString, async (err, result) => {
            if (err) {
                return next(err)
            }
            try {
                const { admin_name, admin_password, admin_id } = result[0]
                console.log(result[0])
                const check = await bcrypt.compare(pass, admin_password)

                console.log(check)

                if (check) {
                    const accessToken = jwt.sign({ admin_name, admin_id }, process.env.ACCESSTOKEN, { expiresIn: '30m' })
                    const refreshToken = jwt.sign({ admin_name, admin_id }, process.env.REFRESHTOKEN, { expiresIn: '3d' })
                    res.setHeader('accesstoken', "bearer " + accessToken)
                    res.setHeader('refreshtoken', "bearer " + refreshToken)
                    return res.json({
                        success: "login success! ",
                        accesstoken: "bearer " + accessToken,
                        refreshtoken: 'bearer ' + refreshToken
                    })
                } else {
                    return res.json({ error: "incorrect user or password" })
                }

            } catch (error) {
                console.log(error)
                return res.json({ error: 'incorrect user or password!!' })
            }

        }
        )
    }

}

module.exports = adminLogin;