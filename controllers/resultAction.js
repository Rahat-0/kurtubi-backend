const db = require("../sql");

const resultAction = {

    resultAll(req, res, next) {
        const classes = req.params['classes']
        const semester = req.params['semester']

        const queryString = `SELECT first_name, last_name, id, semester, subject_name, subject_result, subject_ranking FROM results NATURAL JOIN students WHERE results.semester  = ${semester} AND students.classes = ${classes}`
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
        const id = req.params['id']
        const queryString = `SELECT * FROM results WHERE id = ${id} `
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


    resultAdd(req, res, next) {
        const { id, semester, subject_name, subject_result, subject_ranking } = req.body;
        if (!id || !semester || !subject_name || !subject_result || !subject_ranking) {
            return res.json({ error: 'field should not be empty!!' })
        }
        const queryString = `INSERT INTO results ( semester, id, subject_name, subject_result, subject_ranking )
         VALUES(${semester}, ${id}, '${subject_name}', ${subject_result}, ${subject_ranking})`
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


    resultUpdate(req, res, next) {
        const { id, semester, subject_name, subject_result, subject_ranking, updated_semester, updated_subject_name } = req.body;
        if (!id || !semester || !subject_name || !subject_result || !subject_ranking) {
            return res.json({ error: 'field should not be empty!!' })
        }
        const queryString = `UPDATE results SET semester = ${updated_semester ? updated_semester : semester}, subject_ranking = ${subject_ranking}, subject_name = '${updated_subject_name ? updated_subject_name : subject_name}', subject_result = ${subject_result}  WHERE id = ${id} AND subject_name = '${subject_name}' AND semester = ${semester}`
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
        const { id, semester, subject_name } = req.body;
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