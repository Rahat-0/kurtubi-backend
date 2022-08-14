const db = require("../sql");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
exports.studentAction = {
  counts(req, res, next){
    const branch = req.params['branch']
    const queryString = `select COUNT(student_id) AS 'count_student', (select COUNT(student_id) from students WHERE branch = '${branch}') AS 
    'count_branch', (select COUNT(student_id) from students WHERE isblock = '1') AS 'count_block' from students `;
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
    const queryString = `select branch from students`;
    db.query(queryString, (err, result) => {
      if (err) {
        return next(err.message);
      }
      console.log(result);
      res.json(result);
    });
  },

  // get all student handler
  allstudent(req, res, next) {
    const branch = req.params['branch']
    const queryString = `select CONCAT(first_name, ' ', last_name) AS 'name',
    student_id, roll, gender, dob, branch, classes, phone, isblock,
    email, image, time
    from students WHERE branch = '${branch}'`;
    db.query(queryString, (err, result) => {
      if (err) {
        return next(err.message);
      }
      console.log(result);
      res.json(result);
    });
  },

  // get single student handler
  // student part
  oneStudent(req, res, next) {
    const student_id = req.student_id;
    const queryString = `SELECT 
    student_id, first_name, last_name, roll, gender, dob, branch, classes, phone,
    email, image, time FROM students WHERE student_id = ${student_id}`;
    db.query(queryString, (err, result) => {
      if (err) {
        return next(err.message);
      }
      err && console.log(err.message);
      console.log(result);
      res.json(result);
    });
  },

  // update one student handler
  updateOneStudent(req, res, next) {
    const { student_id, first_name, last_name, dob, phone, email, department, classes, gender, roll } = req.validation;
    if (!student_id) {
      return res.json({ error: 'student_id has not define!' })
    }
    const queryString = `UPDATE students SET
    first_name = '${first_name}', last_name = '${last_name}', dob = '${dob}', phone = '${phone}',
    email = '${email}', department = '${department}', classes = '${classes}', gender = '${gender}', roll = '${roll}'
    WHERE student_id = ${student_id}`;

    db.query(queryString, (err, result) => {
      err && console.log(err);
      if (err) {
        return next(err);
      }
      console.log(result);
      res.json(result);
    });
  },

  // add one student handler
  addOneStudent(req, res, next) {
    const { first_name, last_name, dob, phone, email, department, classes, gender, roll } = req.validation;
    const image = req.file ? req.file.filename : 'student.jpg'
    const queryString = `INSERT INTO students
     (first_name, last_name, dob, phone, email, department, classes, gender, roll, image )
     VALUES('${first_name}', '${last_name}', '${dob}', '${phone}', '${email}', '${department}','${classes}', '${gender}', '${roll}', '${image}') `

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
    const student_id = req.student_id;
    const { password, newPassword } = req.body;
    if (!password || !newPassword) {
      return res.json({ error: "field required!" })
    }
    const pass = password

    const queryString = `select * from students where student_id = ${student_id}`;
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
            db.execute(`UPDATE students SET password = '${setPass}' WHERE student_id = ${student_id} `, (err, result) => {
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


  resetPassword(req, res, next) {
    const { student_id } = req.body;
    const defaultPass = '$2b$10$qPcgLUSHanH9zarSTFRYXOL73.8MVxdj4I/rEDGM/KjgzUJkLr5Xi'
    const queryString = `UPDATE students SET password = '${defaultPass}'  WHERE student_id = ${student_id} `;
    db.execute(queryString, (err, result) => {
      if (err) {
        return next(err)
      }
      res.json({ result })

    })
  }

};
