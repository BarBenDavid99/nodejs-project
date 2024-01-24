const bcrypt = require('bcrypt');
const { User } = require('./user.model');
const { SignupValid } = require("./user.joi");

module.exports = app => {

    app.post("/users", async (req, res) => {
        const { name, phone, email, password, address, image, isBusiness } = req.body;

        const validate = SignupValid.validate(req.body, { abortEarly: false });

        if (validate.error) {
            const errors = validate.error.details.map(err => err.message);
            return res.status(403).send(errors);
        }

        const user = new User({
            name,
            isBusiness,
            phone,
            email,
            password: await bcrypt.hash(password, 10),
            address,
            image,
        })

        const newUser = await user.save();
        res.send(newUser);
    });
}