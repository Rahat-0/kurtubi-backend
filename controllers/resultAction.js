const db = require("../sql");

const resultAction = {

   branchAndClass(req, res, next) {
        
        const queryString = `SELECT branch, classes FROM results NATURAL JOIN students`
        db.execute(queryString, (error, result) => {
            if (error) {
                console.log(error.message)
                next(error)
                return;
            }
            console.log(result)
            res.json(result )
        })
    },

    resultAll(req, res, next) {
        const classes = req.params['classes']
        const branch = req.params['branch']
        const queryString = `SELECT CONCAT(first_name, ' ', last_name) AS 'name' , classes, branch, student_id, result_semester, subject_name, subject_result, subject_ranking, teacher_id FROM results NATURAL JOIN students WHERE students.branch  = '${branch}' AND students.classes = ${classes}`
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
            res.json( result )
        })
    },

// only teacher can insert data.
// teacher must be permited for insert result.
// teacher can add only his/har departmental subject.
    resultAdd(req, res, next) {
        const { student_id, semester, subject_name, subject_result, subject_ranking } = req.body;
        const teacher_id = req.teacher_id;
        const ispermit = req.ispermit;
        const subject = req.subject;
        console.log(subject, subject_name)
        
        if(!ispermit || ispermit == 0){
            return res.json({error : "you are not eligible for add result!!"})
        }

        if (!student_id || !semester || !subject_name || !subject_result || !subject_ranking) {
            return res.json({ error: 'field should not be empty!!' })
        }
        
        if(ispermit == 1 && subject == subject_name){
            const queryString = `INSERT INTO results ( semester, student_id, teacher_id, subject_name, subject_result, subject_ranking )
         VALUES(${semester}, ${student_id}, ${teacher_id}, '${subject_name}', ${subject_result}, ${subject_ranking})`
            db.execute(queryString, (error, result) => {
            if (error) {
                console.log(error.message)
                next(error)
                return;
            }
            console.log(result)
            res.json({ result })
        })
        }else{
            return res.json({error : "unable to add another subject!!"})
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