const nodemailer = require('nodemailer')
const db = require("../sql");
const bcrypt = require('bcrypt')

const redis = require('redis')
let redisClient = redis.createClient()

redisClient.connect().then(() => {console.log('redis connected!');})
.catch((err) => {console.log({ err });
})

// password recover function with secure code and user
const recovers = (req, res, next) => {
    try {
        let { password, code } = req.params;
        redisClient.get('code').then((data) => {
            if (data) {
                if (code == data) {
                    redisClient.get('user_id').then( async (user_id) => {
                        const hashed = await bcrypt.hash(password, 10)
                        const queryString = `UPDATE students SET password = '${hashed}' WHERE student_id = ${user_id}`
                        db.query(queryString, (err, result) => {
                            if (err) {
                                return ress.status(403).json(err)
                            }
                            return res.json(result)
                        })

                    })

                } else {
                    return res.status(403).json('code invalid!')
                }
            } else {
                return res.status(403).json('code invalid!')
            }
            redisClient.del('code')
            redisClient.del('user_id')
        })

    } catch (error) {
        console.log(error.message);
        next(error)
    }

}


// password forgot function. will generate a secure code and send to the users email.
const forgotPass = async (req, res, next) => {
    let code = () => Math.floor(Math.random() * 100000)

    let codes = code()
    try {
        redisClient.setEx('code', 60 * 10, JSON.stringify(codes))
        const { email } = req.body;
        const queryString = `SELECT student_id, email, image FROM students WHERE email = '${email}'`
        db.query(queryString, (err, result) => {
            if (err) {
                return res.json(err.message)
            }
    
            if (result[0]) {
                redisClient.setEx('user_id', 60 * 10, JSON.stringify(result[0].student_id))
                const transporter = nodemailer.createTransport({
                    // service: 'hotmail',
                    host : "mail.nuisters.com",
                    port : 465 ,
                    auth: {
                        user: process.env.MAILNAME,
                        pass: process.env.MAILPASS
                    }
                })
    
                const mailOption = {
                    from: process.env.MAILNAME,
                    to: result[0].email,
                    subject: 'Recover Kurtubi Password',
                    html: `<!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta http-equiv="X-UA-Compatible" content="IE=edge">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>password recover mail from KMT</title>
                        <style>
                            *{
                                font-family:Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
                            }
                        </style>
                    </head>
                    <body>
                        <div style="height: auto; padding: 5px;">
                            <div style="margin-bottom: 4rem ;">
                                <div>
                                    <a style="display: flex ;text-decoration: none; font-weight: bold; font-size: xx-large; text-transform: uppercase; justify-content: start; align-items: center;" href="https://kurtubi.nuisters.com" blank>
                                        <img width="50" src="http://nuisters.com/kurtubi.jpg" alt="">
                                        <span style="margin-left: 1rem;">Kurtubi Madrasah Tangail</span>
                                    </a>
                                </div>
                            </div>
                            <p style="font-size: 1.6em; color : #3a3a3a" >Your Password Reset Code is:</p>
                            <p style="font-size: 2.5em; color: #1f1e1e; ">${codes}</p>
                            <div style="color: #3a3a3a; font-size: x-large;">
                                <p style="color: rgb(206, 42, 42);">This code will be valid for 10 minutes, Please don't share this code with
                                    anyone! </p>
                                <p >To keep your account secure, we recommend using a unique password for your Kurtubi
                                    account or Access’ two-factor authentication makes signing in to your account easier, without needing to
                                    remember or change passwords.</p>
                            </div>
                    
                            <div style="text-align: center; margin-top: 9em;">
                                <a style="text-decoration: none; color: #1f1e1e; " href="https://kurtubi.nuisters.com"> © 2022 kurtubi madrasah tangail </a>| 1990 Tangail City, Dhaka,
                                Bangladesh | phone : 01710218990
                            </div>
                        </div>
                    </body>
                    
                    </html>`
    
                }
    
                transporter.sendMail(mailOption, (err, info) => {
                    if (err) {
                        return res.json(err.message)
                    }
    
                    return res.json({info, result})
    
                })
            } else {
                return res.status(404).json('user not found!')
            }
    
    
    
    
        }
    
        )
        
    } catch (error) {
        console.log(error.message);
        next(error)
    }









}

module.exports = { forgotPass, recovers };