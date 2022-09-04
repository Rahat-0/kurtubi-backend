const db = require("../sql")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

exports.teacherAction = {

  counts(req, res, next){
    const branch = req.params['branch']
    const queryString = `select COUNT(teacher_id) AS 'count_teacher', (select COUNT(teacher_id) from teachers WHERE branch = '${branch}') AS 
    'count_branch', (select COUNT(teacher_id) from teachers WHERE isblock = '1') AS 'count_block'  from teachers `;
    db.query(queryString, (err, result) => {
      if (err) {
        return next(err.message);
      }
      console.log(result);
      res.json(result);
    });
  },

// get all branch handler
  allbranch(req, res, next) {
    const queryString = `select branch from teachers`;
    db.query(queryString, (err, result) => {
      if (err) {
        return next(err.message);
      }
      console.log(result);
      res.json(result);
    });
  },

  // get all teacher
  allThacher(req, res, next) {
    const branch = req.params['branch']
    const queryString = `SELECT * FROM teachers WHERE branch = '${branch}'`

    db.query(queryString, (err, result) => {
      err && console.log(err);
      if (err) {
        return next(err);
      }
	 res.json(result)
    });
  },

  // get one teacher
  oneThacher(req, res, next) {
    const teacher_id = req.params['id']
    const queryString = `SELECT * FROM teachers WHERE teacher_id = ${teacher_id}`

    db.query(queryString, (err, result) => {
      err && console.log(err);
      if (err) {
        return next(err);
      }

       res.json(result) 

    });
  },

    // get one teacher for teacher only
    singleThacher(req, res, next) {
      const teacher_id = req.teacher_id
      const queryString = `SELECT * FROM teachers WHERE teacher_id = ${teacher_id}`
  
      db.query(queryString, (err, result) => {
        err && console.log(err);
        if (err) {
          return next(err);
        }
  
         res.json(result) 
  
      });
    },

  // add one teacher.
  addTeacher(req, res, next) {
    const { full_name, email, dob, designation, subject, education, varsity_name, gender, phone, branch } = req.validation;
    const image = req.file ? req.file.filename : 'teacher.jpg'
    const queryString = `INSERT INTO teachers
     (full_name, email, dob, designation, subject, education, varsity_name, gender, phone, branch, image )
     VALUES('${full_name}', '${email}', '${dob}', '${designation}', '${subject}', '${education}','${varsity_name}', '${gender}', '${phone}', '${branch}', '${image}') `

    db.query(queryString, (err, result) => {
      err && console.log(err);
      if (err) {
        return next(err);
      }
      console.log(result);
      res.json(result);
    });
  },

  // update one teacher
  updateTeacher(req, res, next) {
    const { email, dob,  education, varsity_name, phone, teacher_id, currentImage } = req.body;
    if(!email || !dob || !education || !varsity_name || !phone || !teacher_id || !currentImage){
      return res.json({error : "field should not be empty!!"})
    }
    const image = req.file ? req.file.filename : currentImage
    const queryString = `UPDATE teachers SET
      email = '${email}', dob = '${dob}' , 
      education = '${education}', varsity_name = '${varsity_name}',  phone ='${phone}', image ='${image}'
      WHERE teacher_id = ${teacher_id}  `

    db.query(queryString, (err, result) => {
      err && console.log(err);
      if (err) {
        return next(err);
      }
      console.log(result);
      res.json(result);
    });
  },
  
  // delete one teacher
  deleteTeacher(req, res, next) {
    const teacher_id = req.params['id']
    const queryString = `DELETE FROM teachers WHERE teacher_id = ${teacher_id} `

    db.query(queryString, (err, result) => {
      err && console.log(err);
      if (err) {
        return next(err);
      }
      console.log(result);
      res.json(result);
    });
  },


  updatePassword(req, res, next) {
    const teacher_id = req.teacher_id;
    const { password, newPassword } = req.body;
    if (!password || !newPassword) {
      return res.json({ error: "field required!" })
    }
    const pass = password

    const queryString = `select * from teachers where teacher_id = ${teacher_id}`;
    db.query(queryString, (err, result) => {
      const updatePassExecution = async () => {
        try {
          if (err) {
            return next(err);
          }
          const { password } = result[0]
          const check = await bcrypt.compare(pass, password)
          if (check) {
            const setPass = await bcrypt.hash(newPassword, 10)
            db.execute(`UPDATE teachers SET password = '${setPass}' WHERE teacher_id = ${teacher_id} `, (err, result) => {
              if (err) {
                return next(err)
              }
              res.json(result)
            })
          } else {
            return res.json({ error: "password wrong!!" })
          }
        } catch (error) {
          next(error)
        }
      }
      updatePassExecution()
    });

  },

  // pure admin section func only.
  // isparmit actions
  isParmitAll(req, res, next){
    const {ispermit } = req.body;
    const value = ispermit ? 1 : 0
    const queryString = `UPDATE teachers SET ispermit = ${value}`
    db.query(queryString, (err, result) => {
      err && console.log(err);
      if (err) {
        return next(err);
      }
      console.log(result);
      res.json(result);
    });
  },

  isParmitOne(req, res, next){
    const {ispermit, teacher_id } = req.body;
    if(!teacher_id){
      return res.json({error : "teacher id required!!"})
    }
    const value = ispermit ? 1 : 0
    const queryString = `UPDATE teachers SET ispermit = ${value} WHERE teacher_id = '${teacher_id}'`
    db.query(queryString, (err, result) => {
      err && console.log(err);
      if (err) {
        return next(err);
      }
      console.log(result);
      res.json(result);
    });
  },

resetPassword(req, res, next) {
    const { teacher_id } = req.body;
    const defaultPass = '$2a$10$q47et2EFIp8imVnmf59yLeCvBaDfZkKuK5K8XeJWz5IqQXbBPJ02C'
    const queryString = `UPDATE teachers SET password = '${defaultPass}'  WHERE teacher_id = ${teacher_id} `;
    db.execute(queryString, (err, result) => {
      if (err) {
        return next(err)
      }
      res.json(result)

    })
  },


  blockTeacher(req, res, next){
    const { teacher_id, block } = req.body;
    const queryString = `UPDATE teachers SET isblock = ${block}  WHERE teacher_id = ${teacher_id} `;
    db.execute(queryString, (err, result) => {
      if (err) {
        return next(err)
      }
      res.json(result)
    })
  }


}