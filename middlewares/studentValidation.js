const studentValidation = (req, res, next) => {
    const { student_id, first_name, last_name, email, dob, phone, department, classes, gender, roll } = req.body;
    try {
         if (!first_name) {
            return res.json({ error: 'first name required!!' }) 
        } else if (!last_name) {
            return res.json({ error: 'last name required!!' })
        } else if (!email) {
            return res.json({ error: 'email required!!' })
        } else if (!dob) {
            return res.json({ error: 'date of birth required!!' })
        } else if (!phone) {
            return res.json({ error: 'phone number required!!' })
        } else if (!department) {
            return res.json({ error: 'department required!!' })
        } else if (!classes) {
            return res.json({ error: 'class name required!!' })
        } else if (!roll) {
            return res.json({ error: 'roll required!!'  })
        } else if (!gender) {
            return res.json({ error: 'gender required!!' })
        }

        if (first_name.length > 50) {
            return res.json({ error: 'first name too long!!' })
        } else if (!last_name.length > 50) {
            return res.json({ error: 'last name too long!!' })
        } else if (!email.length > 50) {
            return res.json({ error: 'email too long!!' })
        } else if (!dob.length > 10) {
            return res.json({ error: 'date of birth too long!!' })
        } else if (!phone.length > 20) {
            return res.json({ error: 'phone number too long!!' })
        } else if (!department.length > 50) {
            return res.json({ error: 'department too long!!' })
        } else if (!classes.length > 10) {
            return res.json({ error: 'class name too long!!' })
        } else if (!roll.length > 50) {
            return res.json({ error: 'roll too long!!' })
        }

        if (gender !== 'male' && gender !== 'female') {
            return res.json({ error: 'gender must be valid!!' })
        }

        req.validation = { student_id, first_name, last_name, dob, email, phone, department, classes, gender, roll }
        next()
    } catch (error) {
        console.log(error)
        next(error)
        return;
    }

}

module.exports = studentValidation;