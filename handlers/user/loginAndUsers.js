const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('./user.model');
const { getLoggedUserId } = require('../../config');
const guard = require("../../guard");
const { LoginValid, EditUserValid } = require("./user.joi");


module.exports = app => {



    app.post('/users/login', async (req, res) => {
        const { email, password } = req.body;

        const validate = LoginValid.validate({ email, password }, { abortEarly: false });

        if (validate.error) {
            const errors = validate.error.details.map(err => err.message);
            return res.status(403).send(errors);
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(403).send("email or password is incorrect");
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(403).send("email or password is incorrect");
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.send(token);
    });

    app.get('/users', guard, async (req, res) => {
        const userId = getLoggedUserId(req, res);
        const user = await User.findById(userId);
        const users = await User.find().select("-password");
        if (!user?.isAdmin) {
            return res.status(401).send('User not authorized');
        }
        res.send(users);
    })


    app.get('/users/me', guard, async (req, res) => {
        const userId = getLoggedUserId(req, res);
        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(403).send('User not found');
        }

        res.send(user);
    });

    app.get('/users/:id', guard, async (req, res) => {
        const userId = getLoggedUserId(req, res);
        const user = await User.findById(userId);

        if (userId !== req.params.id && !user?.isAdmin) {
            return res.status(401).send('User not authorized');
        }

        try {
            const user = await User.findById(req.params.id).select("-password");

            if (!user) {
                return res.status(403).send('User not found');
            }

            res.send(user);
        } catch (err) {
            return res.status(403).send('User not found');
        }
    });

    app.put('/users/:id', guard, async (req, res) => {
        const userId = getLoggedUserId(req, res);

        if (userId !== req.params.id) {
            return res.status(401).send('User not authorized');
        }

        const { name, phone, address, image } = req.body;

        const validate = EditUserValid.validate(req.body, { abortEarly: false });

        if (validate.error) {
            const errors = validate.error.details.map(err => err.message);
            return res.status(403).send(errors);
        }

        const obj = await User.findByIdAndUpdate(req.params.id, { name, phone, address, image });

        if (!obj) {
            return res.status(403).send("User not found");
        }

        res.send(obj);
    })

    app.patch('/users/:id', guard, async (req, res) => {
        const userId = getLoggedUserId(req, res);

        if (userId !== req.params.id) {
            return res.status(401).send('User not authorized');
        };

        const user = await User.findById(req.params.id);

        user.isBusiness = !user.isBusiness;

        await user.save();
        res.send(user);

    });

    app.delete('/users/:id', guard, async (req, res) => {
        const userId = getLoggedUserId(req, res);
        const user = await User.findById(userId);

        if (userId !== req.params.id && !user?.isAdmin) {
            return res.status(401).send('User not authorized');
        }

        try {
            await User.findByIdAndDelete(req.params.id);
        } catch (err) {
            return res.status(403).send("User not found");
        }

        res.send();
    })

}