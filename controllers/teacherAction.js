const db = require("../sql")

exports.teacherAction = {
     // add one teacher.
  addTeacher(req, res, next) {
    const { full_name, email, dob, designation, subject, education, varsity_name, gender, phone } = req.validation;
    const image = req.file ? req.file.filename : 'teacher.jpg'
    const queryString = `INSERT INTO teachers
     (full_name, email, dob, designation, subject, education, varsity_name, gender, phone, ispermit, image )
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

}