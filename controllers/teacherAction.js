const db = require("../sql")

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

  // add one teacher.
  addTeacher(req, res, next) {
    const { full_name, email, dob, designation, subject, education, varsity_name, gender, phone } = req.validation;
    const image = req.file ? req.file.filename : 'teacher.jpg'
    const queryString = `INSERT INTO teachers
     (full_name, email, dob, designation, subject, education, varsity_name, gender, phone, image )
     VALUES('${full_name}', '${email}', '${dob}', '${designation}', '${subject}', '${education}','${varsity_name}', '${gender}', '${phone}', '${image}') `

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


}