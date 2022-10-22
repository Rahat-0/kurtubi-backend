const db = require("../sql");

const resultAction = {

    branchAndClass(req, res, next) {

        const queryString = `SELECT branch, result_class FROM results NATURAL JOIN students`
        db.execute(queryString, (error, result) => {
            if (error) {
                console.log(error.message)
                next(error)
                return;
            }
            console.log('branch showing')
            res.json(result)
        })
    },

    resultAll(req, res, next) {
        const classes = req.params['classes']
        const branch = req.params['branch']
        const queryString = `SELECT CONCAT(first_name, ' ', last_name) AS 'name' , result_class, branch, student_id, result_semester, subject_name, subject_result, subject_ranking, teacher_id FROM results NATURAL JOIN students WHERE students.branch  = '${branch}' AND results.result_class = ${classes}`
        db.execute(queryString, (error, result) => {
            if (error) {
                console.log(error.message)
                next(error)
                return;
            }
            console.log(result)
            res.json({ result })
        })
    },

    resultAllTeacher(req, res, next) {
        const teacher_id = req.teacher_id;
        console.log(teacher_id);
        const classes = req.params['classes']
        const queryString = `SELECT CONCAT(first_name, ' ', last_name) AS 'name' , result_class, branch, student_id, result_semester, subject_name, subject_result, subject_ranking, teacher_id FROM results NATURAL JOIN students WHERE results.teacher_id = ${teacher_id} AND results.result_class = ${classes}`
        db.execute(queryString, (error, result) => {
            if (error) {
                console.log(error.message)
                next(error)
                return;
            }
            console.log({result})
            res.json({ result })
        })
    },


    resultOneAll(req, res, next) {
        const student_id = req.params['id']
        const queryString = `SELECT CONCAT(first_name, ' ', last_name) AS 'name', classes, student_id, semester, subject_name, subject_result, subject_ranking, teacher_id FROM results NATURAL JOIN students WHERE student_id = ${student_id} `
        db.execute(queryString, (error, result) => {
            if (error) {
                console.log(error.message)
                next(error)
                return;
            }
            console.log(result)
            res.json({ result })
        })
    },

    // for student actions
    resultOneStudent(req, res, next) {
        const student_id = req.student_id;
        const queryString = `SELECT result_class, student_id, result_semester, subject_name, subject_result, subject_ranking, teacher_id FROM results  WHERE student_id = ${student_id} `
        db.execute(queryString, (error, result) => {
            if (error) {
                console.log(error.message)
                next(error)
                return;
            }
            console.log(result)
            res.json(result)
        })
    },

    // only teacher can insert data.
    // teacher must be permited for insert result.
    // teacher can add only his/har departmental subject.
    resultAddTeacher(req, res, next) {
        const getData = req.body;
        const teacher_id = req.teacher_id;
        const ispermit = req.ispermit;
        const subject = req.subject;
        console.log(getData[0])

        if (ispermit !== 1) {
            return res.status(401).json({ error: "you are not eligible for add result!!" })
        }

        if (getData.every((e) => e.student_id && e.result_semester && e.subject_result && e.subject_ranking && e.result_class)) {
            db.query('SELECT student_id from students', (error, students_id) => {
                const invalidStudent = getData.filter((value) => {
                    if (students_id.every((stu) => stu.student_id != value.student_id)) {
                        return value
                    }
                    return null
                })
                if (invalidStudent[0]) {
                    console.log(invalidStudent);
                    return res.status(406).json({ error: invalidStudent })
                } else {
                    const data = req.body.map((item) => [item.result_class, item.result_semester, item.student_id, subject, item.subject_result, item.subject_ranking, teacher_id])
                    console.log(data);
                    const queryString = `INSERT INTO results ( result_class, result_semester, student_id, subject_name, subject_result, subject_ranking, teacher_id) VALUES ?`

                    db.query(queryString, [data], (error, result) => {
                        if (error) {
                            console.log(error.message)
                            next(error)
                            return;
                        }
                        console.log(result)
                        res.json(result)
                    })

                }

            })
        }

    },

    // only admin can insert many data.
    resultAddMany(req, res, next) {
        const getData = req.body;
        try {
            console.log(getData);
            if (getData.every((e) => e.student_id && e.teacher_id && e.result_semester && e.subject_name && e.subject_result && e.subject_ranking && e.result_class)) {
                db.query('SELECT student_id from students', (error, students_id) => {
                    const invalidStudent = getData.filter((value) => {
                        if (students_id.every((stu) => stu.student_id != value.student_id)) {
                            return value
                        }
                        return null
                    })
                    if (invalidStudent[0]) {
                        console.log(invalidStudent);
                        return res.status(406).json({ error: invalidStudent })
                    } else {
                        const data = getData.map((item) => [item.result_class, item.result_semester, item.student_id, item.subject_name, item.subject_result, item.subject_ranking, item.teacher_id])
                        const queryString = `INSERT INTO results ( result_class, result_semester, student_id, subject_name, subject_result, subject_ranking, teacher_id) VALUES ?`;

                        db.query(queryString, [data], (error, result) => {
                            if (error) {
                                console.log(error.message)
                                next(error)
                                return;
                            }
                            console.log(result)
                            res.json(result)
                        })

                    }

                })

            } else {
                return res.status(406).json({ error: 'invalid data!' });
            }
        } catch (error) {
            next(error)
        }






    },


    resultUpdate(req, res, next) {
        const { student_id, semester, subject_name, subject_result, subject_ranking, updated_semester, updated_subject_name } = req.body;
        if (!student_id || !semester || !subject_name || !subject_result || !subject_ranking) {
            return res.json({ error: 'field should not be empty!!' })
        }
        const queryString = `UPDATE results SET semester = ${updated_semester ? updated_semester : semester}, subject_ranking = ${subject_ranking}, subject_name = '${updated_subject_name ? updated_subject_name : subject_name}', subject_result = ${subject_result}  WHERE student_id = ${student_id} AND subject_name = '${subject_name}' AND semester = ${semester}`
        db.execute(queryString, (error, result) => {
            if (error) {
                console.log(error.message)
                next(error)
                return;
            }
            console.log(result)
            res.json({ result })
        })
    },


    resultDelete(req, res, next) {
        const { student_id, semester, subject_name } = req.body;
        if (!id || !semester || !subject_name) {
            return res.json({ error: 'field should not be empty!!' })
        }
        const queryString = `DELETE FROM results WHERE id = ${id} AND semester = ${semester} AND subject_name = '${subject_name}' `
        db.execute(queryString, (error, result) => {
            if (error) {
                console.log(error.message)
                next(error)
                return;
            }
            console.log(result)
            res.json({ result })
        })
    }
}

module.exports = resultAction;